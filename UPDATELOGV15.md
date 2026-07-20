charlie

# UPDATELOG V15 — PHOTOGRAPHY: FOLDER-DRIVEN "BY TRIP" (SEPARATE DATASET + STICKY NUMBERS)
# Work on one stage at a time. Do NOT combine stages.

**First read `AGENTS.md`, `DESIGN-BRIEF.md`, `site.config.ts`, `public/photos/gallery.json`,
`scripts/sync-gallery.mjs`, `data/trips.ts`, and the V14 stages** (V14 built the All / By-trip
toggle; V15 keeps the toggle + UI but rebuilds what feeds the By-trip view). Today both views
share ONE dataset: every photo lives in `gallery.json` and `trip` is a per-photo tag; `data/trips.ts`
groups that flat `photos` array by tag. **V15 unlinks the two views into two independent datasets.**

**The All grid stays exactly as it is** — the curated, **captioned** `gallery.json` set. **The By-trip
view becomes 100% folder-driven and caption-free:** Charlie drops photos into
`public/photos/trips/<Trip Name>/`, runs `npm run sync-gallery`, and that folder shows up as a labeled
trip section — the **folder name is the section heading**. No JSON editing, no captions. Because the
site is a **static export** (`output: "export"`), the folder scan happens at BUILD time inside
`sync-gallery.mjs` (there is no server to scan at request time); the author workflow is "drop files →
`npm run sync-gallery` → deploy", which is the command Charlie already runs.

**Every photo — main gallery AND every trip — gets a globally unique, STICKY print-reference number.**
A generated, committed `public/photos/numbers.json` maps each photo's stable path to a code and only ever
appends: a photo keeps its number for life, and a deleted photo's number is retired (never reused). This
is a print-reference system (a customer can cite a number), so numbers must never shuffle between builds.
The map is **seeded from the current gallery order**, so today's codes (`0001…0061`) — and the
homepage `previews` code references (`rightNowPhoto: "0055"`, `photographyBento: ["0001","0013","0030",
"0004"]`) — stay valid; trip photos number upward from there.

This log removes V14's `trip` / `main` tags from `gallery.json` (the All grid reverts to its pure
captioned set; the `main:false` hide-from-All mechanism is dropped as pointless once trips are a separate
dataset). It does **not** touch the homepage, the `/photography` header/lede, or any other route, and it
does **not** ship a real trip dataset (Charlie's assets — the view stays empty, toggle hidden, until he
drops folders).

## Decisions (agreed with Charlie, 2026-07-20)
- **Two independent datasets.** All = `gallery.json` (captioned, unchanged). By trip = folders under
  `public/photos/trips/<Trip Name>/`; the folder basename is the section title. The two share nothing
  except the global number space.
- **Sticky global numbering** in a generated, **committed** `public/photos/numbers.json`: `{ "<relpath>":
  "<code>" }` keyed by each photo's path relative to `public/photos/` (`20260412-…webp` for gallery,
  `trips/Iceland 2026/01_x.webp` for a trip). Append-only; new photos take `max+1`; removed photos keep
  their entry so the number is retired, never reused. **Seed from the current gallery order** to preserve
  `0001…0061` and the `previews` code references.
- **Within a trip: filename order** (natural sort). Visual order doesn't matter to Charlie, but the order
  must be DETERMINISTIC so the sticky numbers don't reshuffle between builds — so it's filename, not random.
- **Section order: `photographyView.tripOrder`** in `site.config.ts` (listed trips first, in that order);
  any folder not listed falls to the end, alphabetically (deterministic). `viewLabels` stay.
- **Number display:** a SMALL, quiet corner chip on the grid tiles (shrunk from V14); in the By-trip
  lightbox the number renders LARGE, centered under the photo (there's no caption, so the number owns
  that space). The All-view lightbox keeps its number beside the caption.
- **Empty state:** with no trip folders present, the By-trip view is empty, so the **"By trip" toggle is
  hidden entirely** — the page looks like a normal single-view gallery until Charlie drops a folder.
- **No committed sample dataset.** `trips/` ships empty; each stage that needs to prove the scan/UI uses a
  TEMPORARY sample folder created during verify, then removed with `numbers.json` reverted so no throwaway
  codes are committed. Charlie populates `trips/` with his real dataset later (see MANUAL-TODO §V15).
