// Thin re-export — the social links now live in the single editable source,
// site.config.ts (V9). This file preserves the "@/data/socials" import surface so
// downstream importers don't change. To edit links, open site.config.ts.
export type { Social } from "@/site.config";
export { socials, contactEmail } from "@/site.config";
