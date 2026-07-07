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
      "Building Ostiara solo, end to end: a SaaS platform for door-to-door sales teams across home-service verticals — pest control, solar, roofing, fencing, security. Shipped the marketing site, an admin dashboard, and a teams-and-roles system on Clerk Organizations with Supabase row-level security, all wearing a design system I built for it. Ran customer-discovery interviews to learn how reps actually quote prices on a doorstep.",
    tags: ["Next.js", "TypeScript", "Clerk", "Supabase", "Design Systems", "Customer Discovery"],
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
      "Built an architecture-building community on Roblox (Bloxburg): designed and shared original builds that passed 300,000+ views, produced tutorial content, and grew a global audience of fellow builders. Started as genuine enjoyment and became an exercise in showing up consistently.",
    tags: ["Community Building", "Content Creation", "Figma", "3D Modeling"],
    logo: "C",
    logoBg: "var(--color-yellow)",
    logoFg: "#141414",
    start: 2025,
    end: null,
  },
];
