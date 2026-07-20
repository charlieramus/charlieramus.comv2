charlie

# UPDATELOG V14 — PHOTOGRAPHY: "ALL / BY TRIP" TOGGLE
# Work on one stage at a time. Do NOT combine stages.

**First read `AGENTS.md`, `DESIGN-BRIEF.md`, `site.config.ts`, `public/photos/gallery.json`,
`scripts/sync-gallery.mjs`, and the V10 photography stages (the vertical marquee lives on this
page).** Today `/photography` renders **all** photos in one masonry grid
(`components/photography-gallery.tsx` → the shared `Lightbox`). The photo data is generated:
you hand-edit `public/photos/gallery.json` (`{ file, caption, location?, featured? }`), then
`npm run sync-gallery` produces `data/photos.ts` (adding `ratio`, `thumb`, `blurDataURL`, a
sequential `code`, and a filename-derived `date`).

**This log adds a view toggle to `/photography`: `All` and `By trip`.** `All` is the current
masonry, unchanged. `By trip` groups every frame into labeled trip sections ("Iceland 2026",
"Cape Cod 2026", …), each photo showing its **number** (`code`) with **no caption**, and the
By-trip view can include **more** frames than the main grid — shots you tag as trip-only.

**A trip = a curated `trip` label you tag per photo in `gallery.json`** (e.g. "Iceland 2026").
Trips are authored, not auto-derived at runtime — your `location` strings are too messy for
that ("Colorado" / "Boulder, Colorado" / "Longs Peak, Colorado" span months). A one-time seed
tags the current photos so the view works immediately; you rename freely afterward.

This log builds the data plumbing, the grouping resolver, the toggle, the trip view, and the
number-badge / caption-suppression treatment. It does **not** add new photo assets (the
trip-only extras are yours to drop in later) and does **not** touch the homepage, the
`/photography` vertical marquee, or any other route.

## Decisions (agreed with Charlie, 2026-07-14)
- **`trip` tag + `main` flag in `gallery.json`.** Two new optional per-photo fields:
  `trip?: string` (the section title) and `main?: boolean` (**defaults true**; `false` = hidden
  from the `All` grid but still shown in its trip section). `sync-gallery.mjs` passes both
  through; the generated `Photo` type gains `trip?` and `main?`.
- **`All` view is unchanged and non-regressive.** It renders `photos.filter(p => p.main !== false)`
  in the existing masonry with the existing lightbox (captions in the lightbox as today). With
  every current photo seeded `main: true`, `All` looks identical to now.
- **`By trip` view = every frame, grouped.** Sections ordered by a `tripOrder` list in
  `site.config.ts`, then any unlisted trips by most-recent `date`. Photos within a trip ordered
  by `date` (then gallery order). Photos with **no** `trip` collect in a final "More frames"
  section so nothing ever disappears. Each tile shows a **corner number badge** = the global
  `code` (the stable print reference, NOT renumbered per trip); **no caption text** is shown.
- **Toggle = a segmented `All / By trip` control**, client-side, default `All`. Keyboard
  operable, `aria-pressed`, reduced-motion safe. It shares the page with the existing marquee
  rail — it must not collide with it.
- **Lightbox gains a `showCaptions` prop** (default true). The `By trip` view passes `false`
  so the lightbox shows the number (`code`) but not the caption. `alt` text is unchanged in
  both views (accessibility is not a view toggle).
- **Config-driven.** `tripOrder` + the toggle labels live in `site.config.ts` behind
  `// CUSTOMIZE`. `data/photos.ts` stays generated (never hand-edited); trip tags are authored
  in `gallery.json`.
- **Medium feature, five stages:** data + pipeline (+ seed) → grouping resolver + config →
  the toggle + trip view → lightbox caption-suppression + badge/section CSS → verify gate.

## Hard constraints (carry over from V7–V13)
- **`All` view is byte-identical to today** once seeded (all current photos `main: true`). No
  existing rendered photo, order, caption, or the marquee may change.
- **`data/photos.ts` is generated — never hand-edit it.** All photo-level authoring happens in
  `gallery.json`; the type/shape changes happen in `sync-gallery.mjs`. Re-run `npm run
  sync-gallery` to regenerate.
