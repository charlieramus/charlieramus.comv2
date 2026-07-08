# UPDATELOG V4 — INNER PAGES

**First read `DESIGN-BRIEF.md`**, `AGENTS.md`, and the **V3 stage reports** (they
list the homepage links that point at these routes + the content gaps). Goal of V4:
build the **inner routes** the homepage links to, all reskinned to the design system,
and stand up the two pipelines the homepage stubbed: **MDX writing** and the
**photography gallery** (downscale / thumb / blur). When V4 lands, every homepage link
resolves.

**Routes to build** (per `ROADMAP.md` + `DESIGN-BRIEF.md` Architecture):
`/photography` · `/writing` + `/writing/[slug]` · `/design` · `/gear` ·
`/web-projects`. (`/blog` was dropped — see the V2 addendum decision in Stage 3;
writing is unified under `/writing`.)

**Hard constraints.**
- **Read `node_modules/next/dist/docs/` before writing Next code** — MDX setup,
  dynamic routes/`generateStaticParams`, `next/image`, metadata. Heed deprecations
  (this is a modified Next 16 — APIs may differ from training data).
- **Tailwind v4 is CSS-first** — reuse the `@theme` tokens + component classes from
  `globals.css`; add per-route CSS in `@layer components` (or CSS Modules), **not** a
  new scoped dump. Match the homepage's type scale, `--edge` gutter, `--maxw`.
- All motion respects `prefers-reduced-motion`; images are `next/image` with real
  dimensions + `blurDataURL`.
- Data is still the source of truth: `webProjects`, `designProjects`, `gear`/
  `gearSections`, `photos`, `writing`, `socials`. Keep `// CUSTOMIZE` markers.
- Verify each stage with `build` + `tsc` + `eslint`, then **render the route** at
  1440 / 768 / 375. Don't commit/push unless Charlie asks.

---

## Stage 1 — MDX pipeline + `/writing` and `/writing/[slug]`

- Stand up **MDX rendering** in this Next 16 setup (read the MDX doc first — decide
  `@next/mdx` vs a content loader). The 4 essays live in `content/writing/*.mdx`; the
  **filename is the slug**. Some bodies contain **inline JSX/HTML** (footnote lists,
  `className` attrs, `<sup>` refs in `when-bigger-means-more-biased.mdx`) — the
  pipeline must render these, so MDX (not plain remark) is required.
- **`/writing`** — index list from the `writing` manifest (`data/writing.ts`), ordered
  by `order` (newest first): `title` + `date`, linking to `/writing/[slug]`.
- **`/writing/[slug]`** — `generateStaticParams` from the manifest (or the MDX files);
  render the frontmatter contract: `title` (heading), `date`/`author` (byline),
  `headerImage` (**all `""` right now** — render no header until images are added in
  Stage 4; don't crash on empty), `externalLink`/`externalLinkLabel` (a button when
  set — all `""` now). Style prose to the design system (serif headings, `--maxw`
  reading measure, footnote/acknowledgment blocks).
- Keep the manifest and the MDX frontmatter in sync (V2 locked that contract).

# Stage 1 Report

**Approach:** `@next/mdx` (not plain remark — the bodies carry inline JSX: footnote
`<ul className="…">`, an acknowledgments `<div>`, and `<sup><a>` refs in
`when-bigger`) with **dynamic `import()`** in `/writing/[slug]` + `generateStaticParams`
from the manifest — the documented Next-16 dynamic-route pattern. `@next/mdx` doesn't
parse YAML frontmatter, so I added **`remark-frontmatter`** (strips the leading `---`
block from the render) + **`remark-mdx-frontmatter`** (re-exposes it as a named
`frontmatter` export the route reads). Plugins are passed as **strings** because Next 16
builds with **Turbopack**, which only accepts serializable plugin refs.

- [x] **`next.config.ts`** — wrapped with `createMDX`; `pageExtensions` adds `md`/`mdx`;
  `remarkPlugins: ["remark-frontmatter", ["remark-mdx-frontmatter", { name: "frontmatter" }]]`.
- [x] **`mdx-components.tsx`** (root) — required by `@next/mdx`; kept the documented empty
  map (prose is styled globally via `.writing-prose`, so no element overrides needed).
- [x] **`types/mdx.d.ts`** — ambient `declare module "*.mdx"` typing the default component
  **and** the injected `frontmatter` object (`title`/`date`/`author`/`headerImage`/
  `externalLink`/`externalLinkLabel`), so `/writing/[slug]` reads a typed frontmatter.
