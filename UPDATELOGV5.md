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

Stage 1 is the "fill real-asset gaps" stage, and by design its work is **gated on Charlie
supplying assets/decisions** (`don't invent — Charlie supplies`). I surveyed every gap,
got Charlie's decisions, and — at Charlie's request — consolidated everything he still has
to hand-provide (across the **whole project**, not just this stage) into a single running
checklist. No invented assets; no data fabricated.

**Decisions (Charlie, this session):**
- **Web screenshots** — Charlie *will supply* real shots for the 3 imageless non-stealth
  projects (Querryn / VaultDNA / Browser-automation); **Ostiara stays a Flower placeholder**
  (stealth, no shot). He'll drop the files in a follow-up, so the wiring is **deferred until
  they land** (target paths + format documented).
- **Hobby-Hexagon essay** — **ships headerless** (confirmed intentional). No change; the
  render branch already handles empty `headerImage`.
- **Gear links/notes** — Charlie will provide later.
- **New projects** — **none to add**; the current 6 web + 3 design projects are complete.

- [x] **Surveyed all real-asset gaps.** Confirmed via a project-wide sweep: the 4 imageless
  web projects (`webProjects[].image` unset), the headerless essay, all 8 `gear[].href` empty
  + 4 empty `note`s, all 4 essays' `externalLink` empty, 2 `experience[].href` empty. Searched
  every sibling project folder for portable screenshots — **none exist** (only icons/logos/
  branding for Querryn & Axiom), so nothing could be ported without Charlie.
- [x] **Created `MANUAL-TODO.md`** (repo root) — the deliverable Charlie asked for: a single
  checklist of everything he must supply by hand, grouped by consuming stage, with exact
  target file paths, formats, drop locations, and fill-in tables. Covers §1 web screenshots,
  §2 gear links/notes, §3 writing/content confirmations, §4 SEO/OG/icons (Stage 4), §5 deploy
  + cutover incl. the **legacy article-slug → new-slug redirect map** (recovered from the old
  repo: `article-one…four` → `architecture-of-self-justification` / `when-bigger-means-more-
  biased` / `the-third-rotation` / `the-hobby-hexagon-is-a-trap`), and §6 connector auth
  (Vercel/Intercom MCP unauthorized in-session).
- [x] **No code/data changes** this stage — every actionable item is blocked on Charlie's
  assets (screenshots to be dropped, gear links to be provided). The one settled decision
  (hobby-hexagon headerless) needs no change since V4 already ships it that way.

**Data flow:** none changed. `MANUAL-TODO.md` is the hand-off surface; as assets land they
flow into `data/projects-web.ts` (`image`/`href`), `data/gear.ts` (`note`/`href`), MDX
frontmatter (`externalLink`), and `next.config.ts` (legacy redirects).

**Verify:** no source touched, so `build`/`tsc`/`eslint` are unchanged from the clean V4
baseline (nothing to regress). `MANUAL-TODO.md` is documentation only.

**Issues:** (1) Real blockers are external — Querryn/VaultDNA/Browser-automation screenshots
and gear links are pending Charlie; the wiring is a fast follow once files land. (2) Deploy/
cutover (Stage 5) additionally needs the **Vercel connector authorized** — can't be done
from a headless session. All tracked in `MANUAL-TODO.md`.

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

Wired the last homepage photo surfaces to real photos, generalized the photography
lightbox into a shared primitive and gave the `/design` galleries the same
focus-trapped lightbox, and ran a responsive sweep at 1440 / 768 / 375 (+ found and
fixed a real mobile bug). Everything renders from real data now; no new scoped CSS.

**Homepage photo surfaces → real content**
- [x] **Bento Photography grid** (`components/personal-bento.tsx`) — the 4 halftone gradient
  placeholder `<i>` tiles are now 4 real featured photos (`next/image` thumbnails with
  `blurDataURL`). Curated for variety by `code` (`0001` Reykjavik / `0013` aurora / `0030`
  Diamond Beach / `0004` Skógafoss); the Longs Peak film-strip Frames are **excluded here**
  since a square crop clips their baked border (they read correctly in the full gallery).
  Decorative inside the described "Photography → View the gallery" link, so `alt=""`.
