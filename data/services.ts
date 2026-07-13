// Thin re-export — the services list now lives in the single editable source,
// site.config.ts (V9). This file preserves the "@/data/services" import surface
// so downstream importers don't change. To edit it, open site.config.ts.
export { servicesHeading, servicesSub, services } from "@/site.config";
