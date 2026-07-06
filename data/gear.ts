// Photography gear. Seeded from the current site. CUSTOMIZE names/notes/links.

export type GearItem = {
  name: string;
  /** short note, e.g. "Primary body" ("" hides) */
  note: string;
  /** manufacturer/retailer URL ("" hides link) */
  href: string;
};

export const gear: Record<string, GearItem[]> = {
  bodies: [
    { name: "Canon EOS R5", note: "Primary body", href: "" },
    { name: "DJI Air 2s Combo", note: "Primary drone", href: "" },
  ],
  lenses: [
    { name: "Canon RF 24-105mm f/4", note: "", href: "" },
    { name: "Sigma 150-600mm f/5.6-6.3", note: "", href: "" },
  ],
  bags: [
    { name: "Kiboko V1 30L+", note: "Long travel / high capacity", href: "" },
    { name: "Thule Aspect V2", note: "Everyday carry", href: "" },
  ],
  accessories: [
    { name: "Carbon-fiber tripod", note: "", href: "" },
    { name: "Deity V-Mic D4 Mini", note: "", href: "" },
  ],
};

export const gearSections: { key: keyof typeof gear; label: string }[] = [
  { key: "bodies", label: "Camera Bodies" },
  { key: "lenses", label: "Lenses" },
  { key: "bags", label: "Bags" },
  { key: "accessories", label: "Accessories" },
];
