// TRIP RESOLVER (V15) — turns the two INDEPENDENT datasets into the views the
// /photography toggle renders. Pure and deterministic (no client state), so it
// can be imported by a server or client component and stays SSR-stable.
//
//   • galleryPhotos — the "All" grid set: the full captioned gallery, in
//     data/photos.ts order (unchanged from the raw manifest). Captions live in
//     the lightbox.
//   • tripSections  — the "By trip" set: the folder-driven groups from
//     data/trip-photos.ts, ordered by site.config photographyView.tripOrder
//     (listed titles first, in that order; then any unlisted title
//     alphabetically). No captions — each trip photo carries a sticky number.
//
// The two views share nothing except the global number space. Section order is
// authored in site.config.ts (photographyView.tripOrder); the trips themselves
// are authored by dropping folders into public/photos/trips/<Trip Name>/.

import { photos, type Photo } from "@/data/photos";
import { tripPhotoGroups, type TripPhoto } from "@/data/trip-photos";
import { photographyView } from "@/site.config";

/** A labeled trip section for the "By trip" view. */
export type TripSection = { title: string; photos: TripPhoto[] };

/** The "All" grid set — the full captioned gallery, in manifest order. */
export const galleryPhotos: Photo[] = photos;

/** The folder-driven trip sections, ordered by photographyView.tripOrder
 *  (listed first, in that order), then any unlisted trip alphabetically.
 *  Empty groups are dropped. */
export const tripSections: TripSection[] = orderTripSections();

function orderTripSections(): TripSection[] {
  const groups = new Map(tripPhotoGroups.map((g) => [g.title, g.photos]));
  const order = photographyView.tripOrder;
  const listed = order.filter((t) => groups.has(t));
  const unlisted = [...groups.keys()]
    .filter((t) => !order.includes(t))
    .sort((a, b) => a.localeCompare(b));
  return [...listed, ...unlisted]
    .map((title) => ({ title, photos: groups.get(title)! }))
    .filter((section) => section.photos.length > 0);
}
