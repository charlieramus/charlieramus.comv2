// Thin re-export — the bio values now live in the single editable source,
// site.config.ts (V9). This file preserves the "@/data/about" import surface so
// downstream importers don't change. To edit the copy, open site.config.ts.
export type { Snapshot } from "@/site.config";
export { snapshot, aboutParagraphs, tagline, finaleQuote } from "@/site.config";