- [x] **Bento Graphic-design grid** — same halftone-placeholder pattern, so I also wired it to
  real thumbnails: the first slide of each `designProject` (`images[0]`). The whole bento is
  real content now instead of half-real. (Beyond the explicit photography ask, but the same
  cleanup — noted for review.)
- [x] **"Right now" 4th card** (`components/right-now.tsx`) — added the recent-trip photo card:
  `photos.filter(p => p.featured)` sorted by `date` descending (stable), newest wins →
  **Longs Peak, Colorado (2026-06)**. Renders as a `.now-photo` card — a cover `next/image`
  under a bottom legibility veil with a `Recent trip` kick + `location` + "See the gallery"
  linking to `/photography`. The strip is now **4 cards** (was 3).

**Shared lightbox + `/design`**
- [x] **New `components/lightbox.tsx`** — extracted the photography lightbox into a controlled,
  reusable primitive (`LightboxItem[]` + `index`/`onIndex`/`onClose`). Carries all the a11y:
  `role="dialog"`+`aria-modal`, Escape, ← / → with wraparound, Tab focus-trap, body-scroll
  lock, and **focus-return to the opener** (captured from `document.activeElement` on open, so
  no per-consumer trigger refs). Prev/next hidden when there's a single item.
- [x] **`components/photography-gallery.tsx`** — refactored to render just the grid + `<Lightbox
  items={photos}>`; dropped its inlined keyboard/scroll/focus logic (now in the primitive).
- [x] **`components/design-gallery.tsx`** (new, client) + **`app/design/page.tsx`** — the design
  slides were `<a target="_blank">` (raw image in a new tab). They're now `<button>`s that open
  the shared `<Lightbox>`; slides across all 3 projects share one flat `items` list so ← / →
  steps the whole board. Design page stays a server component (metadata/header/footer) and hands
  `designProjects` to the client gallery. **Resolves V4 Stage 3 Issue #2.**
- [x] **`app/globals.css`** — `@layer components` only, reusing tokens: `.now-grid` → 4 cols with
  a `≤1100px` 2×2 step (placed before the existing `≤880px` 1-col rule so it still wins);
  `.now-photo*` (veil + white-on-image label overrides); `.ptile-img`/`.pgrid-img` (clean cover
  tiles, no halftone); a `<button>` reset on `.design-slide`. The existing `.lightbox*` block was
  already generic, so the design lightbox reuses it as-is (0 new lightbox CSS).

**Responsive sweep + bug fix**
- [x] **Fixed a real mobile bug:** at 375 the bento photo tiles collapsed to **0 height**
  (`grid-auto-rows: 1fr` gives no height when the card is content-sized, not stretched — only
  the desktop career-journey card was making the row tall). Changed to `minmax(48px, 1fr)`, so
  tiles hold height on mobile (28×48) while 1fr still stretches them on desktop. Verified tile
  rects: photo 4×(28×48), graphic 3×(39×70) at 375.

**Verify:** `tsc` / `eslint` / `build` all clean; `/design` still prerenders **static** (client
gallery nested in a static server page). Drove the prod build headless (gstack browse):
**no horizontal overflow on all 6 routes × 1440 / 768 / 375** (`scrollWidth ≤ clientWidth`
everywhere), **zero console errors**. Exercised both lightboxes: design opens on a slide as
`role=dialog`/`aria-modal`, focus lands on Close, body scroll locks, ← / → steps slides,
**Escape closes + returns focus to the opening button** (keyboard-opened); photography lightbox
re-verified working after the refactor (code badge, arrow-nav, focus-return). Eyeballed the
bento (4 real photos + 3 real design thumbs) and the 4-card "Right now" strip (Longs Peak photo
card) at desktop + mobile.