- [x] **`app/writing/page.tsx`** — index. Imports `writing` (`data/writing.ts`), sorts by
  `order` asc (1 = newest first), renders each as serif `title` + muted `date` linking to
  `/writing/[slug]`. `metadata` set. Uses `Reveal` for the fade-up (reduced-motion safe).
- [x] **`app/writing/[slug]/page.tsx`** — article. `generateStaticParams()` from the
  manifest + `dynamicParams = false` (unknown slugs 404). Renders the frontmatter contract:
  `title` (serif `<h1>`), `author · date` byline. **`headerImage` is `""` for all 4 essays**,
  so the `next/image` header is guarded and renders nothing now (real path branch is
  Stage-4-ready: `fill` in a 16/9 frame). **`externalLink`/`externalLinkLabel` all `""`**,
  so the `.btn` external-link button is likewise guarded off. `generateMetadata` reads the
  frontmatter (falls back to the manifest title so the two can't drift silently).
- [x] **Content fix — `content/writing/the-third-rotation.mdx`:** its opening line was
  indented 4 spaces, which Markdown renders as a **code block**. Dedented it so the line
  reads as prose (verified: `.writing-prose pre` count = 0 in the built page).
- [x] **`app/globals.css`** — one `@layer components` block (`.writing-*`): a 760px reading
  column (narrower than the homepage `--maxw` for a ~68ch measure), the index header/list,
  the article header, and `.writing-prose` (serif `h2`/`h3`, Inter body at 18px/1.75, dashed
  `hr` section breaks, blue→red links, `<sup>` refs, and the footnote `<ul>` +
  acknowledgment `<div>` — those carry old-repo utility classes that don't resolve in this
  theme, so they're styled here by element). Reuses `--edge`/`--color-*` tokens throughout.
  A `.writing-nav` back-link (left-aligned, shares the 760 box) is a **placeholder until
  Stage 4** wires the shared inner-page nav/header/footer.

**Data flow:** `data/writing.ts` (manifest) → index list order + `generateStaticParams` +
metadata-title fallback. `content/writing/<slug>.mdx` frontmatter (via
remark-mdx-frontmatter) → article `<h1>`/byline/header-image/external-link + metadata.
Manifest `title`/`date` mirror each MDX's frontmatter (the V2-locked contract); verified in
sync this stage.

**Verify:** `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean. Build prerenders
`/writing` (static) + all 4 `/writing/[slug]` (SSG via `generateStaticParams`). Rendered on
the prod server (`npm run start`) and eyeballed: `/writing` at **1440 / 768 / 375**, articles
at 1440 / 768 / 375. **No horizontal overflow** (`scrollWidth == clientWidth` at every
width), **zero console errors**. Footnote `[n]` `<sup>` refs render inline and link to the
footnote list; `---` renders as centered dashed dividers; the dedented third-rotation opener
reads as prose.

**Dead links resolved:** the homepage `/writing` targets (bento Writing/"More essays" +
Right Now essay card) now resolve to the index; the index links to each `/writing/[slug]`.

**Issues:** (1) `headerImage` renders nothing on all 4 essays (all `""`) — real header
images + paths are **Stage 4**; the render branch is already wired. (2) The `.writing-nav`
back-link is a minimal placeholder; the consistent inner-page **nav/header/footer** is
**Stage 4**. (3) Pre-existing Turbopack warning: two lockfiles (one at `C:\Users\jason`)
make Next infer the workspace root — not introduced here; silence later via `turbopack.root`
if desired.

---

## Stage 2 — Photography gallery pipeline + `/photography`

The big one. `data/photos.ts` is an **empty stub** with a finalized `Photo` type
(`src`/`thumb`/`alt`/`ratio`/`caption`/`code`/`blurDataURL` + V3-prep
`featured`/`location`/`date`).
- **Author the sync step** (per `DESIGN-BRIEF.md` — "downscale / thumb / blur"): take
  Charlie's source images → generate full-res + thumbnail + a base64 `blurDataURL` +
  intrinsic `ratio`, and **populate `photos`** (or generate a typed manifest the page
  imports). Decide where source images live (`public/photos/…`) and keep the generator
  reproducible (a script, not hand-authored data).
- **`/photography`** — the **masonry grid** (thumbnails, `ratio`-driven) + a
  **fullscreen lightbox** (keyboard + focus-trap for a11y; `next/image` with
  `blurDataURL`). Respect reduced-motion for any transitions.
- Set `featured`/`location`/`date` on the trip photos so the **homepage "highlights"
  surface** (V3 Stage 4) can pull a recent one — coordinate with whatever V3 decided.
- **DECISION → Charlie:** gallery grouping — one masonry stream, or grouped by
  trip/`location`? And which photos are `featured` for the homepage.

# Stage 2 Report

**Decisions (Charlie, this session):** (a) gallery layout = **one masonry stream**
(all 61 photos in a single ratio-driven grid — matches the old site, fits the design
system with no grouping UI). (b) featured = **recent trips, newest on homepage** — I
flagged 8 standouts (5 Iceland `2026-04` + 3 Longs Peak `2026-06`) with `location`+`date`;
the homepage will pick the newest (Longs Peak). Re-curate anytime in `gallery.json`.

**Source:** the old `CharlieRamus.com` repo (sibling folder) already had the finished
gallery — a hand-authored `gallery.json`, a `sync-gallery.mjs` pipeline, and 61 processed
`.webp`s. I **ported the 61 full-res images + the manifest** and rebuilt the pipeline for
this repo's V4 `Photo` type; the page + lightbox are a clean rebuild to this design system
(not a copy of the old component, which carried old-repo tokens + a Mother's-Day/Inquire
modal that don't belong here).

- [x] **The sync step — `scripts/sync-gallery.mjs`** (+ `npm run sync-gallery`, added to
  `package.json`; dev deps `image-size`, `plaiceholder`, `sharp` installed). For every
  `gallery.json` entry it: downscales the full image to ≤2048px long-edge in place (mobile
  Safari guard), writes a ≤600px grid thumbnail to `public/photos/thumbs/`, computes the
  intrinsic `ratio`, generates a base64 `blurDataURL` (plaiceholder), **derives `date`
  ("YYYY-MM")** from the filename date stamp (`20260412-…` or `Frame1-2026-06-20`), passes
  through authored `location`/`featured`, and writes the typed `data/photos.ts`. Reproducible:
  drop a `.webp` in `public/photos/`, add a line to `gallery.json`, re-run. Verified run:
  **61 photos → 61 thumbnails, 0 downscaled** (already ≤2048 from the old export).
- [x] **`public/photos/gallery.json`** (the hand-authored source, extended schema
  `{ file, caption, location?, featured? }`) — 61 entries in curation order, `location` set
  on the locatable trips (Iceland / Boulder+Colorado / BVI / Longs Peak / Kauai / Mexico /
  Portland / Boston) and `featured: true` on the 8 curated standouts.
- [x] **`data/photos.ts`** — now AUTO-GENERATED (61 `Photo`s) with the V4 type (`src`,
  `thumb`, `alt`, `ratio`, `caption`, `code`, `blurDataURL`, `featured`, `location`, `date`).
  Dropped the V3 `placeholder` field (not in the V4 contract). No prior code imported it, so
  the shape change is safe. Assets tracked (not gitignored); `public/photos` ≈ 16 MB.
- [x] **`components/photography-gallery.tsx`** (client) — masonry grid (CSS columns 2/3/4 by
  width; each tile sized by its `ratio` so nothing crops in layout; thumbnails carry the blur
  placeholder, first 4 `priority`) + a **fullscreen lightbox**. Lightbox a11y (an upgrade over
  the old Escape-only one): `role="dialog"` + `aria-modal`, **Escape** closes, **← / →** step
  with wraparound, a **Tab focus-trap** inside the dialog, **body-scroll lock** while open, and
  **focus returned** to the thumbnail that opened it. `next/image` with `blurDataURL`; the
  full-res image is sized from the real `ratio` (1600×round(1600/ratio)) then capped to
  90vw/80vh. Shows the `#code` badge + caption.
- [x] **`app/photography/page.tsx`** (server) — metadata (title/description), a minimal
  back-to-home nav (placeholder until Stage 4's shared inner-page nav), a serif header
  (kicker + `Through the lens` + lede), then `<PhotographyGallery />`. Prerenders **static**.
- [x] **`app/globals.css`** — one `@layer components` block (`.gallery-*` / `.lightbox-*`):
  masonry columns, ratio tiles with hover-scale + focus ring, the dark overlay, edge
  prev/next + corner close buttons, the code badge (cyan) + caption. `prefers-reduced-motion`
  disables the tile hover-scale + lightbox fade (same guard pattern as flower/reveal). Reuses
  `--edge`/`--color-*` tokens; back-nav reuses the writing `.writing-nav`.

**Data flow:** `public/photos/*.webp` + `gallery.json` → `sync-gallery.mjs` → `data/photos.ts`
→ `photography-gallery.tsx` (grid + lightbox). `featured`/`location`/`date` are set on the 8
standouts so the homepage "Right now" photo highlight can pull the newest featured — the
actual homepage card wiring is **Stage 4** (cross-links), matching V3 Stage 4's "add the 4th
photo card in V4" note.

**Verify:** `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean; `/photography`
prerenders static. Rendered on the prod server and eyeballed at **1440 / 768 / 375**: 61 tiles
in a 4/3/2-col masonry, **no horizontal overflow** (`scrollWidth == clientWidth` at every
width), **zero console errors**. Lightbox exercised via the headless browser: opens with
`role=dialog`/`aria-modal`, focus lands on close, body scroll locks, **← / →** change the
photo (code/caption update, wraps 0001↔0061), **Tab stays trapped** inside the dialog,
**Escape** closes and **returns focus** to the opening tile.

**Issues:** (1) The Longs Peak `Frame1–7` photos have a film-strip border baked into the
source image — that's Charlie's intended aesthetic, not a render bug. (2) Homepage "Right now"
photo card + the bento photography grid still use placeholders — the data is now ready;
wiring them is **Stage 4**. (3) `data/photos.ts` is generated — edit `gallery.json` +
`npm run sync-gallery`, never the `.ts` directly.

---

## Stage 3 — `/web-projects`, `/design`, `/gear`, `/blog`

Reskin each to the system, driven by data:
- **`/web-projects`** ← `webProjects` (all 6, curation order; `spotlight` gets top
  billing). Show `title`/`date`/`description`/`tags`/`href`; add real screenshots to
  the `image` field (empty until now).
- **`/design`** ← `designProjects` (Notion / Spotify IMC / Photography UI); wire the
  `images[]` arrays (empty until now) to real assets.
- **`/gear`** ← `gear` + `gearSections` (Bodies / Lenses / Bags / Accessories);
  optional per-item `href`/`note`. Straightforward list/table in the design system.
- **`/blog`** — **DECIDED (V2 addendum): no separate `/blog` route.** There's one
  body of written work (the essays), unified under **`/writing`**. Drop `/blog` from
  scope; if any old link/nav still points at `/blog`, redirect it to `/writing`.
- Add the real `image`/`images` assets for projects/design here (they were explicit
  V4 TODOs since V2) and confirm no route points at a missing `/public` file.

# Stage 3 Report

Four routes reskinned to the design system, all data-driven, with real image assets
ported from the old `CharlieRamus.com` repo. `/blog` stays dropped (redirected).

- [x] **`/web-projects` ← `webProjects` (all 6, curation order).** `app/web-projects/page.tsx`
  renders each project as a text/visual row: `Featured` kick on the two `spotlight` builds
  (Ostiara, MyLifeInARepo — array order already gives them top billing), `title`/`date`/
  `description`/`tags`, and an external link (`View on GitHub` for GitHub hrefs, the bare
  domain otherwise; hidden when `href` is `""`). **Real screenshots** wired to the two that
  have them — `MyLifeInARepo` (`/images/web/mylifeinarepo.webp`) and `charlieramus.com`
  (`/images/web/charlieramus-com.webp`); the other 4 (Ostiara is stealth, Querryn/VaultDNA/
  Browser-automation had none) render a **design-system `<Flower>` placeholder** (petal color
  cycled by index), consistent with the homepage bands' honest-placeholder approach.
- [x] **`/design` ← `designProjects` (all 3).** `app/design/page.tsx` renders each project as a
  header (`title`/`date`/`description`) + a slide gallery. Wired the `images[]` arrays to real
  decks: **Notion** (10 slides), **Spotify IMC** (6 panels), **Photography Presentation UI**
  (4 slides). Added an optional **`ratio`** to the `DesignProject` type (slides are uniform
  within a project) so each grid frame matches the slides' aspect exactly — landscape decks
  (16:9, 3:2) render 2-up, the portrait deck (9:16) 4-up, and `object-fit: cover` on a matched
  frame means **no crop/distortion**. Each slide is a focusable link that opens the full-size
  image. 20 slides total, **0 broken images**.
- [x] **`/gear` ← `gear` + `gearSections`.** `app/gear/page.tsx` renders the four sections
  (Camera Bodies / Lenses / Bags / Accessories) as a 2-column set of name→note lists; per-item
  `href` becomes a link when set (all `""` now, so none render). Straightforward, in-system.
- [x] **`/blog` — dropped, redirected.** No in-app link points at `/blog` (V3's dead-link table
  never had it), but `next.config.ts` now `redirects()` `/blog → /writing` (permanent 308) so
  any external/bookmarked link resolves. Verified: `curl /blog` → `308 → /writing`.
- [x] **Assets ported into `public/images/`** (~2.3 MB): `web/` (2 screenshots),
  `design/notion/` (10), `design/spotify/` (6), `design/photography-ui/` (4). All tracked.
- [x] **Data edits:** `projects-web.ts` — added `image` to MyLifeInARepo + charlieramus.com.
  `projects-design.ts` — added `images[]` + `ratio` to all 3 (+ the `ratio` type field). No
  content re-typed; `personal-bento` (the only `designProjects` consumer) still count-drives
  fine.
- [x] **`app/globals.css`** — one `@layer components` block: shared inner-page chrome
  (`.inner`, `.inner-nav` aligned to `--maxw`, `.inner-head`, `.inner-lede`, `.tag`), the
  web-projects rows (`.proj-*`), the design galleries (`.design-*`, ratio-framed slides), and
  the gear lists (`.gear-*`). Responsive stacks at ≤880px; `prefers-reduced-motion` disables
  the slide hover-scale. Reuses `--edge`/`--color-*` + the `.writing-kicker` eyebrow.

**Data flow:** `projects-web` → `/web-projects` rows (+ `image`/placeholder visual);
`projects-design` → `/design` galleries (`images[]` framed by `ratio`); `gear`/`gearSections`
→ `/gear` sections. Assets live in `public/images/{web,design/*}`.

**Verify:** `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean; `/web-projects`,
`/design`, `/gear` all prerender **static**. Rendered on the prod server and eyeballed at
**1440 / 768 / 375**: **no horizontal overflow** at any width, **zero console errors**, **no
broken images** on any route. Confirmed all 6 web projects render (2 real screenshots + 4
flower placeholders), all 20 design slides load, gear lists read cleanly, and rows stack to a
single column on mobile. (Below-fold rows are `Reveal` fade-ups — verified they reveal on
scroll; `prefers-reduced-motion` shows them immediately.)

**Dead links resolved:** the homepage `/web-projects` (bento Playground, Work "See all",
Right Now journal fallback) and `/design` (bento Graphic-design card) targets now resolve.

**Issues:** (1) Only 2 of 6 web projects have real screenshots — Ostiara is stealth (no
shots), and Querryn/VaultDNA/Browser-automation had none in the old repo; they use flower
placeholders until Charlie supplies images (swap into `webProjects[].image`). (2) Design
slides open the full image in a new tab (no dedicated lightbox) — a deliberate keep-it-simple
call for Stage 3; a shared gallery lightbox could be a V5 polish. (3) The back-nav is still
the minimal placeholder; the consistent inner-page header/footer is **Stage 4** (note:
`/web-projects`·`/design`·`/gear` use a wider `.inner-nav` aligned to `--maxw`, while
`/writing`·`/photography` use the 760px `.writing-nav` — Stage 4 unifies these).

---

## Stage 4 — Wire nav, header images, cross-links

- Add the essays' **`headerImage`** assets and set the (typo-free) paths in each
  MDX's frontmatter — V2 blanked them to `""` on purpose; author them now via the
  same asset discipline as the photos.
- Connect the **homepage → inner-route links** V3 left dangling (nav items, "View the
  gallery", "see all work", writing/blog cards) so every link resolves. Add inner-page
  nav/back-to-home + consistent header/footer (reuse `socials`/`contactEmail`).
- Per-route `metadata` (title/description) for SEO; OG images where it matters.

# Stage 4 Report
_TBD._

---

## Stage 5 — Verify + consistency + preview

- `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean; every dynamic route
  prerenders (or is intentionally dynamic — note which).
- **Render + eyeball** every route at 1440 / 768 / 375: no horizontal overflow, images
  lazy-load with blur, the lightbox traps focus + closes on Esc, MDX prose reads
  cleanly, zero console errors. Screenshot the set for Charlie.
- Consistency: no dead links remain (homepage ↔ inner pages resolve); no route points
  at a missing `/public` asset; design tokens used throughout; `prefers-reduced-motion`
  honored on the lightbox + any reveals.
- Confirm the site is **feature-complete** ahead of **V5** (polish / a11y / responsive
  / deploy + cutover). List anything deferred to V5.
- Push the branch → Vercel preview; share the URL.

# Stage 5 Report
_TBD._
