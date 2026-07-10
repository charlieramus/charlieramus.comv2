# UPDATELOG V6 — REFINEMENT · MOTIF SYSTEM · HOMEPAGE REWORK

**First read `DESIGN-BRIEF.md`, `AGENTS.md`, the V5 stage reports, and `MANUAL-TODO.md`.**
V5 left the site feature-complete, accessible (axe 0), and SEO-ready. **V6 is a second
polish pass focused on the _details_** plus three larger moves Charlie asked for:

1. **Chrome cleanup** — strip the script wordmark from the inner-page header, rework the
   footer copy to match the homepage contact card, and remove the footer from the bottom of
   the homepage so the flower finale fills the screen.
2. **A pluggable motif system** — turn the one hardcoded daisy into a registry of 7–10
   selectable SVG designs Charlie can swap in as the "flowers."
3. **Homepage rework** — the "A little more personal" bento + career-journey timeline are
   cramped/unviewable; re-lay the homepage to breathe across a longer (~two-screen) scroll:
   bigger cards, more whitespace, more motif accents, a readable timeline, and a better name
   for that section.

Plus a general UI-clean pass and a visual sign-off. **Deploy + cutover moved to its own log:
`UPDATELOGV7.md` (Cloudflare Pages) — it supersedes V5 Stage 5's Vercel plan and only needs V6
finished, so the two are independent.**

**Hard constraints (carry over from V5 + additions).**
- **Read `node_modules/next/dist/docs/` before writing Next code** — static export, `next/image`
  loaders, metadata routes under export, deploy. Heed deprecations (modified Next 16).
- **Tailwind v4 is CSS-first** — reuse the `@theme` tokens + component classes in `globals.css`;
  add polish in `@layer components`, no new scoped dump.
- **Don't regress V5.** Keep **axe at 0 violations**, no horizontal scroll, no console errors,
  reduced-motion honored, every route still prerenders. Re-run the axe sweep after visual work.
- **Data is still the source of truth** (`// CUSTOMIZE` markers stay). The motif registry is new
  data; the homepage rework is a re-layout of existing data, not new content.
- **Pixel-faithfulness to the mockup is intentionally relaxed** for the homepage rework
  (Stage 4) and the chrome changes — Charlie is deliberately departing from the mockup here.
  Everything else stays on-system.
- Verify each stage with `build` + `tsc` + `eslint`, then **render + eyeball** every affected
  route at 1440 / 768 / 375 (+ spot-check a short viewport for the finale fill). Don't
  commit/push unless Charlie asks.

---

## Stage 1 — Chrome cleanup: header wordmark, footer copy, homepage footer

Small, high-signal edits to the shared chrome.

- **Inner-page header (`components/site-header.tsx` + `.site-header*` CSS)** — remove the
  script **"charlie ramus"** wordmark (`.site-logo`, `--font-script`). Keep the cross-nav
  (`Work · Design · Photography · Writing · Gear`) exactly as it is (Charlie likes it).
  - **DECISION → Charlie:** what sits top-left where the wordmark was?
    (a) nothing — the nav left-aligns / centers;
    (b) **a small brand motif mark that links home** *(recommended — keeps a home affordance,
    on-brand, no script font)*;
    (c) a tiny plain-text "CR" home link.
    _Draft assumes (b): a small motif (the new Stage 3 mark) as the home link._
- **Footer copy (`components/site-footer.tsx`)** — replace **"Think we vibe?"**
  (`.site-footer-vibe`) with **"Looking to reach me?"** and keep the **"Get in touch"** button,
  so the inner-page footer CTA reads exactly like the homepage contact card (`.vibe` +
  `.huge`). No other footer change (socials + legal stay).
