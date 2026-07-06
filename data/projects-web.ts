// Web / software projects. Seeded stubs — CUSTOMIZE + expand in V2 from
// ABOUT-CHARLIE.md (what each is, the hard part, links, screenshots).

export type WebProject = {
  /** CUSTOMIZE: project name */
  title: string;
  /** CUSTOMIZE: year or range */
  date: string;
  /** CUSTOMIZE: 1-2 sentence description */
  description: string;
  /** CUSTOMIZE: live/repo link ("" hides) */
  href: string;
  /** CUSTOMIZE: tech tags */
  tags: string[];
  /** CUSTOMIZE: screenshot path in /public (added in V2/V4) */
  image?: string;
};

export const webProjects: WebProject[] = [
  {
    title: "Ostiara",
    date: "2026",
    description:
      "Stealth app helping door-to-door salespeople optimize their routes and work — for individuals and enterprises.",
    href: "https://github.com/charlieramus/ostiara",
    tags: ["JavaScript", "Auth", "Algorithms", "UI/UX"],
  },
  // CUSTOMIZE: add real entries — personal site, WELandscape, personal journal,
  // e-commerce stores, etc. (see ABOUT-CHARLIE.md §4).
];
