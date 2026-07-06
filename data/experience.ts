// Experience / career — single source of truth. Seeded from the current site.
// Newest-first. To add a role: copy an entry, fill the CUSTOMIZE fields.

export type ExperienceLink = { label: string; href: string };

export type Experience = {
  /** CUSTOMIZE: date range string shown as-is, e.g. "2026 — Present" */
  dates: string;
  /** CUSTOMIZE: position / role name */
  title: string;
  /** CUSTOMIZE: company or org name ("" hides it) */
  org: string;
  /** CUSTOMIZE: org link URL ("" hides the arrow icon) */
  href: string;
  /** CUSTOMIZE: reference links, or [] */
  links: ExperienceLink[];
  /** CUSTOMIZE: 2-4 sentence description of what you did and learned */
  description: string;
  /** CUSTOMIZE: skill tag strings */
  tags: string[];
  /** Single-letter mark for the timeline chip. Defaults to org/title initial. */
  logo?: string;
  /** Timeline chip background — a theme token, e.g. "var(--color-blue)". */
  logoBg?: string;
  /** Timeline chip letter color. */
  logoFg?: string;
  /** Numeric start year (vertical timeline placement). */
  start?: number;
  /** Numeric end year; null = present. */
  end?: number | null;
};

export const entries: Experience[] = [
  {
    dates: "2026 — Present",
    title: "Stealth Startup (Ostiara)",
    org: "",
    href: "",
    links: [{ label: "GitHub", href: "https://github.com/charlieramus/ostiara" }],
    description:
      "An app for door-to-door salespeople to optimize their work — built for individual salespeople and enterprises.",
    tags: ["JavaScript", "Auth", "Branding", "Algorithms", "UI/UX Design", "Databases"],
    logo: "S",
    logoBg: "var(--color-blue)",
    logoFg: "#fff",
    start: 2026,
    end: null,
  },
  {
    dates: "2026 — Present",
    title: "TA & Media Manager (Seasonal)",
    org: "Liberty Puzzles",
    href: "https://libertypuzzles.com/pages/about-us",
    links: [],
    description:
      "Puzzle assembly and customer tours for a high-end puzzle company. Managed social accounts, created content, and engaged the puzzle community.",
    tags: ["Photography", "Videography", "Lightroom", "Visual Storytelling"],
    logo: "L",
    logoBg: "var(--color-red)",
    logoFg: "#fff",
    start: 2026,
    end: null,
  },
  {
    dates: "2025 — Present",
    title: "Content Creator & Builder",
    org: "",
    href: "",
    links: [],
    description:
      "Built an architecture community. Designed and shared original architectural builds grabbing 300,000+ interactions, created tutorial content, and engaged a community of fellow builders.",
    tags: ["Community Building", "Content Creation", "Figma", "3D Modeling"],
    logo: "C",
    logoBg: "var(--color-yellow)",
    logoFg: "#141414",
    start: 2025,
    end: null,
  },
];