- **Homepage footer removal (`app/page.tsx`)** — drop the `<footer className="legal-min">`
  copyright line so **nothing sits below the flower finale** (sets up Stage 2's fill-the-screen).
  - **DECISION → Charlie:** where the © line goes now —
    (a) **a tiny, unobtrusive © pinned in a corner of the finale** *(recommended — keeps the
    legal line without adding chrome below the flowers)*;
    (b) drop the homepage © entirely (it still lives in the inner-page footer);
    (c) keep it but restyle so it doesn't break the fill.
    _Draft assumes (a)._
- Leave the **homepage hero nav** (`work · photography · about`) as-is — Charlie didn't object.

# Stage 1 Report

Chrome cleanup landed. Both **DECISION → Charlie** points were answered by Charlie
(not the draft defaults):

- **Header mark → (a) nothing, nav left-aligns.**
- **Homepage © → (b) dropped entirely** (it still lives in the inner-page footer).

- [x] **`components/site-header.tsx`** — removed the `<Link href="/" className="site-logo">charlie
  ramus</Link>` script wordmark. The header is now nav-only; `.site-header-inner`'s
  `justify-content: space-between` leaves the single `<nav>` left-aligned inside `.wrap`. The
  cross-nav (Work · Design · Photography · Writing · Gear) and its active-state logic are
  untouched. Updated the file's top comment to reflect the wordmark removal. `Link` is still
  imported (used by the nav links).
- [x] **`components/site-footer.tsx`** — replaced `Think we vibe?` with **`Looking to reach me?`**
  in `.site-footer-vibe`. The `Get in touch` mailto button, socials row, and legal line are
  unchanged, so the inner-page footer CTA now reads like the homepage contact card.
- [x] **`app/page.tsx`** — deleted the `<footer className="legal-min">© {year} …</footer>` block
  (and its `CUSTOMIZE` comment) so nothing sits below `<Finale />`. `snapshot` stays imported
  (still used by the `personLd` structured data).
- [x] **`app/globals.css`** — removed the now-dead `.site-logo` / `.site-logo:hover` rules and the
  `.legal-min` rule (both were only used by the two elements deleted above; remaining refs are
  docs + the mockup). The `--font-script` token stays (still used elsewhere, e.g. `.script`).

**Data flow:** no data changes — this is pure chrome. Footer/header still read from
`data/socials.ts` + `data/about.ts`; the homepage © was static JSX and is simply gone.

**Verify:** `npx tsc --noEmit` clean · `npx eslint .` clean · `npm run build` clean (all 18
routes still prerender static/SSG). Rendered `/writing` at 1440 + 375 — header is nav-only, no
wordmark; footer reads "Looking to reach me? / Get in touch". Rendered `/` at 1440 scrolled to
bottom — the flower finale is the last thing on the page, no © line beneath it; `.legal-min` is
absent from the DOM.

**Issues:** None in the shipped code. Turbopack's dev server threw a stale
`global-error.js` React-Client-Manifest error after in-place edits (a known Next 16 HMR caching
artifact, per the `[[turbopack-stale-css]]` note); clearing `.next` and restarting resolved it.
The production `build` was clean throughout, so this was dev-only. Leftover HMR-websocket 500s in
the dev console trace to the earlier killed dev process, not to any Stage 1 change.

---

## Stage 2 — The flower finale fills the screen

Make the closing flower field a deliberate, full-viewport moment.

- **`components/finale.tsx` + `.finale` / `.grid-flowers` / `.center-text` CSS** — give the
  finale `min-height: 100svh` (use `svh`/`dvh`, not `vh`, so mobile browser chrome doesn't
  clip it) and center the quote + flower grid so scrolling to the bottom lands on a flower
  field that **perfectly fills the screen** with no chrome beneath it.
- Verify the fill at **1440 / 768 / 375** and a couple of viewport *heights* (short laptop,
  tall phone) — the grid should scale/crop gracefully, never leave a gap or force a second
  scroll past it.
- Fold in the © per the Stage 1 decision (tiny, non-intrusive) if (a) was chosen.
- Reduced-motion: the flower wind-spin already disables under `prefers-reduced-motion`; keep it.

# Stage 2 Report

The flower finale is now a full-viewport moment with nothing beneath it.

- [x] **`app/globals.css` `.finale`** — replaced `padding: 56px 0` with `min-height: 100svh` +
  `display: flex` + `padding: clamp(24px, 5vh, 60px) 0`. Using `svh` (not `vh`) so mobile browser
  chrome can't clip the field or force a scroll past the bottom. `overflow: hidden` stays (still
  clips edge flowers / their wind-spin so no horizontal scroll). `position: relative` stays (the
  quote is absolutely centered against it).
- [x] **`app/globals.css` `.grid-flowers`** — added `flex: 1` so the grid grows to fill the
  finale (full width via flex-grow, full height via the parent flex's default
  `align-items: stretch`), and `align-content: space-evenly` so the flower rows spread across that
  height and fill the screen evenly instead of clustering in a centered band. Kept the existing
  `grid-template-columns: repeat(8,1fr)` (→ 5 cols ≤880px), `gap`, `align-items`/`justify-items`.
