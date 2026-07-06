# UPDATELOG V1 — FOUNDATION & DESIGN SYSTEM (design-first)

**First read `DESIGN-BRIEF.md`** (+ `AGENTS.md`). Goal of V1: turn
`mockups/hellodani-mockup.html` into a **pixel-right static homepage** in the clean
stack, and lock the design system + motion primitives. Content is placeholder here
(the mockup's own copy is fine) — real content is V2/V3. This stage is where the
"execution" that was wrong last time gets done right.

Verify everything with `npm run build` + `npx tsc --noEmit` + `npx eslint .`.
**No dev server / browser** (crashes this machine) — view via a Vercel branch
preview.

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
_TBD._

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
_TBD._

---

## Stage 4 — Verify + preview

- `npm run build`, `npx tsc --noEmit`, `npx eslint .` all clean.
- Push a branch → confirm the Vercel preview renders the homepage pixel-close to
  the mockup. Share the URL with Charlie.
- Note anything that differs from the mockup for follow-up.

# Stage 4 Report
_TBD._
