# UPDATELOG V1 — FOUNDATION & DESIGN SYSTEM (design-first)

**First read `DESIGN-BRIEF.md`** (+ `AGENTS.md`). Goal of V1: turn
`mockups/hellodani-mockup.html` into a **pixel-right static homepage** in the clean
stack, and lock the design system + motion primitives. Content is placeholder here
(the mockup's own copy is fine) — real content is V2/V3. This stage is where the
"execution" that was wrong last time gets done right.

Verify everything with `npm run build` + `npx tsc --noEmit` + `npx eslint .`.
View locally via `npm run dev` and/or a Vercel branch preview.

---

## Stage 1 — Theme tokens + fonts

- In `app/globals.css`: keep `@import "tailwindcss"`; replace the scaffold's
  background/foreground vars with the mockup's palette in an `@theme` block
  (`--color-paper`, `--color-ink`, `--color-red`, … per `DESIGN-BRIEF.md`), so
  Tailwind utilities like `bg-paper text-ink` exist.
- In `app/layout.tsx`: swap the Geist fonts for **Libre Baskerville**, **Inter**,
  **Caveat** via `next/font/google`, exposed as `--font-serif/-sans/-script`; map
  them in `@theme` (`--font-serif`, etc.). Read
  `node_modules/next/dist/docs/.../fonts.md` first.
- Set `<body>` base bg/color/font to the paper/ink/Inter defaults.

# Stage 1 Report

- [x] `app/globals.css` — replaced the scaffold's `--background`/`--foreground`
  vars with the mockup's palette in an `@theme` block: `--color-paper`,
  `--color-panel`, `--color-ink`, `--color-ink-soft`, `--color-red`,
  `--color-blue`, `--color-yellow`, `--color-pink`, `--color-cyan`,
  `--color-line`. These generate `bg-*`/`text-*`/`border-*` utilities and are
  also exposed as `var(--color-*)` for the component CSS coming in Stages 2–3.
- [x] `app/globals.css` — fonts mapped in a separate `@theme inline` block:
  `--font-serif`, `--font-sans`, `--font-script` each reference the runtime
  variable next/font sets on `<html>` (see below). `inline` is required so the
  utilities emit the runtime var instead of resolving at build time.
- [x] `app/globals.css` — base rules ported from the mockup's `<body>`:
  `background: var(--color-paper)`, `color: var(--color-ink)`,
  `font-family: var(--font-sans)`, `16px`/`1.6`, `-webkit-font-smoothing`,
  `overflow-x: hidden`, plus `html { scroll-behavior: smooth }` and the
  `a { color: inherit; text-decoration: none }` reset.
- [x] `app/layout.tsx` — swapped Geist for **Libre Baskerville** (serif, weights
  400/700 — non-variable so enumerated), **Inter** (sans, variable), **Caveat**
  (script, variable) via `next/font/google`, each with `display: "swap"`.
  Exposed as `--font-libre-baskerville` / `--font-inter` / `--font-caveat` on
  `<html>` (distinct names from the `@theme` tokens to avoid a self-referential
  `var()` collision); the `@theme inline` block aliases them to
  `--font-serif`/`--font-sans`/`--font-script`. Metadata updated to Charlie's
  site.
- [x] `app/page.tsx` — scaffold placeholder rewritten to a minimal token demo
  (used `bg-foreground`/`text-background`, which no longer exist and would fail
  the Tailwind v4 build). Real homepage is Stage 3.
- [x] Verified: `npx tsc --noEmit` clean, `npx eslint .` clean, `npm run build`
  succeeds (fonts self-hosted at build time, `/` prerendered static).

Issues: Libre Baskerville has no 700-italic, and the mockup's CSS never actually
renders italic (only its Google Fonts `<link>` requested `ital,400`), so italic
is omitted — add `style: ["normal","italic"]` at weight 400 only if Stage 3 copy
needs it. Build prints a pre-existing workspace-root warning from a stray
`C:\Users\jason\package-lock.json` (unrelated to this change); silence later via
`turbopack.root` in `next.config.ts` if desired.

---

## Stage 2 — Motion primitives (`Flower`, `Reveal`)

- `components/flower.tsx` — port the mockup's `flowerSVG(petal, core, n)` to a
  server component rendering the daisy SVG. Props: `petal`, `core`, `petals`,
  `index`, `className`. Wind-spin via CSS (`windspin` keyframes in globals.css);
  per-flower `--spin-dur` (~6–11s) + `--spin-delay` derived **deterministically
  from `index`** (small hash — no `Math.random()` at render). `aria-hidden`.
- `components/reveal.tsx` — `"use client"` wrapper adding `.in` on scroll-into-view
  (IntersectionObserver). Polymorphic `as` prop so classes land on the right node.
  Reduced motion handled in CSS (force visible).
- globals.css: `windspin` keyframes + `.flower` animation + `.reveal`/`.reveal.in`
  fade-up, all gated by `@media (prefers-reduced-motion: reduce)`.

# Stage 2 Report

- [x] `components/flower.tsx` — server component porting the mockup's
  `flowerSVG(petal, core, n)`. Renders `<n>` `<ellipse>` petals (same
  `rx = 12 + (i%2?1.2:-0.8)`, `ry = 19 + (i%3?0:1.2)`, `rotate((360/n)*i)`
  geometry) + center `<circle>`. Props: `petal` (NAMED key like `red`/`blue` **or**
  raw hex), `core`, `petals`, `index`, `className`. `aria-hidden="true"` (purely
  decorative). Per-flower `--spin-dur` (~6–11s) and `--spin-delay` (negative, to
  desync) are derived **deterministically from `index`** via a Knuth
  multiplicative hash — no `Math.random()`, so SSR and client markup match (no
  hydration drift). Timing is emitted as inline CSS custom properties.
- [x] `components/reveal.tsx` — `"use client"` polymorphic wrapper. Generic
  `as` prop (default `div`) with `ComponentPropsWithoutRef<T>` passthrough so
  `.reveal` lands on the caller's chosen node and native attrs still type-check.
  On mount an `IntersectionObserver` (threshold `.12`) adds `.in` once then
  `unobserve`s; cleanup `disconnect`s. Reduced motion is double-guarded — CSS
  shows the node regardless, and the effect also short-circuits via
  `matchMedia` so it never hides content when JS is slow/absent.
- [x] `app/globals.css` — added a "Motion primitives" block: `.flower`
  (`animation: windspin var(--spin-dur,8s) ease-in-out var(--spin-delay,0s)
  infinite`) + `.flower svg` sizing; the `@keyframes windspin` gust from
  `DESIGN-BRIEF.md` (0→24°→300°→360°→rest); `.reveal` / `.reveal.in` fade-up
  (opacity + `translateY(26px)` → none). A single
  `@media (prefers-reduced-motion: reduce)` disables the spin and forces reveals
  visible.
- [x] `app/page.tsx` — placeholder now imports both primitives (via the `@/`
  alias) so the build exercises them: a `Reveal as="main"` wrapping a row of five
  `Flower`s (one per named petal), each with a distinct `index` + `petals` count.
- [x] Verified: `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean.

Issues: The mockup's own `.flower` had only a `transition: transform` (for a
hover lift) and **no** spin — windspin is net-new per the brief, so the base
`.flower` transition was dropped in favor of the continuous `animation` (they'd
both target `transform`). If any Stage 3 flower needs a hover-scale, wrap it in
an inner element rather than re-adding a `transform` transition on `.flower`
itself. Workspace-root lockfile warning persists (pre-existing, harmless).

---

## Stage 3 — Static homepage (pixel-right port)

- Build the mockup's sections as components under `components/` and assemble them in
  `app/page.tsx` in the final order (hero+nav → digital-home carousel → personal
  bento → work bands → services → about collage → contact → finale). Placeholder
  copy OK — match the mockup's structure, spacing, and type exactly.
- Use Tailwind utilities + small component classes; **no** giant scoped stylesheet.
  Where the mockup uses `clamp()`/`vw`, keep those (arbitrary values or CSS vars).
- Convert the mockup's inline `<script>` (flower generators, grid builder) to React
  — no inline `<script>` tags.
- Responsive: port the mockup's `@media` breakpoints; no horizontal overflow at
  1440 / 768 / 375.

# Stage 3 Report

- [x] `app/page.tsx` — assembles the eight section components in the final order
  (hero+nav → digital-home carousel → personal bento → work bands → services →
  about collage → contact → finale) + the `.legal-min` line. No inline
  `<script>` anywhere — every mockup generator became React.
- [x] `components/hero.tsx` — `<header class="hero">` with nav (works · studio ·
  garden), two `Flower` blooms, the 3-arc rainbow SVG, heading/lede/rule/btn.
  Blooms are positioning wrappers with a `<Flower>` child so the windspin
  `transform` doesn't fight the `translateY(-50%)` centering (globals.css
  `.hero .bloom .flower { width:100% }`).
- [x] `components/digital-home.tsx` — the "Step into my digital home" heading +
  horizontal `.carousel`; six `.shot`s driven by a typed `SHOTS[]` array.
- [x] `components/personal-bento.tsx` — the `.pbento` grid. Career-journey
  timeline built from `YEARS[]` (gridlines/labels) + a typed `ROLES[]` array
  (absolute-positioned `.role` cards, `.big` variant); photography/graphic
  halftone `.pgrid`s, `.wlist`/`.blist`, two accent `.ptile`s (each a container
  with a `<Flower>` child, sized 62% per the CSS), and the playground card.
- [x] `components/work.tsx` — "Tiny fraction of my work": four alternating
  `.band`/`.band.flip` rows + the `.touch` case-study bar. A local `Stack`
  helper renders the [colored flower tile + white tile] pair; the bespoke
  device cards (`.ui`, `.mini`, `.photo`) use inline style objects for their
  exact positions/rotations/gradients, verbatim from the mockup.
- [x] `components/services.tsx` — "I've got your back with…": the fanned card
  stack (`FAN_COLORS[]` → `left:i*44`, `rotate((i−n/2)*7)`, `z-index:i`) and the
  3-col `.svc-grid` from a `SERVICES[]` array.
- [x] `components/about.tsx` — "Behind the pixels": the four-photo `.collage`
  (p1–p4 rotations) + two-paragraph bio.
- [x] `components/contact.tsx` — red `.box` with the peace-hand SVG, "Think we
  vibe?" / "Get in touch", and the `.pills` link row from a `PILLS[]` array.
- [x] `components/finale.tsx` — full-bleed `.grid-flowers`: 40 `Flower`s built
  from the mockup's exact `PET`/`COR` index formula (deterministic, so
  server/client match), plus the centered serif quote.
- [x] `app/globals.css` — added `:root { --edge; --maxw }` and a `@layer
  components` block porting the mockup's section CSS 1:1 (nav, hero, carousel,
  bento + pcard/cj/role, work bands + panel/cards, services, about, contact,
  finale, legal) — all `var(--color-*)`/`var(--font-*)` tokenized, `clamp()`/`vw`
  preserved, plus the `@media (max-width: 1200px / 880px)` responsive rules. In
  `@layer components` so JSX utilities can still override per-instance.
- [x] Verified: `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean;
  `/` prerenders as static.
- [x] **Browser-verified** (dev server + gstack `/browse`, after the "no dev
  server" rule was lifted): homepage renders faithfully to the mockup at 1440
  and 375, zero console errors, `<body>` bg = `#f4f3ee`, 48 flower SVGs in the
  DOM. Screenshots in scratchpad (`home-revealed.png`, `home-mobile-fixed.png`).
- [x] Fixed two mobile bugs found only by actually rendering at 375 (both
  inherited from the mockup, both clipped-but-present): (a) the `.pbento` mobile
  reset omitted `.p-graphic`/`.p-play`, leaving them pinned to columns 3/4 and
  forcing the grid wider than the viewport — added them to the reset; (b)
  `.grid-flowers .flower` was a fixed `92px`, overflowing the 5-col mobile grid —
  changed to `min(92px, 100%)` + `aspect-ratio: 1` (desktop cells are wider, so
  pixel-identical there). No horizontal scroll at 375 now (`overflow-x: hidden`
  holds; `scrollX` stays 0). Remaining sub-viewport extent is decorative and
  clipped (services fan stack, `90vw` contact box) — faithful to the mockup.

Issues: (1) **CSS strategy** — pixel-fidelity required porting most of the
mockup's bespoke card CSS, so globals.css is sizable (~one @layer components
block). It's organized-by-section, fully tokenized, and paired with real
components + typed data arrays, so it's the design-system component layer rather
than the old scoped-dump-in-an-awkward-setup — but if we want it smaller, the
device-card/collage one-offs are the best candidates to move to per-section CSS
Modules later. (2) The mockup's finale `.flower:hover { rotate+scale }` was
dropped — windspin owns `transform` now (flowers spin continuously by design);
re-add on an inner element if a hover accent is wanted. (3) Copy is the mockup's
placeholder text (per Stage 3), with `// CUSTOMIZE` markers where Charlie's real
content/data lands in V2. (4) Rendered output was browser-verified via the dev
server + gstack `/browse` at 1440 and 375 (see the checklist above) — the "no
dev server/browser" rule was lifted, and running one does not crash this
machine. (5) Pre-existing workspace-root lockfile warning persists (harmless).

---

## Stage 4 — Verify + preview

- `npm run build`, `npx tsc --noEmit`, `npx eslint .` all clean.
- Push a branch → confirm the Vercel preview renders the homepage pixel-close to
  the mockup. Share the URL with Charlie.
- Note anything that differs from the mockup for follow-up.

# Stage 4 Report

- [x] Static checks clean: `npx tsc --noEmit`, `npx eslint .`, `npm run build`
  (`/` prerenders static; only the pre-existing workspace-root lockfile warning).
- [x] Responsive verified in a real headless browser (gstack `/browse`) at all
  three brief breakpoints — **1440**, **768**, **375** — with `overflow-x: hidden`
  holding: `window.scrollX` stays `0` after a scroll-right at every width, i.e.
  **no horizontal scroll anywhere**. Remaining sub-viewport extent is decorative
  and clipped (services `.fan` card stack, the `90vw` `.contact .box`), matching
  the mockup. Zero console errors; `<body>` bg `#f4f3ee`; 48 flower SVGs.
- [x] Branch pushed for a **Vercel preview** (does not touch the production
  branch): `v1-homepage-preview` → `origin`. The finished V1 homepage (incl. the
  Stage-3 browse fixes) was already on `origin/main`; this branch carries the
  same tree + this report so Vercel builds a preview deployment for it.
- [x] Preview URL: Vercel builds it on push and posts it to the branch's
  GitHub commit status / PR checks. I can't fetch it from here — the Vercel MCP
  connector needs interactive auth (unavailable in this session) and I can't
  reach an unknown external URL. Local `/browse` verification (above) is the
  visual confirmation in the meantime.

**Differences from the mockup (for follow-up):**
1. **Wind-spin on all flowers** — the mockup's flowers were static (only a
   finale hover-rotate). Per `DESIGN-BRIEF.md`, blooms/tiles/finale now spin
   (deterministic per-index timing). The mockup's finale `:hover` rotate+scale
   was dropped (windspin owns `transform`).
2. **Two mobile CSS deviations** (deliberate, to satisfy "no horizontal overflow
   at 375"): `.pbento` mobile reset now includes `.p-graphic`/`.p-play` (the
   mockup pinned them to cols 3/4 → overflow); `.grid-flowers .flower` is
   `min(92px,100%)`+`aspect-ratio:1` instead of a fixed `92px`. Desktop is
   pixel-identical.
3. **Structure-only:** hero blooms are a positioning wrapper + child `<Flower>`
   (so windspin's transform doesn't fight centering) — visually identical.
4. **Dropped mockup artifacts:** the `.ribbon` "MOCKUP" tag and the unused
   `footer` CSS block.
5. **Copy is still the mockup's placeholder** (per Stage 3), with `// CUSTOMIZE`
   markers; Charlie's real content + `data/*.ts` land in V2.

Issues: Cannot self-confirm the live Vercel URL from this session (see above) —
Charlie grabs it from the Vercel dashboard / GitHub checks on the pushed branch.
Note: the V1 code is already on `origin/main`, so if Vercel tracks `main` as
production it may deploy there too; use the branch preview to eyeball before
treating `main` as the real cutover.
