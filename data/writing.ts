// Thin re-export — the writing manifest now lives in the single editable source,
// site.config.ts (V9). This file preserves the "@/data/writing" import surface so
// downstream importers don't change. To edit the manifest, open site.config.ts.
// (Essay bodies still live in content/writing/<slug>.mdx.)
export type { WritingEntry } from "@/site.config";
export { writing } from "@/site.config";