**Issues:** (1) The recent-trip card uses a Longs Peak film-strip Frame (the only featured
Longs Peak shots are Frames); cover-crop keeps its baked sprocket border partly visible — that's
Charlie's intended aesthetic, reads fine over the veil. (2) Bento tiles are small decorative
cover-crops (e.g. the Notion title slide crops mid-text); acceptable as previews — the real
assets live full-size on `/photography` and `/design`. (3) Real web-project screenshots are
still pending Charlie (Stage 1 / `MANUAL-TODO.md`) — unrelated to these surfaces.

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

Full accessibility sweep, keyboard-first and axe-verified. Landmarks fixed, a
skip link + consistent focus rings added, the carousel made keyboard-operable,
reduced-motion coverage completed, and every axe color-contrast finding resolved.
**axe-core (WCAG 2 A/AA) reports 0 violations on all 7 routes at 1440 and 375.**

**Landmarks + headings**
- [x] **Homepage `<main>`** (`app/page.tsx`) — the sections had no `<main>`. Wrapped the
  primary content in `<main id="main-content" tabIndex={-1}>`; the hero `<header>` is the
  banner and the legal line is now a `<footer>` (contentinfo). One `<h1>` (the name).
- [x] **Inner-page landmarks** — all 6 pages had `<SiteHeader>`/`<SiteFooter>` *inside*
  `<main>`, so a `<header>` nested in main is **not** a banner and a nested `<footer>` is
  **not** contentinfo — the pages had neither landmark. Lifted both out:
  `<><SiteHeader/><main id="main-content" tabIndex={-1}>…</main><SiteFooter/></>` on
  `/writing`, `/writing/[slug]`, `/photography`, `/web-projects`, `/design`, `/gear`. Now
  each page exposes banner + main + contentinfo; still exactly one `<h1>`, ordered `h2`/`h3`.
- [x] **Skip-to-content link** (`app/layout.tsx` + `.skip-link` CSS) — first focusable element;
  hidden until focused, then slides in top-left and targets `#main-content` (verified it
  reveals + moves focus into main).

**Keyboard + focus**
- [x] **Consistent `:focus-visible` rings** (`app/globals.css`) — a global blue 2px ring on
  `a`/`button` (mouse clicks stay clean via `:focus-visible`), so every card link, nav item,
  pill, `.btn`, and the contact box shows focus. The bespoke rings (gallery/design/lightbox
  white-on-dark) still win by specificity. Verified the ring paints on a nav link.
- [x] **Carousel keyboard access** (`components/digital-home.tsx`) — the horizontally-scrollable
  "digital home" strip was a scroll container with no keyboard access (axe:
  `scrollable-region-focusable`). Added `tabIndex={0}` + `role="group"` + `aria-label`, and a
  `.carousel:focus-visible` ring. Fixed.
- [x] **Lightbox trap** re-confirmed working (Stage 2 primitive, untouched): focus-trap, Esc,
  arrows, scroll-lock, focus-return.

**Images + semantics**
- [x] Decorative graphics already `aria-hidden` (flowers, finale field, bento photo/design tiles
  `alt=""`); added `aria-hidden` to the **contact peace-sign SVG**. Content images keep
  meaningful `alt` (gallery, essay headers, design slides). `aria-current="page"` on active nav.
  Hero nav given `aria-label="Primary"`.

**Contrast (all resolved; DECISION — Charlie: scoped accessible link-red)**
- [x] **Brand red as text** — `#f32317` on paper is **3.73:1** (fails AA-normal), and axe flagged
  it on every red nav/accent link. Per Charlie's call, added a **`--color-red-ink: #d21a0f`
  (4.84:1)** token and swapped it into the **13 red *text* rules** (nav links, `.proj-kick`,
  `.proj-link`/`.gear-name`/`.writing-item`/`.writing-prose`/`.site-logo`/`.go` hovers, footer
  socials). **Decorative reds stay `#f32317`** (flower fills, dots, the contact card background,
  the active-nav underline) — brand look preserved.
