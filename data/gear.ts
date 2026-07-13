// Thin re-export — the gear list now lives in the single editable source,
// site.config.ts (V9). This file preserves the "@/data/gear" import surface so
// downstream importers don't change. To edit gear, open site.config.ts.
export type { GearItem } from "@/site.config";
export { gear, gearSections } from "@/site.config";
