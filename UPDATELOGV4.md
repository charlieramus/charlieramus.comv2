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
_TBD._

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
_TBD._

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