- [x] **Carousel caption** `.s-acie .body` (`#888` on the light shot, 3.4:1) → `--color-ink-soft`.
- [x] **Stat-row caption** `.ui .statrow small` (`#888` on the panel, 2.9:1) → `--color-ink-soft`.
- [x] **Contact `.vibe`** (white on brand-red, 4.14:1) failed only at 375 where it shrank to 18px
  bold — one under the WCAG large-text threshold. Bumped the clamp min to **19px** so it
  qualifies as large text (3:1 bar) and the decorative red card can stay unchanged.
- Reading text (`--color-ink`, `--color-ink-soft`) and blue links already pass AA; the cyan code
  badge on the dark lightbox is high-contrast.

**Reduced motion**
- [x] Re-audited every animation. Only two keyframes exist (`windspin`, `lb-fade`) — both already
  disabled under `prefers-reduced-motion`, along with `.reveal`, the gallery/design image scales,
  and the lightbox fade. **Added** the card **hover-lifts** (`.now-card`/`.pcard` transition +
  transform) and the `.skip-link` transition to the reduce block, so no non-essential motion
  remains. (CDP media-emulation is blocked in-session, so this is verified by reading the
  media-query coverage, which is complete.)

**Verify:** `tsc` / `eslint` / `build` clean; every route still prerenders static/SSG. Drove the
prod build headless with **axe-core injected per route** (reveals forced past their fade to avoid
false positives): **0 violations on `/`, `/writing`, `/photography`, `/web-projects`, `/design`,
`/gear`, `/writing/[slug]` at 1440 — and re-checked `/`, `/photography`, `/gear`, `/web-projects`
at 375: also 0.** No horizontal overflow and no console errors on any route/width after the
landmark restructure; eyeballed the nav (accessible red + focus ring) and `/gear` (banner/main/
contentinfo intact).

