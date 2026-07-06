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
_TBD._

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
