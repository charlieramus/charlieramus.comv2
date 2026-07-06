// Photo gallery type + stub. The real gallery is authored in V4 (downscale/thumb/
// blur pipeline, like the current site). Leave `photos` empty for now.

export type Photo = {
  /** full-res image path in /public */
  src: string;
  /** thumbnail path */
  thumb: string;
  /** CUSTOMIZE: descriptive alt text (required for a11y) */
  alt: string;
  /** intrinsic aspect ratio, width / height */
  ratio: number;
  caption?: string;
  code?: string;
  /** base64 blur placeholder for next/image */
  blurDataURL?: string;
};

export const photos: Photo[] = [
  // Populated in V4 from public/photos + a sync step. See DESIGN-BRIEF.md.
];