- **Medium feature, five stages:** sticky number-map (gallery only) → trips folder scan + manifest →
  resolver/config swap + strip tags → component + badge/lightbox CSS → verify gate + workflow docs.

## Hard constraints (carry over from V7–V14)
- **The All grid is byte-identical to today** once the tags are stripped — same captioned photos, same
  order, same codes, captions still in the All lightbox. No existing rendered photo, order, or code changes.
- **Preserve existing codes.** `data/photos.ts` codes for the current 61 photos MUST stay `0001…0061`, so
  the `previews` references in `site.config.ts` keep resolving. Verify this explicitly.
- **`data/photos.ts` + `data/trip-photos.ts` are generated — never hand-edit.** All gallery authoring is in
  `gallery.json`; all trip authoring is dropping files into `public/photos/trips/<Trip>/`. Re-run
  `npm run sync-gallery` to regenerate. `public/photos/numbers.json` is generated too, but is **committed**
  (it is the sticky source of truth for print numbers).
- **Static export intact.** `/photography` stays a single static route; the toggle is client state, no new
  route, no `output: export` change. The folder scan is build-time only.
- **Lightbox correctness (do not break).** In each view the lightbox operates over that view's own flat
  photo list in render order; clicking a tile opens the correct index and ← / → step the whole active view.
- **Motion respects `prefers-reduced-motion`** (toggle, any reveal). Tailwind v4 CSS-first — new/changed
  classes go in `app/globals.css` on existing `@theme` tokens. No new tokens, no new deps.
- Verify each stage with `tsc --noEmit` + `npm run lint` + `next build` (export). No horizontal scroll at
  1440 / 768 / 375, no console errors. On Windows, `next build`'s final `rmdir('out')` cleanup can hit an
  `EBUSY` file-lock race when a dev/static server is watching `out/` — the compile + typecheck + all static
  pages are the real signal; note it honestly if it recurs (see V14 Stage 5). Don't commit/push unless
  Charlie asks (`/complete-updatelog` handles the `stage<N>v15` commits when run).

---

## Stage 1 — Sticky global number-map (gallery only, codes preserved)

Introduce the sticky number map and route the gallery pipeline through it, WITHOUT changing any code
values or the tag mechanism yet. Isolating the numbering change de-risks it and proves codes are preserved.

```
1. public/photos/numbers.json (NEW, committed): seed it from the CURRENT gallery.json order — one entry
   per photo, key = the photo's path relative to public/photos/ (for gallery photos that's just
   entry.file), value = the current zero-padded code (0001, 0002, … in gallery.json array order). This
   must reproduce today's codes exactly. Sort the file by code for a clean diff.
2. scripts/sync-gallery.mjs: load numbers.json at the top (default {} if missing). Add a helper
   codeFor(relPath): returns the existing code for that path, or assigns the next code = (max numeric code
   in the map) + 1, zero-padded to width max(4, digits), records it, and marks the map dirty. Replace the
   index-based `const code = String(i + 1).padStart(4, "0")` with `codeFor(entry.file)`. After processing,
   if the map changed, write numbers.json back (sorted by code).
3. DO NOT remove `trip` / `main` yet (keep the V14 gallery pipeline + data/trips.ts compiling). This stage
   only changes WHERE the gallery code comes from (the map instead of the array index) and adds the map.
4. Run `npm run sync-gallery`. data/photos.ts codes must be UNCHANGED (0001…0061).

Verify: tsc --noEmit; npm run lint; next build (export) green. Confirm numbers.json has 61 entries
0001…0061; data/photos.ts codes are identical to before (diff shows no code changes); the previews
references still resolve — 0001, 0013, 0030, 0004 (photographyBento) and 0055 (rightNowPhoto) point at the
same photos as before. Confirm re-running sync-gallery leaves numbers.json unchanged (stable/idempotent).
Report the preserved code range + that previews refs are intact.
```

## Stage 1 Report

- [x] **`public/photos/numbers.json` (NEW, committed)** — the sticky print-reference map,
  `{ "<path relative to public/photos/>": "<code>" }`. Seeded by running the pipeline over the
  current `gallery.json` in array order, which mints `0001…0061` — identical to the old index-based
  codes. 61 entries, sorted by code (`0001` → `0061`) for a clean diff.
