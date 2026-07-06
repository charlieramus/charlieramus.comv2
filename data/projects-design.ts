// Design work. Seeded from the current site (descriptions verbatim). Image arrays
// live in /public and are wired in V4 — CUSTOMIZE paths then.

export type DesignProject = {
  /** CUSTOMIZE: project name */
  title: string;
  /** CUSTOMIZE: year */
  date: string;
  /** CUSTOMIZE: description */
  description: string;
  /** CUSTOMIZE: image paths in /public (added V4) */
  images?: string[];
};

export const designProjects: DesignProject[] = [
  {
    title: "Notion Brand Pitch",
    date: "2025",
    description:
      "A 10-slide brand strategy pitch for Notion built as a class project. Covers a full brand audit, problem framing, target market, competitive landscape, repositioning strategy, and a new visual identity concept. Produced all in Figma.",
  },
  {
    title: "Spotify IMC Campaign",
    date: "2025",
    description:
      "A 6-panel integrated marketing communications poster board for Spotify, developed for a high school marketing course. Covers campaign strategy, target audience, creative direction, media planning, and budget allocation.",
  },
  {
    title: "Photography Presentation UI",
    date: "2024",
    description:
      "Presentation UI designed around personal travel photography sets. Built in Figma to explore editorial layout, typography-forward design, and how to let images carry the visual weight of a slide.",
  },
];