- **No `.center-text` change needed** — it's already `position:absolute; top:50%; translate(-50%,-50%)`
  against `.finale`, so with the finale now a full viewport tall the quote lands dead-center of the
  screen when you scroll to the bottom.
- **© fold-in:** N/A — Charlie chose Stage 1 option (b) "drop the homepage © entirely," so there's
  no legal line to place in the finale.
- **Reduced motion:** untouched and still honored — `@media (prefers-reduced-motion: reduce) { .flower
  { animation: none } }` (globals.css) disables the wind-spin.

**Data flow:** none — `components/finale.tsx` (40-flower deterministic field + `finaleQuote` from
`data/about.ts`) is unchanged; this is pure layout CSS.

**Verify:** `tsc` / `eslint` / `build` all clean (18 routes still prerender). Rendered `/` scrolled
to the bottom at **1440×900, 768×1024, 375×812** plus a **short laptop (1440×600)** and **tall phone
(375×900)**. At every size the DOM checks return `belowFinalePx = 0` (finale is the last element,
nothing under it) and `scrollBottomGap = 0` (the bottom of the finale is exactly the bottom of the
scroll — no forced second scroll, no gap). The field fills the screen edge-to-edge with rows spread
by `space-evenly`, the quote centered mid-viewport; 5-col layout kicks in at ≤880 and still fills.
No horizontal overflow at 375 (`scrollWidth == innerWidth == 375`). After a clean `.next` restart the
homepage loads 200 with no console errors.

**Issues:** Same dev-only Turbopack quirk as Stage 1 — editing `globals.css` with the dev server
running caused intermittent `500 / stale global-error.js` responses (the `[[turbopack-stale-css]]`
caching artifact). `curl` returned 200 throughout, the production `build` was clean, and clearing
`.next` + restarting gave a clean, error-free load. No code issue.

---

## Stage 3 — Pluggable motif system (make the "flowers" swappable)

**Today the flower is one hardcoded daisy** (`components/flower.tsx` generates ellipse petals
+ a circle core; `lib/flower-svg.ts` mirrors it for OG/icons). Color and petal-count vary; the
**shape does not**. This stage turns it into a registry Charlie can populate with 7–10 SVGs.

- **New `data/motifs.ts` registry** — a typed list of named motif designs. Each entry:
  - an **SVG** (viewBox `0 0 100 100`) authored as inline markup or a small render function;
  - declared **color slots** (1 or 2 — e.g. `fill`/`accent`) so any SVG tints cleanly via CSS
    vars / `currentColor`, whether or not it has "petal/core" structure;
  - an optional **`spin: false`** for designs that shouldn't rotate.
  - Ship the existing daisy as one default entry so nothing regresses on day one.
- **`components/motif.tsx`** (rename/generalize `Flower`) — renders a motif **by key**, keeps
  the deterministic **index-seeded wind-spin** (`--spin-dur`/`--spin-delay`, no `Math.random`),
  the color/tint props, and `aria-hidden`. Old `<Flower>` becomes a thin alias or is replaced
  at all call sites.
