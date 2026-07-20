// TRIP RESOLVER (V14) — turns the flat `photos` manifest into the two views the
// /photography toggle renders. Pure and deterministic (no client state), so it
// can be imported by a server or client component and stays SSR-stable.
//
//   • galleryPhotos — the "All" grid set: every photo not explicitly hidden
//     (main !== false). Same order as data/photos.ts.
//   • tripSections  — the "By trip" set: EVERY photo (including main:false),
//     grouped into ordered, labeled sections. Nothing is dropped or duplicated.
//
// Trip labels + section order are authored in site.config.ts (photographyView);
// the per-photo `trip` tag is authored in public/photos/gallery.json.

import { photos, type Photo } from "@/data/photos";
import { photographyView } from "@/site.config";

/** A labeled trip section for the "By trip" view. */
export type TripSection = { title: string; photos: Photo[] };

/** Title of the section that collects photos with no `trip` (only shown when
 *  at least one untagged photo exists). */
export const UNTAGGED_SECTION_TITLE = "More frames";

/** The "All" grid set — every photo not explicitly hidden. main:false photos
 *  live only in their trip section (see tripSections). */
export const galleryPhotos: Photo[] = photos.filter((p) => p.main !== false);

/** All photos grouped into ordered trip sections. Every photo in `photos`
 *  appears in exactly one section; untagged photos land in "More frames". */
export const tripSections: TripSection[] = buildTripSections();

function buildTripSections(): TripSection[] {
  // Group by `trip`, remembering each photo's original manifest index so the
  // within-section tie-break can fall back to gallery order.
  type Item = { photo: Photo; index: number };
  const groups = new Map<string, Item[]>();
  const untagged: Item[] = [];

  photos.forEach((photo, index) => {
    if (photo.trip) {
      const arr = groups.get(photo.trip) ?? [];
      arr.push({ photo, index });
      groups.set(photo.trip, arr);
    } else {
      untagged.push({ photo, index });
    }
  });

  // Within a section: by `date` (asc), then original array order. Missing dates
  // sort first (empty string), then stable by index.
  const byDateThenIndex = (a: Item, b: Item): number => {
    const da = a.photo.date ?? "";
    const db = b.photo.date ?? "";
    if (da !== db) return da < db ? -1 : 1;
    return a.index - b.index;
  };

  // Most-recent photo date in a group — orders the unlisted trips (desc).
  const latestDate = (items: Item[]): string =>
    items.reduce((max, it) => (it.photo.date && it.photo.date > max ? it.photo.date : max), "");

  const order = photographyView.tripOrder;
  // Listed trips first, in config order (skipping any config entry with no
  // photos); then any trip not in the config, newest first.
  const listed = order.filter((t) => groups.has(t));
  const unlisted = [...groups.keys()]
    .filter((t) => !order.includes(t))
    .sort((a, b) => {
      const la = latestDate(groups.get(a)!);
      const lb = latestDate(groups.get(b)!);
      if (la !== lb) return la < lb ? 1 : -1; // desc — newest first
      return a.localeCompare(b);
    });

  const sections: TripSection[] = [...listed, ...unlisted].map((title) => ({
    title,
    photos: groups.get(title)!.slice().sort(byDateThenIndex).map((it) => it.photo),
  }));

  if (untagged.length > 0) {
    sections.push({
      title: UNTAGGED_SECTION_TITLE,
      photos: untagged.slice().sort(byDateThenIndex).map((it) => it.photo),
    });
  }

  return sections;
}
