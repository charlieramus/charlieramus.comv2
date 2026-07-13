// Thin re-export — the web projects now live in the single editable source,
// site.config.ts (V9). This file preserves the "@/data/projects-web" import
// surface so downstream importers don't change. To edit them, open site.config.ts.
export type { WebProject } from "@/site.config";
export { webProjects } from "@/site.config";