- **`activeMotifs` selection** — a small list of which registry keys are "in rotation." Render
  sites pick deterministically by index so fields stay varied + desynced (same discipline as
  today's flower field). One switch changes the whole site's motif set.
- **Wire every render site** to the registry: `hero`, `finale`, `personal-bento`, `work`,
  `web-projects` placeholders, and **`lib/flower-svg.ts`** (so the generated OG card + favicon
  use the active motif too).
- **CUSTOMIZE workflow (documented in `data/motifs.ts` + `MANUAL-TODO.md`):** paste an SVG into
  the registry, add its key to `activeMotifs`, done — no component edits.
- **DECISION → Charlie:** supply the 7–10 SVGs now, or ship with the daisy **+ a few starter
  shapes I author** (simple geometric blooms/stars/etc.) as placeholders he swaps later?
  _Draft assumes: build the system + a small starter set, Charlie swaps in his own SVGs via
  `MANUAL-TODO.md`._
- Keep it SSR-safe (no hydration drift) and reduced-motion-safe.

# Stage 3 Report

The single hardcoded daisy is now a pluggable registry. **DECISION → Charlie:** he ran
"finish stage 3" without supplying SVGs, so I took the documented draft default — **built
the system + authored a 7-shape starter set**; Charlie swaps in his own via the paste-an-SVG
workflow (`data/motifs.ts` header + `MANUAL-TODO.md §7`).

- [x] **`data/motifs.ts` (new)** — the registry. Each `Motif` has `key`, `label`, `slots` (1
  or 2 color slots), optional `spin`, and a pure **`render({fill, accent}) => string`** that
  returns the inner markup of a `0 0 100 100` SVG. Because it's a plain string, the *identical*
  shape+tint feeds both the DOM component and Satori (OG/icons) — one definition, no drift.
  Starter set: **daisy** (the original, shipped first so nothing regresses), **bloom5, aster,
  clover, burst, star5** (1-slot), **ring** (`spin:false`, rotationally symmetric). Plus the
  `NAMED` palette + `resolveColor`, `getMotif`, `motifForIndex`, `renderMotif`, `motifSvg`,
  `motifDataUri`, and **`activeMotifs`** (the in-rotation key list; `[0]` is the favicon mark,
  first 3 seed the OG card). Deterministic geometry only — no `Math.random`, SSR-safe.
- [x] **`components/motif.tsx` (new, generalizes `Flower`)** — renders a motif by `motif` key,
  or **auto-picks from `activeMotifs` by `index`** when the key is omitted (so a field varies and
  one `activeMotifs` edit re-skins the whole site). Keeps the deterministic index-seeded wind-spin
  (`--spin-dur`/`--spin-delay`, Knuth hash), resolves named/hex colors, is `aria-hidden`, and adds
  `.no-spin` for `spin:false` motifs. Inner SVG via `dangerouslySetInnerHTML` from the registry
  string (deterministic → no hydration mismatch).
- [x] **`app/globals.css`** — renamed the `.flower*` hooks to `.motif*` (base + `.motif svg` +
  the reduced-motion rule + the 5 context sizers `.hero .bloom`, `.ptile`, `.tile`,
  `.grid-flowers`, `.proj-placeholder`), added `.motif.no-spin { animation: none }`, and refreshed
  the motion-primitives comment. `@keyframes windspin` unchanged; reduced-motion still disables all
  spin.
- [x] **Wired every render site to the registry** (all now `<Motif fill accent index>`, shape
  auto-rotates by index): `components/hero.tsx` (2 blooms), `components/finale.tsx` (40-mark field —
  dropped the now-unused per-flower `petals`), `components/personal-bento.tsx` (2 accent tiles),
  `components/work.tsx` (`Stack` renamed props `petal/core → fill/accent`, 4 bands), and
  `app/web-projects/page.tsx` (imageless-project placeholders).
- [x] **OG + favicons wired** — `app/opengraph-image.tsx` (3 marks = first 3 `activeMotifs`),
  `app/icon.tsx` + `app/apple-icon.tsx` (`activeMotifs[0]`), all via `motifDataUri` from the
  registry. Changing `activeMotifs` now re-skins the share card + favicon too.
- [x] **Deleted `components/flower.tsx` + `lib/flower-svg.ts`** — the registry (plain TS, no React)
  is the single source; the OG/icon routes import `motifDataUri` from it directly, so the mirror lib
  is gone. No remaining `Flower`/`flower-svg` imports (only docs/mockup mention the old name).
- [x] **CUSTOMIZE workflow documented** — top of `data/motifs.ts` (add entry → add key to
  `activeMotifs`, done) and `MANUAL-TODO.md §7` (with a paste-an-SVG offer + a status table).

**Data flow:** motif *shape* now comes from `data/motifs.ts` (`activeMotifs`, indexed per render
site); *colors* still come from each call site (finale's PET/COR arrays, the fixed brand pairs in
hero/work/bento/OG). One edit to `activeMotifs` propagates to hero, finale, bento, work,
web-projects, OG card, and favicon.

**Verify:** `tsc` / `eslint` / `build` all clean (18 routes prerender; OG/icon routes build).
Rendered `/` and `/web-projects` at 1440 + fetched the generated `/opengraph-image` and
`/apple-icon`. Confirmed: the finale field cycles all 7 starter shapes in `activeMotifs` order,
each palette-tinted; hero blooms are bloom5 + clover; the Ostiara placeholder is the daisy; the OG
card shows daisy+bloom+clover and the favicon is the daisy — proving the Satori path renders the
same registry SVGs. **No console/hydration errors** on fresh load (SSR-safe). Reduced-motion still
disables the spin (renamed rule intact); `ring` is static via `no-spin`.

**Issues:** None in shipped code. `DESIGN-BRIEF.md` still describes the old `components/flower.tsx`
/ `lib/flower-svg.ts` as architecture prose — left as-is (historical north-star doc; Stage 5/6
consistency pass can refresh it if wanted). Same Turbopack stale-`.next` dev flakiness after the
multi-file edit — cleared `.next`, restarted, clean 200 with no errors.

---

## Stage 4 — Homepage rework: two-scroll, breathing room, the bento + timeline

The heart of V6. The "A little more personal" bento and the career-journey timeline are
cramped and, per Charlie, **unviewable**. Re-lay the homepage so it breathes.

- **Rename the section** ("A little more personal" — Charlie finds it awkward/suggestive).
  - **DECISION → Charlie:** options — **"Beyond the code"** *(recommended)*, "Off the screen",
    "The other stuff", "More than code", "Life outside the repo". _Draft assumes "Beyond the code."_
- **Career journey (`components/personal-bento.tsx` `.cj*` CSS)** — replace the fixed-pixel,
  absolutely-positioned timeline (the `AXIS_BOTTOM` / `roleTop` math) with a **readable, spacious
  vertical timeline**: real vertical rhythm, larger type, comfortable tap targets, honest year
  axis. It should be legible at 375 without overlap.
- **Spread the bento across ~two viewports** — fewer, bigger cards per row; generous whitespace;
  motif accents between blocks; let sections breathe instead of packing one screen. "More
  flowers, more whitespace, more fun" (Charlie). Same data, calmer layout.
- Keep it **data-driven** (experience, writing, photos, design projects) — this is a re-layout,
  not new content.
- **Guardrails:** no horizontal overflow at any width; **axe stays 0**; reduced-motion honored on
  the new reveals/motifs; the real-photo bento tiles + "Right now" photo card (V5 Stage 2) survive
  the rework.

# Stage 4 Report

The homepage's "personal" section is re-laid to breathe across ~two screens. **DECISION →
Charlie:** section name → **"More than code"** (his pick; noted "may change later" — it's a
`// CUSTOMIZE` heading, one-line swap).

- [x] **Section renamed** (`components/personal-bento.tsx`) — `#personal` `<h2>` is now "More
  than code" (was "A little more personal"), subline unchanged. `className="mtc"` added.
- [x] **Career timeline rebuilt — no more fixed-pixel absolute positioning.** Deleted the
  `startYears`/`maxYear`/`minYear`/`AXIS_BOTTOM`/`axisYears`/`yearTop`/`BIG_H`/`roleTop` math and
  the `.cj-timeline`(308px)/`.cj-year`/`.cj-line`/`.cj-band`/`.role*` absolute CSS. Replaced with a
  flowing `<ol class="tl">`: a **chip rail** (`.tl-chip` from `role.logoBg/logoFg/logo`) with a
  CSS connector line (`.tl-rail::after`, skipped on the last row), and a content column with the
  **dates** (`.tl-when`), **role · org** (larger serif `.tl-role`), a **3-line-clamped
  description**, and **tag chips** (`.tl-tags`, first 4). Legible at 375 with no overlap. Honest
  axis = the per-role date ranges, newest-first.
- [x] **Bento re-laid to two big cards per row** (`.mtc-cards`, `repeat(2, minmax(0,1fr))` →
  `minmax(0,1fr)` stacked ≤880). The cramped 4×2 grid + per-card `grid-column/row` placement is
  gone; cards auto-flow. **Type scale ~doubled** (kickers 8.5→11px, h3 14→clamp 18–22, body
  10.5→14, go 8.5→12), `.pcard` padding/radius up (14px→clamp 20–30 / 16→22px), `min-height:300px`.
  Cards: **Photography** (now a 2×2 of larger real photos), **Graphic design** (3-up real thumbs),
  **Writing** (merges the old `p-writing` + `p-blog`: 2 featured essays w/ thumbs + a "more essays"
  list), **Playground** (blurb + the repurposed accent motifs `.p-play-art`).
- [x] **More motif accents** — a centered `.mtc-accents` strip (3 `<Motif>`) divides the timeline
  from the cards, and the two decorative flowers now live inside the Playground card. All via the
  Stage-3 registry (auto-rotated shapes: aster/star in Playground, ring/daisy/bloom in the strip).
- [x] **Same data, calmer layout** — still driven by `data/experience` (timeline),
  `data/writing` (essays), `data/photos` (BENTO_PHOTOS — the V5 real-photo tiles **survive**),
  `data/projects-design` (GRAPHIC_THUMBS). No new content; a re-layout.
- [x] **`app/globals.css`** — rewrote the `PERSONAL / EXPLORE BENTO` block (`.mtc-accents`,
  `.mtc-cards`, bigger `.pcard`/`.kick`/`.pgrid`/`.wlist`/`.blist`, `.p-play-art`, the new `.cj` +
  `.tl*` timeline) and the ≤880 responsive rules (dropped the dead `.pbento`/`.p-career`/`.p-blog`/
  `.p-tiles` rules → `.mtc-cards { grid-template-columns: minmax(0,1fr) }`).

**Guardrails:** **axe = 0 violations** at 1440 **and** 375. **No horizontal overflow** at 375
(`scrollWidth == innerWidth == 375`) — caught + fixed a regression where the mobile `1fr` track's
`auto` min let the pgrid images push a card to 587px; fixed with `minmax(0,1fr)` + `.pcard {
min-width:0 }`. Reduced-motion honored (new motifs/reveals inherit the existing guards). **No
console errors** scrolling the full page. Real-photo bento tiles + the "Right now" photo card (a
separate section, untouched) both survive.

**Verify:** `tsc` / `eslint` / `build` all clean (18 routes prerender). Rendered `/` at **1440,
768, 375**: the timeline is spacious + legible (chip rail, dates, roles, tags), the four cards are
big and breathe, the section now spans ~two viewports.

**Issues:** None outstanding. Same Turbopack stale-`.next` dev flakiness on the multi-file edit —
cleared `.next`, restarted, clean. The one real bug (375 overflow) was found via a DOM width sweep
and fixed before sign-off.

---

## Stage 5 — General UI clean pass (the minor details)

A section-by-section detail sweep now that the big moves have landed.

- **Sweep every section at 1440 / 768 / 375** (spot-check 320 + 1920): spacing rhythm, type
  scale, alignment, gaps, tap-target sizes, awkward wraps, cramped mobile states. Sections:
  hero, digital-home carousel, right-now strip, the reworked bento + timeline, work bands,
  services fan, about collage, contact card, finale — plus the inner pages (writing, photography,
  web-projects, design, gear).
- **Digital-home carousel** — decide the placeholder browser-window shots vs real screenshots
  (ties to `MANUAL-TODO.md §1`; the white-on-orange caption contrast noted in V5 Stage 3 gets
  resolved when real shots or a scrim land).
- **Consistency** — motif usage, whitespace rhythm, and type scale read as one system across
  home + inner pages. No orphaned V5 artifacts (e.g. the old wordmark spacing).
- Re-confirm **axe 0**, no horizontal overflow, no console errors on every route/width.

# Stage 5 Report
_TBD._

---

## Stage 6 — Verify + consistency (visual sign-off, feature-complete ahead of V7)

The V6 gate. No deploy here — that's `UPDATELOGV7.md`.

- `tsc` / `eslint` / `build` all clean; every route still prerenders (static/SSG).
- **Render + eyeball** every route at 1440 / 768 / 375 (+ a short viewport for the finale):
  **axe 0 violations**, no horizontal overflow, no console errors.
- Spot-check the V6 moves end-to-end:
  - **Motif system** — changing `activeMotifs` swaps the whole site's motifs **and** the
    generated OG card + favicon; SSR-safe, reduced-motion-safe.
  - **Finale** fills the screen at multiple viewport heights, nothing below it.
  - **Header** = nav only (script wordmark gone); **footer** reads "Looking to reach me? /
    Get in touch"; no footer under the homepage finale.
  - **Reworked bento + timeline** are legible on mobile; the V5 real-photo tiles + "Right now"
    photo card survive the re-layout.
- Confirm the site is **visually done and internally consistent**, feature-complete ahead of the
  **V7 Cloudflare deploy**. List anything deliberately left.

# Stage 6 Report
_TBD._