- [x] **`scripts/sync-gallery.mjs`** — loads `numbers.json` at the top (defaults to `{}` if missing),
  adds `codeFor(relPath)`: returns the existing code for a path, else mints the next code =
  `(max numeric code in the map) + 1`, zero-padded to `max(4, digits)`, records it, and flags the map
  dirty. Replaced the index-based `const code = String(i + 1).padStart(4, "0")` with
  `codeFor(entry.file)` (the `i` param, now unused, was dropped from the map callback). After the
  gallery pass, if the map changed it writes `numbers.json` back sorted by code; untouched → no rewrite.
- [x] **V14 `trip` / `main` NOT touched** — the gallery serializer, generated `Photo` type, and
  `data/trips.ts` all still compile unchanged. This stage only moved WHERE the gallery code comes from
  (the sticky map instead of the array index) and added the map.
- [x] `npm run sync-gallery` → `data/photos.ts` codes are **byte-identical** to before
  (`diff` of `code: "…"` lines is empty; range `0001…0061`).
- **Verify:** `tsc --noEmit` clean; `npm run lint` clean; `next build` (export) green — `/photography`
  still a single static (`○`) route. `numbers.json` has 61 entries `0001…0061`. Previews refs resolve
  to the same photos: `0001`→`20260412-IMGL5331-2`, `0013`→`20260411-IMGL5222-3`,
  `0030`→`20260414-IMGL7279`, `0004`→`20260413-IMGL6446` (photographyBento), `0055`→`Frame1-2026-06-20`
  (rightNowPhoto). Re-running `sync-gallery` left `numbers.json` byte-identical (stable/idempotent).
- **Issues:** None. Codes preserved exactly; the number source is now the committed map.

---

## Stage 2 — Trips folder scan → generated `data/trip-photos.ts`

Teach the pipeline to discover trip folders and generate a grouped manifest, using the same sticky map so
trip photos number upward from the gallery. Nothing renders it yet, so it's safe.

```
1. scripts/sync-gallery.mjs: after the gallery pass, add a TRIPS pass. Glob the immediate subdirectories of
   public/photos/trips/ (create the dir if absent). Each subdirectory is a trip; its basename is the title.
   IGNORE any `thumbs` / `.thumbs` subdir. For each trip, list its image files (jpg/jpeg/png/webp), sorted
   by NATURAL filename order. For each image: apply the same MAX_FULL downscale guard, generate a thumbnail
   into public/photos/trips/<title>/thumbs/<file>, compute ratio + blurDataURL, and assign
   code = codeFor("trips/<title>/<file>"). alt = `"<title> — <NN>"` (the trip name + the photo's number),
   since there is no caption. No caption field.
2. Emit data/trip-photos.ts (generated; same "do not edit" banner style as data/photos.ts):
     export type TripPhoto = { src; thumb; alt; ratio; code; blurDataURL? };   // NO caption
     export const tripPhotoGroups: { title: string; photos: TripPhoto[] }[]     // grouped by folder,
   ordered alphabetically by title here (the resolver applies tripOrder in Stage 3). Omit undefined
   optionals; deterministic field order for clean diffs.
3. numbers.json now also covers trip photos (append-only, continuing from the gallery's max).
4. Do NOT change data/trips.ts, the components, or gallery.json this stage. With trips/ empty,
   tripPhotoGroups is []. data/trip-photos.ts is generated but unused so far.

Verify: tsc --noEmit; npm run lint; next build (export) green (empty tripPhotoGroups renders nothing).
Then PROVE the scan: temporarily create public/photos/trips/Sample 2026/ with two throwaway images (copy
two existing public/photos/*.webp in), run sync-gallery, and confirm data/trip-photos.ts now has a
"Sample 2026" group of 2 photos whose codes continue from the gallery max (e.g. 0062, 0063) and whose alt
is "Sample 2026 — 62"/"…63". Then delete the Sample 2026 folder + its thumbs and `git checkout
public/photos/numbers.json` so no sample codes are committed; re-run sync to confirm data/trip-photos.ts is
back to []. Report the proof (group + codes seen) and confirm the revert is clean.
```

## Stage 2 Report