- **Lightbox correctness (do not break).** In each view the lightbox operates over that view's
  flattened photo list in render order; clicking a tile opens the correct index and ← / → step
  the whole active view (same discipline as the V10 design-gallery global-index fix).
- **Static export intact.** `/photography` stays a single static route; the toggle is
  client-side state, no new route, no `output: export` change.
- **Motion respects `prefers-reduced-motion`** (toggle transitions, any reveal). The marquee's
  existing reduced-motion freeze is untouched.
- **Tailwind v4 CSS-first.** New classes (`.gallery-toggle`, `.trip-section`, `.photo-badge`,
  …) go in `app/globals.css` on existing `@theme` tokens. No new tokens, no new deps.
- Verify each stage with `tsc --noEmit` + `npm run lint` + `next build` (export). No horizontal
  scroll at 1440 / 768 / 375, no console errors. Don't commit/push unless Charlie asks
  (`/complete-updatelog` handles the `stage<N>v14` commits when run).

---

## Stage 1 — Data + pipeline: `trip` / `main` fields (+ seed the current photos)

Teach the gallery pipeline about trips, then seed the existing 61 photos so the By-trip view
has real groups the moment the UI lands.

```
1. gallery.json (public/photos/gallery.json): add two OPTIONAL fields to the per-photo entry
   shape — `trip` (string, the section title) and `main` (boolean, default true). Do not remove
   `caption` / `location` / `featured`.
2. scripts/sync-gallery.mjs: pass `trip` and `main` through from each gallery.json entry into
   the generated Photo object (omit `main` when true to keep the file small, or emit it — your
   call, but the generated type must allow it). Update the generated `Photo` type block the
   script writes to include:
     trip?: string;   // curated trip/section label, e.g. "Iceland 2026"
     main?: boolean;   // false = hidden from the All grid but shown in its trip
   Keep every other generated field (src/thumb/alt/ratio/caption/code/blurDataURL/featured/
   location/date) exactly as-is. Order fields deterministically so the diff stays clean.
3. SEED the current photos: in gallery.json, add a `trip` to each existing photo derived from
   its location + capture year as a STARTING POINT Charlie will rename. Suggested mapping:
     - Iceland (2026-04)                 → "Iceland 2026"
     - British Virgin Islands            → "British Virgin Islands 2026"
     - Kauai                             → "Kauai 2026"
     - Mexico                            → "Mexico 2026"
     - Boston                            → "Boston 2026"
     - Portland, Oregon                  → "Portland 2026"
     - Boulder, Colorado / Colorado /
       Longs Peak, Colorado              → "Colorado 2026" (group the three Colorado strings)
     - use the photo's `date` year where present; where a location is absent, leave `trip`
       UNSET (those fall into the "More frames" section later).
   Set `main` to true (or leave unset) on all current photos — the All grid stays identical.
   Add a // note in gallery.json's header comment documenting the two new fields for Charlie.
4. Run `npm run sync-gallery` and commit the regenerated data/photos.ts as part of the stage.

Verify: npm run sync-gallery regenerates data/photos.ts with `trip` populated on the located
photos and the new type fields present; tsc --noEmit clean; npm run lint clean; next build
(export) green. Report the distinct trip labels produced and how many photos landed in each,
plus how many have no trip (the future "More frames" bucket).
```

## Stage 1 Report

- [x] **`gallery.json` — two new optional fields + seed.** Added `trip` (section
  label) to every located photo and left it unset on the four location-less shots
  (the Ripple abstract + the three Land Rover frames). `main` is left unset on all
  61 (defaults true), so the All grid is unchanged. `caption` / `location` /
  `featured` are untouched.
