// Thin re-export — the design projects now live in the single editable source,
// site.config.ts (V9). This file preserves the "@/data/projects-design" import
// surface so downstream importers don't change. To edit them, open site.config.ts.
export type { DesignProject } from "@/site.config";
export { designProjects } from "@/site.config";
