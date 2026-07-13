// Thin re-export — the career timeline now lives in the single editable source,
// site.config.ts (V9). This file preserves the "@/data/experience" import surface
// so downstream importers don't change. To edit roles, open site.config.ts.
export type { ExperienceLink, Experience } from "@/site.config";
export { entries } from "@/site.config";
