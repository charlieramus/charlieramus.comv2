// PREVIEW RESOLVERS — turn the curation config into ready-to-render data.
// -----------------------------------------------------------------------------
// The curation a person edits (`previews` + the pick types) now lives in the
// single editable source, site.config.ts (V9). THIS file keeps the resolver
// functions that read the content catalogs (data/photos.ts + the projects) and
// resolve each pick into render-ready tiles, skipping any id that isn't found.
// Render sites import these from "@/data/previews" unchanged.
//
// TO CHANGE WHAT'S PREVIEWED, EDIT `previews` IN site.config.ts. No component
// edits needed. See the comments on that object for each surface.

import { photos, type Photo } from "@/data/photos";
import { designProjects, type DesignProject } from "@/data/projects-design";
import { webProjects, type WebProject } from "@/data/projects-web";
import { previews } from "@/site.config";
import type { CarouselPick } from "@/site.config";

// Re-export the curation config + pick types so existing importers of
// "@/data/previews" keep resolving unchanged.
export { previews };
export type { PhotoPick, DesignPick, CarouselPick, PreviewConfig } from "@/site.config";

// -----------------------------------------------------------------------------
// Resolvers — turn the curation into ready-to-render data, skipping any pick
// whose id isn't found. Render sites call these; they never look up content
// directly, so the curation stays in one place.
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
