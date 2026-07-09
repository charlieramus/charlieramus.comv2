# UPDATELOG V5 — POLISH · A11Y · SEO · DEPLOY → CUTOVER

**First read `DESIGN-BRIEF.md`**, `AGENTS.md`, and the **V4 stage reports** (their
"Deferred to V5" / "Issues" lines are this log's punch-list). Goal of V5: take the
feature-complete V4 site and make it **shippable** — fill the last real-asset gaps,
do a full responsive + visual polish pass, an accessibility sweep, SEO/metadata +
performance, then **deploy and cut over** charlieramus.com — the cutover **only when
Charlie explicitly says so** (`ROADMAP.md` V5).

**State at V5 start.** All routes exist and resolve (`/`, `/writing` + `/writing/[slug]`,
`/photography`, `/web-projects`, `/design`, `/gear`); the MDX + photography pipelines are
live; a shared header/footer is wired; `build`/`tsc`/`eslint` are clean and there's no
horizontal scroll / console errors / broken links at 1440·768·375. V5 changes **should not
regress** any of that.

**Hard constraints.**
- **Read `node_modules/next/dist/docs/` before writing Next code** — metadata/OG, sitemap
  & robots (`app/sitemap.ts` / `app/robots.ts`), `next/image`, icons, deploy. Heed
  deprecations (modified Next 16 — APIs may differ from training data).
- **Tailwind v4 is CSS-first** — reuse the `@theme` tokens + component classes in
  `globals.css`; add polish CSS in `@layer components`, **not** a new scoped dump. Keep the
  design pixel-faithful to `mockups/hellodani-mockup.html`.
- **Data is the source of truth** — real assets go through the existing discipline:
  photos via `npm run sync-gallery` (`public/photos/gallery.json`), project/design/essay
  images into `webProjects[].image` / `designProjects[].images` / MDX `headerImage`. Keep
  `// CUSTOMIZE` markers.
- All motion respects `prefers-reduced-motion`; images are `next/image` with real
  dimensions + `blurDataURL`.
- Verify each stage with `build` + `tsc` + `eslint`, then **render + eyeball** every
  affected route at 1440 / 768 / 375. Don't commit/push unless Charlie asks.

---

## Stage 1 — Fill the real-asset gaps

The V4 placeholders that need real content before polish.
- **Web-project screenshots** — 4 of 6 render a `<Flower>` placeholder (Ostiara is stealth,
  Querryn / VaultDNA / Browser-automation had none). Add real shots to `webProjects[].image`
  (16:10-ish, WebP) so the placeholders drop out — or confirm which stay decorative.
- **Essay header image** — `the-hobby-hexagon-is-a-trap` is intentionally headerless; add its
  `headerImage` (same `public/images/writing/` discipline) or confirm it ships without one.
- **Gear / design detail** — per-item `gear[].href` and any `note`s are all `""`; wire the
  ones Charlie wants linked. Add any newer design projects (`designProjects`) or extra web
  projects Charlie has since made (don't invent — Charlie supplies).
- **DECISION → Charlie:** which imageless web projects get real screenshots vs. stay
  placeholder, and whether the hobby-hexagon essay gets a header.

# Stage 1 Report
_TBD._

---

## Stage 2 — Responsive + visual polish + homepage photo surfaces

A designer's-eye pass now that every page holds real content.
- **Full sweep at 1440 / 768 / 375** (spot-check 320 + a wide 1920): spacing rhythm, type
  scale, tap-target sizes, image crops (the Longs Peak film-strip `Frame` photos, the
  header-image banner crop), the contact box / services fan / digital-home carousel on the
  homepage. Fix any awkward wraps or cramped mobile states.
- **Wire the homepage photography surfaces to real photos** (the last data hookup V4 left):
  the bento **Photography** grid still uses halftone placeholder tiles, and the **"Right now"**
  strip ships with 3 cards — add the 4th **recent-trip photo** card from
  `photos.filter(p => p.featured)` sorted by `date` (newest = Longs Peak). The `featured`/
  `location`/`date` data is already populated (V4 Stage 2).
- **Design-gallery lightbox** — the `/design` slides currently open full-size in a new tab;
  give them the same focus-trapped lightbox as `/photography` (generalize the component).
- Confirm the design stays pixel-faithful to the mockup; no new scoped CSS dumps.

# Stage 2 Report
_TBD._

---

## Stage 3 — Accessibility sweep

Every route, keyboard-first and screen-reader-checked.
- **Landmarks + headings** — one `<h1>` per page, ordered headings, `<main>`/`<nav>`/`<footer>`
  landmarks, a skip-to-content link.
- **Keyboard + focus** — visible focus on every interactive element, logical tab order, the
  lightbox trap already verified (re-confirm), no keyboard traps elsewhere; `:focus-visible`
  rings on cards/links/slides.
- **Images + semantics** — meaningful `alt` on every content image (decorative ones
  `aria-hidden` / empty alt — e.g. `Flower` already is), `aria-current` on active nav (done),
  button vs. link semantics correct.
- **Contrast** — audit text/UI against AA (the `--color-ink-soft` on `--color-paper`, red
  links, cyan code badge on the dark lightbox, muted metadata).
- **Reduced motion** — re-audit every animation (reveals, flowers, hovers, lightbox fade,
  carousel) honors `prefers-reduced-motion`.
- Run **axe / Lighthouse a11y** on each route; fix findings. Note anything intentionally left.

# Stage 3 Report
_TBD._

---

## Stage 4 — SEO, metadata, icons, performance

- **Per-route OG images** — essays use their `headerImage`; the gallery a `featured` photo;
  a default site OG for the rest. Titles/descriptions already per-route (V4).
- **Crawl + share** — `app/sitemap.ts`, `app/robots.ts`, canonical URLs, and JSON-LD
  (`Person` on `/`, `Article` on essays). Favicon + app icons (`app/icon`, `apple-icon`).
- **Performance** — Lighthouse pass: right-sized `next/image` `sizes`, `priority` only where
  it earns it, font-loading (`display: swap` already), lazy-load below the fold, check the
  61-photo gallery's payload. Target green Core Web Vitals.
- **Build hygiene** — silence the cosmetic Turbopack workspace-root warning (`turbopack.root`
  or drop the stray `C:\Users\jason` lockfile).

# Stage 4 Report
_TBD._

---

## Stage 5 — Deploy + cutover

- Production **deploy on Vercel** — connect the repo, set the production branch/domain and any
  env, confirm the `/blog → /writing` redirect (and add any other legacy redirects the old
  site needs). Smoke-test **every route on the production URL** at 1440 / 768 / 375: no
  console errors, images/blur load, lightbox works, links resolve.
- **Cutover** — point **charlieramus.com** at this repo and retire the old one. **Only when
  Charlie explicitly says so** (`ROADMAP.md` V5). Preserve/verify any inbound links from the
  old site (article slugs changed `article-one…four` → real slugs — add redirects if the old
  URLs are indexed).
- Final confirmation: the new site fully replaces the old, nothing points at the retired repo.

# Stage 5 Report
_TBD._
