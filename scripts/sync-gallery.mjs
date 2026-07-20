/**
 * sync-gallery.mjs — the reproducible photography pipeline (V4 Stage 2).
 *
 * `public/photos/gallery.json` is the hand-authored source of truth. Each entry is
 *   { "file": "<name>.webp", "caption": "...", "location"?: "...", "featured"?: true,
 *     "trip"?: "Iceland 2026", "main"?: false }
 * where the two V14 fields are optional:
 *   • `trip`  — curated section label for the /photography "By trip" view.
 *   • `main`  — defaults true; set false to HIDE a frame from the "All" grid while
 *               still showing it in its trip section (trip-only extras).
 * For every entry this script:
 *   1. Downscales the full image to MAX_FULL px on the long edge (in place) so a
 *      stray full-res export can't blow up mobile Safari in the lightbox.
 *   2. Generates a grid thumbnail (MAX_THUMB px) in public/photos/thumbs/.
 *   3. Computes the intrinsic ratio (width / height) that drives the masonry sizing.
 *   4. Generates a base64 blur placeholder (plaiceholder) for next/image.
 *   5. Derives `date` ("YYYY-MM") from the filename date stamp when present.
 *   6. Writes data/photos.ts (the typed manifest the page imports).
 *
 * To add photos: drop the .webp into public/photos/, add a line to gallery.json,
 * then run:  npm run sync-gallery
 * Thumbnails, resizing, ratio and blur are all handled for you.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { imageSize } from "image-size";
import { getPlaiceholder } from "plaiceholder";
import sharp from "sharp";

// Long-edge caps. Full = lightbox quality; thumb = grid quality.
// The masonry renders each photo ~180-380px wide, so 600px covers retina.
const MAX_FULL = 2048;
const MAX_THUMB = 600;

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const photosDir = join(root, "public", "photos");
const thumbsDir = join(photosDir, "thumbs");
const galleryPath = join(photosDir, "gallery.json");
const outputPath = join(root, "data", "photos.ts");

mkdirSync(thumbsDir, { recursive: true });

const entries = JSON.parse(readFileSync(galleryPath, "utf8"));

// Pull "YYYY-MM" out of a filename's date stamp: either a leading YYYYMMDD
// (20260412-…) or an embedded YYYY-MM-DD (Frame1-2026-06-20). Returns undefined
// when the filename carries no date (older untitled/aerial shots).
function deriveDate(file) {
  const dashed = file.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (dashed) return `${dashed[1]}-${dashed[2]}`;
  const stamp = file.match(/(?:^|[^\d])(\d{4})(\d{2})(\d{2})(?:[^\d]|$)/);
  if (stamp) return `${stamp[1]}-${stamp[2]}`;
  return undefined;
}

let downscaled = 0;
let thumbed = 0;

const photos = await Promise.all(
  entries.map(async (entry, i) => {
    const code = String(i + 1).padStart(4, "0");
    const fullPath = join(photosDir, entry.file);
    const thumbPath = join(thumbsDir, entry.file);

    let ratio = 1.5;
    let blurDataURL = null;
    let hasThumb = false;

    try {
      let buf = readFileSync(fullPath);
      let { width, height } = imageSize(buf);

      // 1. Guard: downscale the full image in place if it's too big.
      if (Math.max(width, height) > MAX_FULL) {
        buf = await sharp(buf)
          .resize({ width: MAX_FULL, height: MAX_FULL, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer();
        writeFileSync(fullPath, buf);
        ({ width, height } = imageSize(buf));
        downscaled++;
        console.log(`  ↓ Downscaled ${entry.file} to ${width}x${height}`);
      }

      ratio = Math.round((width / height) * 1000) / 1000;

      // 2. Thumbnail for the grid (regenerated every run, cheap).
      try {
        await sharp(buf)
          .resize({ width: MAX_THUMB, height: MAX_THUMB, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 72 })
          .toFile(thumbPath);
        hasThumb = true;
        thumbed++;
      } catch {
        console.warn(`  ⚠ Could not generate thumbnail for ${entry.file}`);
      }

      // 3. Blur placeholder.
      try {
        const { base64 } = await getPlaiceholder(buf, { size: 10 });
        blurDataURL = base64;
      } catch {
        console.warn(`  ⚠ Could not generate blur for ${entry.file}`);
      }
    } catch {
      console.warn(`  ⚠ Could not read ${entry.file} — defaulting to ratio 1.5`);
    }

    return {
      src: `/photos/${entry.file}`,
      thumb: hasThumb ? `/photos/thumbs/${entry.file}` : `/photos/${entry.file}`,
      alt: entry.caption,
      ratio,
      caption: entry.caption,
      code,
      blurDataURL,
      featured: entry.featured === true ? true : undefined,
      location: entry.location || undefined,
      date: deriveDate(entry.file),
      trip: entry.trip || undefined,
      // Omit `main` when true (the default) to keep the manifest lean; only
      // emit it when explicitly false (hidden from the All grid).
      main: entry.main === false ? false : undefined,
    };
  })
);

// Serialize each photo, omitting undefined optionals so the manifest stays lean.
const lines = photos.map((p) => {
  const parts = [
    `src: ${JSON.stringify(p.src)}`,
    `thumb: ${JSON.stringify(p.thumb)}`,
    `alt: ${JSON.stringify(p.alt)}`,
    `ratio: ${p.ratio}`,
    `caption: ${JSON.stringify(p.caption)}`,
    `code: ${JSON.stringify(p.code)}`,
  ];
  if (p.blurDataURL) parts.push(`blurDataURL: ${JSON.stringify(p.blurDataURL)}`);
  if (p.featured) parts.push(`featured: true`);
  if (p.location) parts.push(`location: ${JSON.stringify(p.location)}`);
  if (p.date) parts.push(`date: ${JSON.stringify(p.date)}`);
  if (p.trip) parts.push(`trip: ${JSON.stringify(p.trip)}`);
  if (p.main === false) parts.push(`main: false`);
  return `  { ${parts.join(", ")} }`;
});

const output = `// AUTO-GENERATED by scripts/sync-gallery.mjs — do not edit directly.
// Edit public/photos/gallery.json, then run: npm run sync-gallery
//
// The \`Photo\` type is the V4 gallery contract: src/thumb/alt/ratio drive the
// masonry + lightbox; caption/code show in the lightbox; blurDataURL feeds
// next/image; featured/location/date feed the homepage "Right now" highlight.

export type Photo = {
  /** full-res image path in /public */
  src: string;
  /** thumbnail path */
  thumb: string;
  /** descriptive alt text (mirrors caption) */
  alt: string;
  /** intrinsic aspect ratio, width / height (drives masonry sizing) */
  ratio: number;
  /** caption shown in the lightbox */
  caption?: string;
  /** short overlay code, e.g. a print-order reference */
  code?: string;
  /** base64 blur placeholder for next/image */
  blurDataURL?: string;
  /** true = eligible for the homepage "Right now" highlight */
  featured?: boolean;
  /** where it was shot (e.g. "Iceland") */
  location?: string;
  /** capture month "YYYY-MM" — lets the homepage pick the most recent trip */
  date?: string;
  /** curated trip/section label, e.g. "Iceland 2026" (V14 "By trip" view) */
  trip?: string;
  /** false = hidden from the All grid but still shown in its trip section */
  main?: boolean;
};

export const photos: Photo[] = [
${lines.join(",\n")}
];
`;

writeFileSync(outputPath, output, "utf8");
console.log(
  `✓ Synced ${photos.length} photos → data/photos.ts ` +
    `(${thumbed} thumbnails, ${downscaled} downscaled)`
);
