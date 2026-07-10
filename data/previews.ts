// PREVIEW CURATION LAYER — the one file that decides *what* the homepage previews.
// -----------------------------------------------------------------------------
// The content catalogs (`data/photos.ts`, `data/projects-web.ts`,
// `data/projects-design.ts`) are the full, source-of-truth libraries. THIS file
// is a thin curation layer on top: it names, by stable id, which items each
// homepage surface shows — and in what order — without touching the catalogs.
//
// TO CHANGE WHAT'S PREVIEWED, EDIT ONLY THIS FILE. No component edits needed.
//   • Photography bento  → `photographyBento`  (photo `code`s)
//   • Graphic-design bento → `graphicDesignBento` (project `title`s)
//   • "Right now" photo  → `rightNowPhoto`      (a photo `code`)
//   • Digital-home carousel → `digitalHomeCarousel` (project `title` + window skin)
//   • Work bands         → `workBands`          (project `title`s, in order)
//
// Every pick references content by a stable id (photo `code`, project `title`).
// If an id doesn't match anything in the catalog it is simply skipped — a typo
// degrades gracefully (that tile drops out) rather than breaking the build.
//
// Each visual pick may also carry a `previewImage` override so a homepage
// preview can differ from the content's own first image (e.g. show a custom
// cover in the design bento instead of slide 1).

import { photos, type Photo } from "@/data/photos";
import { designProjects, type DesignProject } from "@/data/projects-design";
import { webProjects, type WebProject } from "@/data/projects-web";

// -----------------------------------------------------------------------------
// Pick types
// -----------------------------------------------------------------------------

/** A photo pick: a photo `code`, plus an optional image override. */
export type PhotoPick = {
  /** stable photo `code` from data/photos.ts, e.g. "0013" */
  code: string;
  /** optional /public image path to show instead of the photo's own thumb */
  previewImage?: string;
};

/** A design pick: a project `title`, plus an optional cover override. */
export type DesignPick = {
  /** exact project `title` from data/projects-design.ts */
  title: string;
  /** optional /public image path to show instead of the project's slide 1 */
  previewImage?: string;
};

/** A carousel pick: a web-project `title` + which browser-window skin to use. */
export type CarouselPick = {
  /** exact project `title` from data/projects-web.ts */
  title: string;
  /** browser-window skin class (see `.shot` variants in globals.css) */
  variant: "s-acie" | "s-dark" | "s-warm" | "s-lav" | "s-mint";
};

// -----------------------------------------------------------------------------
// THE CURATION — this is the part Charlie edits.
// -----------------------------------------------------------------------------

export type PreviewConfig = {
  photographyBento: PhotoPick[];
  graphicDesignBento: DesignPick[];
  /** the "Right now" highlight photo, named by `code` (see rightNowPhoto below) */
  rightNowPhoto: string;
  digitalHomeCarousel: CarouselPick[];
  workBands: string[];
};

export const previews: PreviewConfig = {
  // CUSTOMIZE: Photography bento — the 4 (or N) photos shown in the "More than
  // code" photography card, in order. Codes come from data/photos.ts.
  // (Film-strip Frames like Longs Peak are skipped here — a square crop clips
  // their baked border.) A `previewImage` may override any tile's thumb.
  photographyBento: [
    { code: "0001" },
    { code: "0013" },
    { code: "0030" },
    { code: "0004" },
  ],

  // CUSTOMIZE: Graphic-design bento — which design projects appear, in order.
  // Default shows each project's slide 1; set `previewImage` to show a custom
  // cover instead.
  graphicDesignBento: [
    { title: "Notion Brand Pitch" },
    { title: "Spotify IMC Campaign" },
    { title: "Photography Presentation UI" },
  ],

  // CUSTOMIZE: "Right now" highlight photo — named directly by its `code` from
  // data/photos.ts. (This card is driven entirely from here now; the `featured`
  // flag in photos.ts no longer decides it.)
  rightNowPhoto: "0055",

  // CUSTOMIZE: Digital-home carousel — which projects tour, in order, and the
  // browser-window skin for each. Titles come from data/projects-web.ts.
  digitalHomeCarousel: [
    { title: "Ostiara", variant: "s-acie" },
    { title: "MyLifeInARepo", variant: "s-dark" },
    { title: "Querryn", variant: "s-warm" },
    { title: "VaultDNA", variant: "s-lav" },
    { title: "charlieramus.com", variant: "s-mint" },
    { title: "Browser-automation experiments", variant: "s-dark" },
  ],

  // CUSTOMIZE: Work bands — the curated projects (in order) for the "Tiny
  // fraction of my work" section. The homepage renders exactly 4 bespoke band
  // visuals, so keep this at 4 titles; extras beyond 4 are ignored.
  workBands: ["Ostiara", "MyLifeInARepo", "charlieramus.com", "VaultDNA"],
};

// -----------------------------------------------------------------------------
// Resolvers — turn the curation above into ready-to-render data, skipping any
// pick whose id isn't found. Render sites call these; they never look up
// content directly, so the curation stays in one place.
// -----------------------------------------------------------------------------

/** A resolved image tile: what to render for a photo/design preview. */
export type PreviewTile = {
  /** stable key for React lists */
  key: string;
  /** image src to render (override or the content's own image) */
  src: string;
  /** blur placeholder — only present when using the content's own thumb */
  blurDataURL?: string;
};

/** Photography-bento tiles, in curation order, missing codes skipped. */
export function bentoPhotoTiles(): PreviewTile[] {
  return previews.photographyBento
    .map((pick): PreviewTile | undefined => {
      const photo = photos.find((p) => p.code === pick.code);
      if (!photo) return undefined;
      if (pick.previewImage) return { key: pick.code, src: pick.previewImage };
      return { key: pick.code, src: photo.thumb, blurDataURL: photo.blurDataURL };
    })
    .filter((t): t is PreviewTile => Boolean(t));
}

/** Graphic-design-bento tiles, in curation order, missing titles skipped. */
export function bentoDesignTiles(): PreviewTile[] {
  return previews.graphicDesignBento
    .map((pick): PreviewTile | undefined => {
      const project: DesignProject | undefined = designProjects.find(
        (p) => p.title === pick.title,
      );
      const src = pick.previewImage ?? project?.images?.[0];
      if (!src) return undefined;
      return { key: pick.title, src };
    })
    .filter((t): t is PreviewTile => Boolean(t));
}

/** The "Right now" highlight photo named in `previews.rightNowPhoto`. Falls back
 *  to the first catalog photo if the code is a typo, so the card never empties. */
export function rightNowPhoto(): Photo | undefined {
  return photos.find((p) => p.code === previews.rightNowPhoto) ?? photos[0];
}

/** A resolved carousel shot: the canonical title + its window skin. */
export type CarouselShot = { title: string; variant: CarouselPick["variant"] };

/** Digital-home carousel shots, in curation order, missing titles skipped. */
export function carouselShots(): CarouselShot[] {
  return previews.digitalHomeCarousel
    .map((pick): CarouselShot | undefined => {
      const project = webProjects.find((p) => p.title === pick.title);
      if (!project) return undefined;
      return { title: project.title, variant: pick.variant };
    })
    .filter((s): s is CarouselShot => Boolean(s));
}

/** Curated work-band projects, in order, missing titles skipped. */
export function workBandProjects(): WebProject[] {
  return previews.workBands
    .map((title) => webProjects.find((p) => p.title === title))
    .filter((p): p is WebProject => Boolean(p));
}
