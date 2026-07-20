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

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
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
const tripsDir = join(photosDir, "trips");
const galleryPath = join(photosDir, "gallery.json");
const numbersPath = join(photosDir, "numbers.json");
const outputPath = join(root, "data", "photos.ts");
const tripOutputPath = join(root, "data", "trip-photos.ts");

mkdirSync(thumbsDir, { recursive: true });

const entries = JSON.parse(readFileSync(galleryPath, "utf8"));

// STICKY GLOBAL NUMBER MAP (V15) ------------------------------------------------
// public/photos/numbers.json is the committed print-reference source of truth:
//   { "<path relative to public/photos/>": "<zero-padded code>" }
// It is append-only — a photo keeps its code for life, and a removed photo's
// entry is retained so its number is retired (never reused). codeFor() returns
// the existing code for a path or mints the next (max+1). Seeding an empty map
// from the gallery in array order reproduces today's 0001…0061 exactly.
let numbers = {};
try {
  numbers = JSON.parse(readFileSync(numbersPath, "utf8"));
} catch {
  numbers = {};
}
let numbersDirty = false;

function codeFor(relPath) {
  const existing = numbers[relPath];
  if (existing) return existing;
  let max = 0;
  for (const c of Object.values(numbers)) {
    const n = parseInt(c, 10);
    if (Number.isFinite(n) && n > max) max = n;
  }
  const next = max + 1;
  const code = String(next).padStart(Math.max(4, String(next).length), "0");
  numbers[relPath] = code;
  numbersDirty = true;
  return code;
}

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