- [x] **Seed mapping applied** exactly as the spec suggested, grouping the three
  Colorado location strings ("Boulder, Colorado" / "Colorado" / "Longs Peak,
  Colorado") into one **"Colorado 2026"**. Resulting distinct trips + counts:
  - Iceland 2026 — **22**
  - Colorado 2026 — **22** (Boulder + Colorado + Longs Peak)
  - British Virgin Islands 2026 — **7**
  - Kauai 2026 — **2**
  - Mexico 2026 — **2**
  - Boston 2026 — **1**
  - Portland 2026 — **1**
  - **No trip (future "More frames" bucket)** — **4** (codes 0011, 0032, 0033, 0034)
  - Sum: 57 tagged + 4 untagged = **61** (= photos.length).
- [x] **`scripts/sync-gallery.mjs`** — header block now documents the two V14 fields;
  the generated Photo object gains `trip: entry.trip || undefined` and
  `main: entry.main === false ? false : undefined` (main omitted when true to keep
  the manifest lean); the serializer appends `trip` / `main: false` after `date`;
  and the generated `Photo` type block gains `trip?: string` and `main?: boolean`.
  Every other field is byte-identical.
- [x] **Regenerated** `data/photos.ts` via `npm run sync-gallery` — 61 photos, 61
  thumbnails, 0 downscaled (no full-res image churn; thumbnails re-encoded
  identically, so the git diff is just `data/photos.ts`, `gallery.json`, and the
  script). `trip` is populated on the 57 located photos; no `main` keys emitted
  (none are false yet).
- **Deviation (documented):** the spec asked for a `//` header comment inside
  `gallery.json`, but that file is strict JSON parsed by `JSON.parse` — a comment
  would break the build. The two new fields are documented in the
  `sync-gallery.mjs` header (which already documents the entry shape) instead.

Verify: `tsc --noEmit` clean · `npm run lint` clean · `next build` (export) green,
`/photography` still a single static route.

---

## Stage 2 — Grouping resolver + config surface

The data-layer logic that turns the flat `photos` array into ordered trip sections, plus the
config knobs — no UI yet, so it's easy to reason about and hard to break.

```
1. site.config.ts: add a small photography view-config block (near sections.pages.photography
   or the DECORATION area), each with a // CUSTOMIZE note:
     - a `photography` object (or extend the existing section copy) holding:
         viewLabels: { all: "All", byTrip: "By trip" }   // the toggle button labels
         tripOrder: string[]                              // explicit trip section order
     Seed `tripOrder` with the seeded trip names in the order Charlie will likely want
     (e.g. ["Iceland 2026", "Colorado 2026", "British Virgin Islands 2026", ...]).
2. Add a resolver module (data/trips.ts, or extend data/previews.ts) exporting:
     - `galleryPhotos`: photos.filter(p => p.main !== false)   // the All grid set
     - `tripSections`: an ordered array of { title, photos } where:
         * photos are grouped by their `trip`;
         * sections are ordered by tripOrder first, then any unlisted trips by most-recent
           photo `date` (desc);
         * within a section, photos are ordered by `date` (asc), then original array order;
         * photos with no `trip` are gathered into a final { title: "More frames", photos }
           section (only if any exist);
         * EVERY photo appears in exactly one section (nothing dropped), including main:false.
   Keep this pure/deterministic (no client state) so it can be imported by a server or client
   component and stays SSR-stable.
3. Do NOT change any component yet. This stage is data + config only.

Verify: tsc --noEmit clean; npm run lint clean; next build (export) green (nothing renders the
new exports yet, so the page is unchanged). Add a tiny sanity check in the report: paste the
resolved section titles + per-section counts and confirm the total across sections equals
photos.length (no photo lost, no duplicate).
```

## Stage 2 Report

- [x] **`site.config.ts` — `photographyView` config block** added right after the
  `marquees` array (both are /photography config), behind a `// CUSTOMIZE` note.
  Exports a typed `PhotographyView` = `{ viewLabels: { all, byTrip }, tripOrder }`.
  Seeded `viewLabels: { all: "All", byTrip: "By trip" }` and `tripOrder` in a
  sensible default order (big/recent trips first): Iceland 2026, Colorado 2026,
  British Virgin Islands 2026, Kauai 2026, Mexico 2026, Boston 2026, Portland 2026.
- [x] **`data/trips.ts` — pure resolver module** (new). Exports:
  - `galleryPhotos: Photo[]` = `photos.filter(p => p.main !== false)` — the All set.
  - `tripSections: TripSection[]` = every photo grouped into ordered
    `{ title, photos }` sections: listed trips first in `tripOrder`, then any
    unlisted trip by most-recent photo `date` (desc); within a section by `date`
    asc then original array order; untagged photos gathered into a final
    `"More frames"` section (only when any exist). Also exports
    `UNTAGGED_SECTION_TITLE`. No client state — SSR-stable, importable anywhere.
- [x] **No component touched** — data + config only; `/photography` renders
  identically (nothing imports the new exports yet).
- **Sanity check (real manifest, resolver logic replayed):**
  - photos.length = **61**; galleryPhotos = **61** (all seeded main:true).
  - unlisted trips (not in tripOrder) = **none**.
  - Sections (title — count, within-section date order):
    - Iceland 2026 — 22 (asc ✓)
    - Colorado 2026 — 22 (asc ✓; includes undated truck/Timeline frames, which
      sort first)
    - British Virgin Islands 2026 — 7 (asc ✓)
    - Kauai 2026 — 2 (asc ✓)
    - Mexico 2026 — 2 (asc ✓)
    - Boston 2026 — 1
    - Portland 2026 — 1
    - More frames — 4 (codes 0011, 0032, 0033, 0034)
  - **sum across sections = 61 = photos.length**; unique codes = 61, **0
    duplicates** — every photo in exactly one section, nothing dropped.

Verify: `tsc --noEmit` clean · `npm run lint` clean · `next build` (export) green,
route list unchanged (`/photography` still one static route).

---

## Stage 3 — The `All / By trip` toggle + the trip view

Make `PhotographyGallery` a two-view component: the existing masonry under `All`, and the
grouped trip sections under `By trip`, with number badges and no captions.

```
1. components/photography-gallery.tsx (already "use client"): add `const [view, setView] =
   useState<"all" | "trip">("all")` and render a segmented toggle above the grid:
     - Two buttons (labels from site.config viewLabels), wrapped in a role="group"
       aria-label="Gallery view"; each button has aria-pressed reflecting the active view;
       keyboard operable; visible focus ring. Class `.gallery-toggle`.
2. ALL view (view === "all"): render `galleryPhotos` (main !== false) in the EXISTING masonry
   exactly as today — same tile markup, same lightbox behavior, captions in the lightbox. No
   number badges here.
3. BY TRIP view (view === "trip"): render `tripSections`. For each section:
     - a `.trip-section` with a heading row (`.trip-head`): a small flower marker (reuse the
       Motif/flower primitive with a cycling petal color + the section index), the trip title
       (h2), and a right-aligned frame count ("24 frames").
     - a masonry of that section's photos using the same tile component, EXCEPT each tile shows
       a `.photo-badge` (the photo's `code`, e.g. "0031") in a top-left corner badge, and NO
       caption is displayed anywhere on the tile.
4. Lightbox wiring per view (correctness): build the active view's flat photo list in render
   order — for All that's `galleryPhotos`; for By trip that's the trip sections concatenated in
   section order. Track a single `idx` into the ACTIVE list; clicking a tile sets the correct
   global index; ← / → step the whole active list. Switching views resets `idx` to null.
   (Stage 4 wires the caption-suppression prop; here just pass the correct items + index.)
5. The toggle must sit clear of the existing vertical marquee rail (which is absolutely
   positioned in the gutter) — place the toggle inside the content `.wrap`, not the gutter.

Verify: tsc --noEmit; npm run lint; next build (export) green. /photography defaults to All
(identical to today). Clicking "By trip" shows trip sections with flower-marked headings, per
tile number badges, and no captions; clicking a tile opens the right photo and ← / → step the
whole trip view. Switching back to All restores the current grid. No horizontal scroll at 375;
toggle doesn't collide with the marquee.
```

## Stage 3 Report

_Pending._

---

## Stage 4 — Lightbox caption-suppression + badge / section styling

Finish the treatment: the By-trip lightbox shows the number not the caption, and the badges +
trip sections + toggle are styled on-brand.

```
1. components/lightbox.tsx: add a `showCaptions?: boolean` prop (default true). When false,
   suppress the caption text in the lightbox chrome but STILL show the `code` (the number) and
   keep the image `alt`. Do not change any other lightbox behavior (keyboard, focus-trap,
   scroll-lock, focus-return, arrow stepping).
2. photography-gallery.tsx: pass `showCaptions={view === "all"}` to the Lightbox so By trip
   shows the number only, All keeps captions.
3. app/globals.css (@layer components), on existing @theme tokens, no new tokens/deps:
     - `.gallery-toggle` — a pill segmented control matching the site (panel bg, --line border,
       active segment on --paper with a soft ring; labels in --font-sans; blue focus-visible
       ring). Small, quiet, sits under the gallery header.
     - `.trip-section` + `.trip-head` — a section heading row with the flower marker, an h2 in
       --font-serif, a --line bottom rule, and a right-aligned muted count; comfortable rhythm
       between sections.
     - `.photo-badge` — a top-left corner badge over the tile: small, tabular-nums, --paper text
       on a translucent dark chip, readable over any photo. Sits above the image, pointer-events
       none, not part of the button's accessible name (the button keeps its `alt`-based label).
4. Motion: any toggle/section transition is subtle and wrapped so prefers-reduced-motion users
   get no animation. Confirm the marquee's existing reduced-motion freeze is untouched.

Verify: tsc --noEmit; npm run lint; next build (export) green. In By trip, opening a photo shows
its number and NO caption; in All, the caption still shows. Badges are legible over light and
dark placeholder tiles; toggle + trip headings match the site's look; no horizontal scroll at
1440 / 768 / 375; reduced-motion shows no toggle animation.
```

## Stage 4 Report

_Pending._

---

## Stage 5 — Coherence + verify (the gate)

Prove the toggle, both views, and the pipeline land cleanly and nothing regressed.

```
1. Full build gate: tsc --noEmit, npm run lint (whole repo), next build (export) all green.
   Paste the route list + count; /photography still one static route.
2. Regeneration integrity: `npm run sync-gallery` is idempotent (running it twice yields no
   diff); data/photos.ts carries `trip` (+ `main` where set) and no hand edits.
3. Non-regression: All view === today. Confirm the same photos in the same order render under
   All (all seeded main:true), captions still in the All lightbox, the marquee still on the page.
4. By-trip integrity: every photo appears in exactly one section; section order follows
   tripOrder then date; within-trip order is by date; untagged photos land in "More frames";
   total across sections === photos.length. Paste the section list + counts.
5. main:false proof: temporarily set one photo `main: false` in gallery.json, re-sync, and
   confirm it DISAPPEARS from All but STILL appears in its trip section (then revert).
6. Lightbox: arrow-stepping works in both views; By-trip lightbox shows number, not caption;
   All lightbox shows caption. No nested-interactive a11y issues; toggle has role/aria and
   keyboard support; images keep real alt text.
7. Responsive at 1440 / 768 / 375 + reduced-motion sweep on both views: no horizontal scroll,
   trip headings/badges legible, toggle usable, no marquee collision.
8. Update MANUAL-TODO.md: (a) Charlie renames/regroups the seeded trips in gallery.json to his
   real trips (incl. adding "Cape Cod 2026" etc.); (b) to add the trip-only EXTRA frames, drop
   the images in /public/photos, add gallery.json lines with `main: false` + the right `trip`,
   and re-run sync-gallery; (c) tune `tripOrder` in site.config.ts.

Verify: paste the build result, the sync idempotency check, the By-trip section list + counts
(sum === photos.length), and the responsive + reduced-motion + main:false results (or an honest
deferral if no browser is available — do NOT fabricate an axe score or screenshots). Log the
authoring debt in MANUAL-TODO.md.
```

## Stage 5 Report

_Pending._

---

# After These Stages
- **Two ways to see the work.** `/photography` opens on the familiar masonry (`All`) and, one
  click away, reorganizes into a numbered, caption-free contact-sheet grouped **By trip** —
  "Iceland 2026", "Colorado 2026", and the trips you add.
- **Trips are yours to shape.** Every trip label + section order is authored in `gallery.json`
  and `site.config.ts`; the seed just gives you a working starting point to rename.
- **Room for more.** The By-trip view can hold frames that never make the main grid — tag a
  photo `main: false` and it lives only in its trip. The extra shots are a pure content drop
  (images + `gallery.json` lines + `sync-gallery`), no code.
- **Deferred on purpose (see `MANUAL-TODO.md`):** the real trip renames + the trip-only extra
  photos (Charlie's assets); optionally persisting the active view in the URL (`?view=trips`)
  for shareable trip links; optional per-trip "01, 02" numbering if the global `code` ever
  reads wrong in a trip context.
