// Photo gallery type + stub. The real gallery is authored in V4 (downscale/thumb/
// blur pipeline, like the current site). Leave `photos` empty for now.

export type Photo = {
  /** full-res image path in /public */
  src: string;
  /** thumbnail path */
  thumb: string;
  /** CUSTOMIZE: descriptive alt text (required for a11y) */
  alt: string;
  /** intrinsic aspect ratio, width / height (drives masonry sizing) */
  ratio: number;
  /** CUSTOMIZE: caption shown in the lightbox / on hover */
  caption?: string;
  /** CUSTOMIZE: short overlay label, e.g. a location or shot code */
  code?: string;
  /** base64 blur placeholder for next/image */
  blurDataURL?: string;
  // --- Finalized in V3-prep (Stage 3): fields V3's "highlights" surface reads.
  //     All optional so V4's sync step can populate them incrementally. ---
  /** CUSTOMIZE: true = eligible for the homepage "highlights" surface (V3). */
  featured?: boolean;
  /** CUSTOMIZE: where it was shot (e.g. "British Virgin Islands"). */
  location?: string;
  /** CUSTOMIZE: capture date "YYYY-MM" — lets V3 pick the most recent trip. */
  date?: string;
};

export const photos: Photo[] = [
  // Populated in V4 from public/photos + a sync step. See DESIGN-BRIEF.md.
];