// Shared per-image processing (used by the trips pass; the gallery pass inlines
// the same steps for its own manifest): downscale guard → grid thumbnail → blur.
// Returns the intrinsic ratio, blur placeholder, and whether a thumbnail landed.
async function processImage(fullPath, thumbPath, label) {
  let ratio = 1.5;
  let blurDataURL = null;
  let hasThumb = false;
  try {
    let buf = readFileSync(fullPath);
    let { width, height } = imageSize(buf);

    if (Math.max(width, height) > MAX_FULL) {
      buf = await sharp(buf)
        .resize({ width: MAX_FULL, height: MAX_FULL, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
      writeFileSync(fullPath, buf);
      ({ width, height } = imageSize(buf));
      downscaled++;
      console.log(`  ↓ Downscaled ${label} to ${width}x${height}`);
    }

    ratio = Math.round((width / height) * 1000) / 1000;

    try {
      await sharp(buf)
        .resize({ width: MAX_THUMB, height: MAX_THUMB, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 72 })
        .toFile(thumbPath);
      hasThumb = true;
      thumbed++;
    } catch {
      console.warn(`  ⚠ Could not generate thumbnail for ${label}`);
    }

    try {
      const { base64 } = await getPlaiceholder(buf, { size: 10 });
      blurDataURL = base64;
    } catch {
      console.warn(`  ⚠ Could not generate blur for ${label}`);
    }
  } catch {
    console.warn(`  ⚠ Could not read ${label} — defaulting to ratio 1.5`);
  }
  return { ratio, blurDataURL, hasThumb };
}

const photos = await Promise.all(
  entries.map(async (entry) => {
    const code = codeFor(entry.file);
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

// TRIPS PASS (V15) --------------------------------------------------------------
// Folder-driven "By trip" dataset. Each immediate subdir of public/photos/trips/
// is a trip; its basename is the section title. Photos are listed in NATURAL
// filename order (deterministic, so the sticky numbers never reshuffle). Same
// downscale guard + thumbnail + blur as the gallery, and the same codeFor() so
// trip photos number upward from the gallery max. No captions — alt is the trip
// name + the photo's number ("<title> — <NN>"). Runs after the gallery pass so
// gallery codes are all assigned first.
mkdirSync(tripsDir, { recursive: true });

const IMAGE_RE = /\.(jpe?g|png|webp)$/i;
const IGNORED_DIRS = new Set(["thumbs", ".thumbs"]);
const naturalSort = (a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

const tripDirNames = readdirSync(tripsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !IGNORED_DIRS.has(d.name))
  .map((d) => d.name)
  .sort(naturalSort);

const tripPhotoGroups = [];
for (const title of tripDirNames) {
  const tripDir = join(tripsDir, title);
  const tripThumbsDir = join(tripDir, "thumbs");
  const files = readdirSync(tripDir, { withFileTypes: true })
    .filter((d) => d.isFile() && IMAGE_RE.test(d.name))
    .map((d) => d.name)
    .sort(naturalSort);
  if (files.length === 0) continue;
  mkdirSync(tripThumbsDir, { recursive: true });

  const groupPhotos = [];
  for (const file of files) {
    const relPath = `trips/${title}/${file}`;
    const code = codeFor(relPath);
    const fullPath = join(tripDir, file);
    const thumbPath = join(tripThumbsDir, file);
    const { ratio, blurDataURL, hasThumb } = await processImage(fullPath, thumbPath, relPath);
    groupPhotos.push({
      src: `/photos/${relPath}`,
      thumb: hasThumb ? `/photos/trips/${title}/thumbs/${file}` : `/photos/${relPath}`,
      alt: `${title} — ${parseInt(code, 10)}`,
      ratio,
      code,
      blurDataURL,
    });
  }
  tripPhotoGroups.push({ title, photos: groupPhotos });
}

// Serialize the grouped trip manifest — grouped by folder, ordered
// alphabetically by title here (Stage 3's resolver applies tripOrder). Omit
// undefined optionals; deterministic field order for clean diffs.
const tripGroupBlocks = tripPhotoGroups.map((group) => {
  const photoLines = group.photos.map((p) => {
    const parts = [
      `src: ${JSON.stringify(p.src)}`,
      `thumb: ${JSON.stringify(p.thumb)}`,
      `alt: ${JSON.stringify(p.alt)}`,
      `ratio: ${p.ratio}`,
      `code: ${JSON.stringify(p.code)}`,
    ];
    if (p.blurDataURL) parts.push(`blurDataURL: ${JSON.stringify(p.blurDataURL)}`);
    return `      { ${parts.join(", ")} }`;
  });
  return `  {\n    title: ${JSON.stringify(group.title)},\n    photos: [\n${photoLines.join(",\n")}\n    ],\n  }`;
});

const tripOutput = `// AUTO-GENERATED by scripts/sync-gallery.mjs — do not edit directly.
// Drop photos into public/photos/trips/<Trip Name>/, then run: npm run sync-gallery
//
// The folder-driven "By trip" dataset (V15). Each subdir of public/photos/trips/
// is a trip; the folder name is the section title. No captions — the sticky
// print-reference \`code\` (see public/photos/numbers.json) is the only label.

export type TripPhoto = {
  /** full-res image path in /public */
  src: string;
  /** thumbnail path */
  thumb: string;
  /** alt text — trip name + the photo's number (there is no caption) */
  alt: string;
  /** intrinsic aspect ratio, width / height (drives masonry sizing) */
  ratio: number;
  /** sticky global print-reference number */
  code: string;
  /** base64 blur placeholder for next/image */
  blurDataURL?: string;
};

export const tripPhotoGroups: { title: string; photos: TripPhoto[] }[] = [${
  tripGroupBlocks.length ? "\n" + tripGroupBlocks.join(",\n") + "\n" : ""
}];
`;

writeFileSync(tripOutputPath, tripOutput, "utf8");

// Persist the sticky number map when it grew (new photos took fresh codes).
// Sorted by code for a clean, append-only diff. Untouched map → no rewrite
// (idempotent), so re-running sync leaves numbers.json byte-identical.
if (numbersDirty) {
  const sorted = Object.fromEntries(
    Object.entries(numbers).sort((a, b) => a[1].localeCompare(b[1]))
  );
  writeFileSync(numbersPath, JSON.stringify(sorted, null, 2) + "\n", "utf8");
  console.log(`  ↦ Updated numbers.json (${Object.keys(sorted).length} codes)`);
}

console.log(
  `✓ Synced ${photos.length} photos → data/photos.ts ` +
    `(${thumbed} thumbnails, ${downscaled} downscaled)`
);
