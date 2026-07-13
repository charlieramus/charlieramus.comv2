// Thin re-export — the values now live in the single editable source,
// site.config.ts (V9). This file preserves the "@/data/site" import surface so
// downstream importers don't change. To edit the domain/name, open site.config.ts.
export { SITE_URL, SITE_NAME } from "@/site.config";