- [x] **`scripts/sync-gallery.mjs` — TRIPS pass** added after the gallery pass. `mkdirSync(tripsDir)`
  ensures `public/photos/trips/` exists, then globs its immediate subdirectories via
  `readdirSync(..., { withFileTypes: true })` (each subdir = a trip, basename = title), skipping any
  `thumbs` / `.thumbs` dir. Per trip it lists image files (`/\.(jpe?g|png|webp)$/i`) in **natural
  filename order** (`localeCompare` with `numeric: true`). For each image it calls
  `codeFor("trips/<title>/<file>")`, runs the shared `processImage()` helper (same `MAX_FULL` downscale
  guard, thumbnail into `trips/<title>/thumbs/<file>`, ratio + `blurDataURL`), and sets
  `alt = "<title> — <NN>"` (trip name + the number, e.g. `Sample 2026 — 62`). No caption field.
- [x] **Shared `processImage(fullPath, thumbPath, label)` helper** factored out (downscale → thumbnail →
  blur), used by the trips pass; the gallery pass is left inlined and byte-identical.
- [x] **`data/trip-photos.ts` (NEW, generated)** — same "do not edit" banner as `data/photos.ts`.
  `export type TripPhoto = { src; thumb; alt; ratio; code; blurDataURL? }` (no `caption`); grouped
  manifest `export const tripPhotoGroups: { title: string; photos: TripPhoto[] }[]`, ordered
  alphabetically by title (Stage 3's resolver applies `tripOrder`). Undefined optionals omitted;
  deterministic field order.
- [x] **`numbers.json` covers trips** — the trips pass runs after the gallery `Promise.all`, so gallery
  codes are all assigned first; trip photos append upward from the gallery max (`0062`, `0063`, …).
- [x] **Nothing else touched** — `data/trips.ts`, the components, and `gallery.json` are unchanged. With
  `trips/` empty, `tripPhotoGroups` is `[]` and the generated file is unused so far.
- **Verify:** `tsc --noEmit` clean; `npm run lint` clean; `next build` (export) green with empty
  `tripPhotoGroups` (renders nothing). **Scan proof:** temporarily created
  `public/photos/trips/Sample 2026/` with two throwaway images (`01_a.webp`, `02_b.webp` copied from
  existing photos) → sync produced a `"Sample 2026"` group of 2 photos, codes **`0062`/`0063`**
  (continuing from the gallery max), alt `"Sample 2026 — 62"`/`"…63"`, thumbs written to
  `trips/Sample 2026/thumbs/`. Then deleted the folder, `git checkout public/photos/numbers.json`, and
  re-synced → `data/trip-photos.ts` back to `[]`, `numbers.json` back to 61 entries, working tree clean
  (only `scripts/sync-gallery.mjs` + the new `data/trip-photos.ts` remain). No sample codes committed.
- **Issues:** None. `public/photos/trips/` is created empty at build time (git cannot track an empty
  dir), matching the "ships empty" decision.

---

## Stage 3 — Resolver + config swap; strip the V14 tags

Point the By-trip view at the folder dataset, order sections by tripOrder, and remove the now-dead
`trip` / `main` tags so the All grid is a pure captioned set again.

```
1. data/trips.ts: rewrite.
     - galleryPhotos = photos            // the All set is simply the full captioned gallery now
     - tripSections: import tripPhotoGroups from data/trip-photos.ts and order them by
       photographyView.tripOrder (listed titles first, in that order), then any unlisted title
       alphabetically. Drop empty groups. Type: { title: string; photos: TripPhoto[] }[].
     - Remove the V14 tag-grouping logic, the "More frames" untagged bucket, and UNTAGGED_SECTION_TITLE
       (there is no untagged concept now — every trip photo lives in exactly one folder).
2. Strip the V14 tags from the gallery pipeline:
     - public/photos/gallery.json: remove every `trip` and `main` field (back to
       file/caption/location?/featured?).
     - scripts/sync-gallery.mjs: remove `trip` / `main` from the generated object, the serializer, and the
       generated Photo type block (revert the V14 gallery-side additions). Keep codeFor + the trips pass.
     - Re-run npm run sync-gallery → data/photos.ts no longer carries trip/main; codes still 0001…0061.
3. Do NOT change the components yet (they import galleryPhotos/tripSections from data/trips.ts, whose shapes
   still satisfy the existing usage; TripPhoto has no caption, which the By-trip lightbox already suppresses).

Verify: tsc --noEmit; npm run lint; next build (export) green. Confirm the All grid renders the same
captioned photos in the same order with unchanged codes; By-trip is empty (no folders) so tripSections is
[]; previews refs still resolve. Report the gallery diff is tags-only (no code/caption/order change).
```

## Stage 3 Report

- [x] **`data/trips.ts` rewritten** to the two-independent-dataset model:
    - `galleryPhotos: Photo[] = photos` — the All set is now simply the full captioned gallery in
      manifest order (no `main` filter).
    - `tripSections` imports `tripPhotoGroups` from `data/trip-photos.ts` and orders them via
      `orderTripSections()`: `photographyView.tripOrder` titles first (in that order), then any unlisted
      title alphabetically (`localeCompare`); empty groups dropped. Type is
      `{ title: string; photos: TripPhoto[] }[]`.
    - Removed the V14 tag-grouping logic, the `date`/index tie-break sorting, the "More frames" untagged
      bucket, and `UNTAGGED_SECTION_TITLE` (no untagged concept — each trip photo lives in exactly one
      folder). `TripSection` is now `{ title; photos: TripPhoto[] }`.
- [x] **V14 tags stripped from the gallery pipeline:**
    - `public/photos/gallery.json` — removed every `trip` field (no `main` fields existed), preserving
      formatting so the diff is **trip-removal-only** (verified: HEAD-with-trips-stripped is byte-identical
      to the new file — captions, locations, `featured`, and order all unchanged).
    - `scripts/sync-gallery.mjs` — removed `trip`/`main` from the generated object, the serializer, and
      the generated `Photo` type block, and reverted the header doc comment to the pre-V14 entry shape
      (`{ file, caption, location?, featured? }`). `codeFor` + the trips pass are kept.
    - Re-ran `npm run sync-gallery` → `data/photos.ts` no longer carries `trip`/`main` (grep: 0), codes
      still `0001…0061` (diff of code lines empty).
- [x] **Components untouched** — `components/photography-gallery.tsx` still imports
  `galleryPhotos`/`tripSections`; `TripPhoto` is structurally assignable to `Photo`, so
  `tripFlat: Photo[] = tripSections.flatMap(...)` and the lightbox usage compile unchanged.
- **Verify:** `tsc --noEmit` clean; `npm run lint` clean; `next build` (export) green — `/photography`
  still a single static route. All grid renders the same 61 captioned photos, same order, unchanged
  codes; By-trip is empty (no folders) so `tripSections` is `[]`; previews refs still resolve. The
  `gallery.json` diff is tags-only.
- **Issues:** None.

---

## Stage 4 — Component: hide-when-empty toggle + badge/lightbox number treatment

Wire the component to the two separate datasets, hide the toggle when there are no trips, and apply the
number treatment (small on the grid, large under the photo in the lightbox).

```
1. components/photography-gallery.tsx:
     - All view renders galleryPhotos; By-trip view renders tripSections (the folder dataset). Keep the
       per-view flat lightbox list + global-index discipline from V14 (All → galleryPhotos; By trip →
       tripSections flattened in section order; switching views resets the open index).
     - HIDE the "By trip" toggle button when tripSections.length === 0 (render the All grid alone, no
       toggle group, default view "all"). When ≥1 trip exists, show the segmented All / By trip control
       as before.
     - Trip tiles keep the corner number badge (the photo code); All tiles stay badge-free (captioned).
     - Pass showCaptions={view === "all"} to the Lightbox (unchanged).
2. components/lightbox.tsx: when showCaptions is false AND a code exists, render the number LARGE and
   centered under the photo (its own element, e.g. .lightbox-number) instead of the small chip — the
   number is the hero of the caption row in By-trip. When showCaptions is true, keep the existing
   small .lightbox-code chip beside the caption. Keep alt, keyboard, focus-trap, arrow stepping unchanged.
3. app/globals.css (@layer components, existing @theme tokens, no new tokens/deps):
     - Shrink .photo-badge (smaller font/padding, still legible over any photo) so a wall of thumbnails
       reads quietly.
     - Add the large under-photo number treatment for the By-trip lightbox (.lightbox-number): big,
       tabular-nums, --color-paper, centered, comfortable space under the image. Motion-safe.
4. Motion: any new transition wrapped so prefers-reduced-motion users get none.

Verify: tsc --noEmit; npm run lint; next build (export) green. With trips/ empty, /photography shows the
All grid with NO toggle (single view), identical to today's captioned gallery. Then temporarily drop a
Sample 2026 trip (2 images) + sync: the toggle appears, By-trip shows the section with SMALL corner
numbers, clicking a tile opens the lightbox with the number LARGE and centered under the photo and NO
caption; the All lightbox still shows its caption. No horizontal scroll at 1440/768/375. Remove the sample
+ revert numbers.json. Report both the empty-state (toggle hidden) and populated behavior.
```

## Stage 4 Report

_Pending._

---

## Stage 5 — Coherence + verify gate + workflow docs

Prove the whole thing: sticky numbering, the empty state, the drop-a-folder flow, and non-regression of the
All grid; then document the author workflow.

```
1. Full build gate: tsc --noEmit, npm run lint (whole repo), next build (export). Paste the route list;
   /photography still one static route. (Honor the Windows rmdir('out') EBUSY note if it recurs — the
   compile + all static pages are the real signal.)
2. Preserved codes: data/photos.ts codes are 0001…0061 unchanged; the previews references
   (0001/0013/0030/0004/0055) resolve to the same photos. Confirm and paste.
3. Sticky-number proof (temporary): create public/photos/trips/Sample 2026/ with 2 images, sync → they get
   the next codes (e.g. 0062, 0063). DELETE one image, sync → its number is RETIRED in numbers.json (still
   present, not reused). ADD a different image, sync → it takes the next free code (e.g. 0064), NOT the
   retired one. Paste the numbers.json deltas that prove append-only + retire-not-reuse. Then remove the
   Sample folder + `git checkout` numbers.json + thumbs so nothing sample is committed; confirm clean tree.
4. Non-regression: the All grid renders the same captioned photos, same order, same codes as before V15;
   captions still in the All lightbox. gallery.json diff is tags-only.
5. Empty state: with trips/ empty (committed state), the By-trip toggle is HIDDEN and /photography is a
   normal single-view captioned gallery.
6. Lightbox: arrow-stepping works in both views; By-trip lightbox shows the LARGE number under the photo,
   no caption; All lightbox shows the caption. Toggle (when shown) has role/aria + keyboard support;
   images keep real alt.
7. Responsive at 1440/768/375 + reduced-motion sweep (drop a temporary sample trip so By-trip is
   exercisable, then revert): no horizontal scroll, grid numbers small + legible, lightbox number legible,
   toggle usable.
8. Update MANUAL-TODO.md (new V15 section): document the author workflow — (a) create
   public/photos/trips/<Trip Name>/ (folder name = section heading), drop photos in any format, run
   `npm run sync-gallery`; (b) numbers are sticky + global (numbers.json is generated but COMMITTED — the
   print-reference source of truth; deleting a photo retires its number); (c) within-trip order is by
   filename (prefix 01_/02_ to control it); (d) section order via photographyView.tripOrder in
   site.config.ts. Note V14's trip/main tags are gone.

Verify: paste the build result, the preserved-code check, the sticky-number deltas (append + retire), the
empty-state (toggle hidden) result, and the responsive + reduced-motion results (or an honest deferral if a
browser genuinely can't run — do NOT fabricate). Log the author workflow in MANUAL-TODO.md.
```

## Stage 5 Report

_Pending._

---

# After These Stages
- **Two independent galleries, one number space.** `/photography` still opens on the captioned masonry
  (**All**); once Charlie drops trip folders it gains a one-click **By trip** view built entirely from
  `public/photos/trips/<Trip Name>/` — no captions, small corner numbers, big number under the photo in the
  lightbox. Every photo across both views carries a unique, sticky print-reference number.
- **Trips are a pure content drop.** Make a folder named for the trip, drop photos in, run
  `npm run sync-gallery`. The folder name is the heading; `tripOrder` in `site.config.ts` sets the section
  order; thumbnails/ratios/blur/numbers are generated for you.
- **Numbers are permanent.** `public/photos/numbers.json` is the committed source of truth: a photo keeps
  its number for life and a deleted photo's number is retired, so a print reference a customer was given
  stays valid.
- **Deferred on purpose (see `MANUAL-TODO.md` §V15):** Charlie's real trip dataset (the view ships empty,
  toggle hidden, until folders land); optionally a per-trip display order override beyond filename prefixes;
  optionally surfacing the number on the All grid tiles too (today it shows in the All lightbox only).
