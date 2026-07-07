// Writing manifest — the ordering contract for V3's "Latest writing" list, so the
// homepage never has to parse MDX frontmatter at render time. Each `slug` MUST
// match a file in content/writing/<slug>.mdx exactly (the slug is the route:
// /writing/[slug]). `title`/`date` mirror that file's frontmatter for display —
// keep them in sync when you edit an essay. Lower `order` = newer = shown first.
//
// The full frontmatter contract V4's /writing/[slug] route reads:
//   title · date · author · headerImage ("" = no header) · externalLink · externalLinkLabel

export type WritingEntry = {
  /** matches content/writing/<slug>.mdx and the /writing/[slug] route */
  slug: string;
  /** mirrors the MDX `title` frontmatter */
  title: string;
  /** mirrors the MDX `date` frontmatter (display string) */
  date: string;
  /** sort key for the "Latest writing" list — 1 = newest, shown first */
  order: number;
};

export const writing: WritingEntry[] = [
  {
    slug: "the-hobby-hexagon-is-a-trap",
    title: "The Hobby Hexagon Is a Trap (And I Built One Anyway)",
    date: "July 2026",
    order: 1,
  },
  {
    slug: "when-bigger-means-more-biased",
    title:
      "When Bigger Means More Biased: How Scale Transforms LLMs into Confident Amplifiers of Majority Perspectives",
    date: "May 15th, 2026",
    order: 2,
  },
  {
    slug: "the-third-rotation",
    title: "The Third Rotation",
    date: "May 3rd 2026",
    order: 3,
  },
  {
    slug: "architecture-of-self-justification",
    title: "The Architecture of Self-Justification: How Pride Disguises Moral Failure",
    date: "December 2025",
    order: 4,
  },
];
