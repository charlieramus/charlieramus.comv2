// Web / software projects. Expanded in V2 from ABOUT-CHARLIE.md §4 + Side
// Projects (what each is + the hard part). Ordered: flagship first, then
// spotlight picks, then the long tail. `spotlight` marks the featured tier so
// V3 can build a "highlights" surface without relying on array position alone.
// Screenshots (`image`) are authored in V4.

export type WebProject = {
  /** CUSTOMIZE: project name */
  title: string;
  /** CUSTOMIZE: year or range (some are approximate — confirm) */
  date: string;
  /** CUSTOMIZE: 1-3 sentences — what it is + the hard part */
  description: string;
  /** CUSTOMIZE: live/repo link ("" hides) */
  href: string;
  /** CUSTOMIZE: tech tags */
  tags: string[];
  /** CUSTOMIZE: true = featured/"highlights" tier (V3 reads this). */
  spotlight?: boolean;
  /** CUSTOMIZE: screenshot path in /public (added in V4) */
  image?: string;
};

export const webProjects: WebProject[] = [
  {
    title: "Ostiara",
    date: "2026",
    description:
      "A SaaS platform for door-to-door sales teams across home-service verticals — pest control, solar, roofing, fencing, security. Built solo end to end: marketing site, admin dashboard, and a teams-and-roles system on Clerk Organizations with Supabase row-level security. The hard part was customer discovery — reps split between fixed-price menus and measure-on-site quoting, and that split changes what the tool owes each group.",
    href: "https://github.com/charlieramus/ostiara",
    tags: ["Next.js", "TypeScript", "Clerk", "Supabase", "Design Systems"],
    spotlight: true,
  },
  {
    title: "MyLifeInARepo",
    date: "2026",
    description:
      "A personal life-tracking system built as a git repo of daily markdown files, parsed into structured data and rendered through a Next.js dashboard. Includes a financial module for net worth, budgeting, and cash-flow forecasting, plus a bank-statement import pipeline and a transaction-categorization engine modeled on how Monarch Money handles rule-based categorization. The hard part: turning freeform daily notes into reliable structured data.",
    href: "",
    tags: ["Next.js", "TypeScript", "Markdown", "Personal Finance"],
    spotlight: true,
    image: "/images/web/mylifeinarepo.webp",
  },
  {
    title: "Querryn",
    date: "2025",
    description:
      "A Chrome extension that rates the credibility of sources for students writing academic papers, using a tiered domain-trust system, and exports citations in MLA, APA, Chicago, and BibTeX. Submitted to the Chrome Web Store.",
    href: "",
    tags: ["Chrome Extension", "TypeScript", "EdTech"],
  },
  {
    title: "VaultDNA",
    date: "2026",
    description:
      "An Obsidian plugin that encodes a personal knowledge base into synthetic DNA sequences, built around real DNA-storage constraints like homopolymer-run limits and GC-content biasing. Scoped as a quick one-to-two-week build alongside Ostiara.",
    href: "",
    tags: ["Obsidian Plugin", "TypeScript", "Biotech"],
  },
  {
    title: "charlieramus.com",
    date: "2025 — Present",
    description:
      "This site — a personal portfolio in Next.js, TypeScript, and Tailwind, with MDX for writing and a masonry photography grid backed by a fullscreen lightbox.",
    href: "https://charlieramus.com",
    tags: ["Next.js", "TypeScript", "Tailwind", "MDX"],
    image: "/images/web/charlieramus-com.webp",
  },
  {
    title: "Browser-automation experiments",
    date: "2025",
    description:
      "A Chrome extension exploring the chrome.debugger protocol, using Input.dispatchKeyEvent to script keystroke-level input into web pages — a deep dive into a browser API most developers never touch.",
    href: "",
    tags: ["Chrome Extension", "chrome.debugger", "Automation"],
  },
];
