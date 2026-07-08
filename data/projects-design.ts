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
  /** shared aspect ratio (w/h) of this project's slides — drives the frame so
   *  slides render un-cropped. Slides within a project are uniform. */
  ratio?: number;
};

export const designProjects: DesignProject[] = [
  {
    title: "Notion Brand Pitch",
    date: "2025",
    description:
      "A 10-slide brand strategy pitch for Notion built as a class project. Covers a full brand audit, problem framing, target market, competitive landscape, repositioning strategy, and a new visual identity concept. Produced all in Figma.",
    ratio: 16 / 9,
    images: [
      "/images/design/notion/01-Titlemp4.webp",
      "/images/design/notion/02-Brand-Auditmp4.webp",
      "/images/design/notion/03-The-Problemmp4.webp",
      "/images/design/notion/04-Target-Marketmp4.webp",
      "/images/design/notion/05-Competitor-Landscapemp4.webp",
      "/images/design/notion/06-New-Positioningmp4.webp",
      "/images/design/notion/07-New-Identitymp4.webp",
      "/images/design/notion/08-Feature-AI-Agentsmp4.webp",
      "/images/design/notion/09-Feature-Mail-and-Calendarmp4.webp",
      "/images/design/notion/10-Financialsmp4.webp",
    ],
  },
  {
    title: "Spotify IMC Campaign",
    date: "2025",
    description:
      "A 6-panel integrated marketing communications poster board for Spotify, developed for a high school marketing course. Covers campaign strategy, target audience, creative direction, media planning, and budget allocation.",
    ratio: 1.477,
    images: [
      "/images/design/spotify/IMC-6-Slide-Poster-Board1mp4.webp",
      "/images/design/spotify/IMC-6-Slide-Poster-Board2mp4.webp",
      "/images/design/spotify/IMC-6-Slide-Poster-Board3mp4.webp",
      "/images/design/spotify/IMC-6-Slide-Poster-Board4mp4.webp",
      "/images/design/spotify/IMC-6-Slide-Poster-Board5mp4.webp",
      "/images/design/spotify/IMC-6-Slide-Poster-Board6mp4.webp",
    ],
  },
  {
    title: "Photography Presentation UI",
    date: "2024",
    description:
      "Presentation UI designed around personal travel photography sets. Built in Figma to explore editorial layout, typography-forward design, and how to let images carry the visual weight of a slide.",
    ratio: 9 / 16,
    images: [
      "/images/design/photography-ui/florida-1.webp",
      "/images/design/photography-ui/florida-2.webp",
      "/images/design/photography-ui/florida-3.webp",
      "/images/design/photography-ui/bvi.webp",
    ],
  },
];