**Issues:** (1) The digital-home carousel's **gradient** placeholder shots (`.s-warm` etc.) render
axe as *incomplete* (it can't sample a gradient) — the white-on-orange caption is low-contrast, but
these are **decorative browser-window placeholders** slated for real screenshots (Stage 1 / pending
Charlie); the same project titles appear as real headings elsewhere. Noted, not blocking. (2) The
brand red `#f32317` remains on decorative fills by design (Charlie's scoped-red decision) — that's
intentional, not a gap.

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

SEO/metadata/OG/icons/perf, all read from the Next 16 metadata docs first
(`metadata-and-og-images`, `sitemap`, `robots`, `app-icons`, `opengraph-image`, `json-ld`).
Everything is data-driven off one `SITE_URL` constant and the brand motif, so nothing here
is hand-authored HTML.

**Site identity + canonical**
- [x] **`data/site.ts`** — `SITE_URL = "https://charlieramus.com"` + `SITE_NAME`, the single
  source for every absolute URL. (Canonical domain defaulted per the whole-project intent;
  change in one place if it ever differs — noted in `MANUAL-TODO.md`.)
- [x] **`app/layout.tsx`** — `metadataBase: new URL(SITE_URL)` (resolves relative OG/canonical
  URLs), a `title.template` (`%s — Charlie Ramus`) so inner routes set a short title, root
  `alternates.canonical: "/"`, full `openGraph` (type/siteName/url/locale/title/description) and
  a `twitter` `summary_large_image` card.
- [x] **Per-route canonical + short titles** — `/web-projects`·`/design`·`/gear`·`/writing`·
  `/photography` each set `alternates.canonical` + a short `title` (template appends the suffix;
  dropped the now-unused `snapshot` imports). Verified rendered `<title>` + `<link rel=canonical>`
  per route.

**OG images (per-route)**
- [x] **Default card — `app/opengraph-image.tsx`** (`next/og` `ImageResponse`, 1200×630): three
  brand daisies + `Charlie Ramus` + roles + tagline on paper. Inherited by every route that
  doesn't override. Reuses a new **`lib/flower-svg.ts`** (the daisy as an SVG data-URI, geometry
  mirrored from `components/flower.tsx`) — no font files needed (ImageResponse's default font).
- [x] **Essays → `headerImage`** (`app/writing/[slug]` `generateMetadata`, `og:type=article`);
  the **headerless** essay falls back to the default card (explicit `images: ["/opengraph-image"]`,
  since setting `openGraph` otherwise drops the inherited image — caught + fixed).
- [x] **`/photography` → a featured photo** (`openGraph.images` = first `featured` photo). Verified
  the rendered `og:image` per route (default / essay-header / featured-photo, one tag each).

**Crawl + structured data + icons**
- [x] **`app/sitemap.ts`** — static routes + every essay (driven by the `writing` manifest, so new
  essays auto-list) with `lastModified`/`changeFrequency`/`priority`. Emits `/sitemap.xml`.
- [x] **`app/robots.ts`** — allow-all + `Sitemap:` + `Host:` → `/robots.txt`.
- [x] **JSON-LD** — `Person` on `/` (name/url/jobTitle/address/`sameAs` = socials, from
  `data/about` + `data/socials`) and `Article` on each essay (headline/author/image/url), both
  as sanitized `<script type="application/ld+json">` (per the Next json-ld guide, `<` → `<`).
  Verified `@type` renders on each.
- [x] **Icons — `app/icon.tsx` (32²) + `app/apple-icon.tsx` (180²)** — generated red brand daisy on
  paper (`ImageResponse`); `favicon.ico` stays as fallback. Verified the `<link rel=icon>` /
  `apple-touch-icon` tags + the rendered PNGs.

**Performance**
- [x] Audited every `next/image`: `sizes` on all; `priority` only where it earns it (gallery
  first-4, the on-demand lightbox, the above-fold essay hero) — below-fold images (bento,
  right-now, design slides, web screenshots) lazy-load by default. Fonts already `display: swap`;
  gallery thumbnails are ≤600px WebP with `blurDataURL`. Gallery (heaviest route) domReady ≈43ms
  locally, no blocking. (Full Lighthouse/CWV under throttling is best run against the Vercel
  preview in Stage 5 — the optimizations that move CWV are in place.)

**Build hygiene**
- [x] **`next.config.ts`** — `turbopack: { root: path.join(__dirname) }` pins the workspace root, so
  Turbopack stops inferring it from the stray `C:\Users\jason` lockfile. **The multi-lockfile build
  warning is gone.**

**Generated brand assets (swappable):** the OG card + favicon/apple-icon are generated from the
flower motif (the option offered in `MANUAL-TODO.md §4`, which is now updated to "built"). Charlie
can drop a real `opengraph-image.png` / `icon.png` / `apple-icon.png` into `app/` to replace any of
them.

**Verify:** `tsc` / `eslint` / `build` clean; all routes prerender static/SSG (incl. `/icon`,
`/apple-icon`, `/opengraph-image`, `/sitemap.xml`, `/robots.txt`). Rendered the OG card + icon
(eyeballed — clean, on-brand). Inspected `<head>` on `/`, both header'd + headerless essays,
`/photography`, `/design`: correct canonical, one `og:image` each (default / header / featured
photo), `og:type`, twitter card, and JSON-LD `@type`s. Re-ran **axe on `/`, an essay, and
`/photography` → 0 violations**, no horizontal overflow, no console errors (Stage 3 stays green).

**Issues:** (1) Essay `<meta description>` is a generic "*<title> — an essay by Charlie Ramus*"
(no excerpt field exists); a real per-essay summary needs a Charlie-authored `excerpt:` in
frontmatter — noted in `MANUAL-TODO.md §4` (🟡, optional). (2) Real Core Web Vitals numbers should
be confirmed on the deployed preview (Stage 5); can't run throttled Lighthouse headless here.

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
