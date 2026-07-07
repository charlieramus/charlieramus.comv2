// The "Services" section list. Reframed in V2 from the mockup's for-hire agency
// copy ("I've got your back with… / connect with your users") into an honest
// capabilities/toolkit list — Charlie is a solo builder, not an agency. Every
// item traces to real work in the other data files (Ostiara stack, the Notion/
// Spotify design work, the Canon R5 + drone kit, the essays, the Roblox community).
//
// Shape matches components/services.tsx exactly (a flat string[] rendered one per
// .svc-grid cell), so V3 swaps the inline `SERVICES` array for `import { services }`.
// The grid is 3 columns; 9 items keeps the mockup's 3×3. CUSTOMIZE freely.

/** Section heading + subhead (CUSTOMIZE — replaces the mockup's for-hire copy). */
export const servicesHeading = "Things I build and make";
export const servicesSub =
  "Full products end to end — the engineering, the design system, and the story around them.";

/** One label per .svc-grid cell. Keep to multiples of 3 for the grid. */
export const services: string[] = [
  "Full-product builds",
  "Next.js / TypeScript",
  "Design systems",
  "Brand & identity",
  "Marketing design",
  "Photography",
  "Drone / aerial",
  "Technical writing",
  "Content & community",
];
