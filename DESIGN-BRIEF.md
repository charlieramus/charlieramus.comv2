# DESIGN BRIEF — charlieramus.comv2

**Read this first.** Every `UPDATELOGVN.md` assumes it. Each build stage runs in its
own fresh session, so this is the shared context.

---

## What we're building

A personal site for **Charlie Ramus** (see `ABOUT-CHARLIE.md`) — a clean, correct
rebuild of the design in **`mockups/hellodani-mockup.html`**. The mockup's layout
+ CSS **are the design system**; we reproduce it faithfully, then fill it with
Charlie's real content and voice.

This is a **from-scratch rebuild** of an earlier attempt (`/v3` in the old
`CharlieRamus.com` repo). That attempt got the *design* right but the *execution*
wrong — it lived as a scoped ~1200-line CSS dump inside an awkward setup. Here we
do it properly: **standard Next.js 16 + Tailwind v4**, design tokens as first-class
theme values, real components, real content model. When finished, this **fully
replaces charlieramus.com**.

- **DO** reproduce the mockup's palette, fonts, section layout, and motion.
- **DO** express the design system as Tailwind v4 `@theme` tokens + small component
  classes — not one giant stylesheet.
- **DON'T** invent a fake résumé. Derive real facts from `ABOUT-CHARLIE.md` and the
  `data/` files (career range is 2025–2026, not the mockup's fake axis).

---

## Architecture

```
app/
  layout.tsx      ← root layout: load the 3 fonts via next/font/google, set
                    <html>/<body> base. Replace the Geist scaffold fonts.
  globals.css     ← Tailwind v4 entry. @import "tailwindcss" + @theme with the
                    mockup's palette/fonts/radii. Component-level CSS (flower
                    windspin keyframes, reveal) lives here too.
  page.tsx        ← homepage: assembles the section components in order.
  (inner routes)  ← /photography, /writing/[slug], /blog, /design, /gear,
                    /web-projects (V4).
components/       ← one component per mockup section + shared primitives
                    (flower.tsx, reveal.tsx).
data/             ← typed content (see Data map). // CUSTOMIZE markers.
content/          ← MDX (writing/blog).
mockups/          ← hellodani-mockup.html (source of truth). Reference only.
```

## Design tokens (from the mockup → `app/globals.css @theme`)

Palette:
```
--paper #f4f3ee   --panel #e4e3dd   --ink #14140f   --ink-soft #55554d
--red #f32317     --blue #0015d4    --yellow #ffcb41 --pink #ff8fca
--cyan #84def9    --line #cfcdc2
```
Named flower petal palette (used by `<Flower>`):
`red #F32317 · blue #0015D4 · yellow #FFCB41 · pink #FF8FCA · cyan #84DEF9`.

Fonts (next/font/google, exposed as CSS vars → mapped in `@theme`):
- **Libre Baskerville** — serif (headings/quotes), `--font-serif`
- **Inter** — sans (body/UI), `--font-sans`
- **Caveat** — script (accent/signature), `--font-script`

Scale: the mockup uses `clamp()` + `vw` units to hold proportions — keep them.
`--edge: clamp(20px, 6vw, 90px)` page gutter; content max-width ~1200px.

## Sections (homepage, top-to-bottom — the order Charlie chose)

hero (+ nav) → "Step into my digital home" carousel → **personal/explore bento**
→ "Tiny fraction of my work" bands → "I've got your back with…" services →
"Behind the pixels" about collage → red "Get in touch" contact card → full-bleed
flower-grid finale + quote + legal line.

## Motion (two shared primitives)

**`components/flower.tsx`** — renders the mockup's daisy SVG
(`flowerSVG(petal, core, n)`), used in hero blooms, tiles, and the finale grid.

**Flower wind-spin** — full 360° gust (slow build → fast middle → ease out → rest →
loop), **varied per flower** so the field never syncs. Derive `--spin-dur`
(~6–11s) and `--spin-delay` **deterministically from the flower's index** (small
hash), NOT `Math.random()` at render (SSR/hydration mismatch).
```css
@keyframes windspin {
  0%   { transform: rotate(0deg); }
  18%  { transform: rotate(24deg); }
  55%  { transform: rotate(300deg); }
  82%  { transform: rotate(360deg); }
  100% { transform: rotate(360deg); }
}
```
Under `prefers-reduced-motion: reduce`, disable the spin.

**`components/reveal.tsx`** — client wrapper adding an `.in` class on scroll-into-
view (IntersectionObserver) for the fade-up. Reduced motion → show immediately.

## Data map (`data/` + `content/`)

Seeded this session from the old repo as raw material; refined in V2.

| Content | File | Notes |
|---|---|---|
| Bio / voice | `data/about.ts` | Machine-readable half of `ABOUT-CHARLIE.md`. |
| Experience | `data/experience.ts` | `Experience` type; newest-first; 2025–26. |
| Web projects | `data/projects-web.ts` | Charlie's shipped apps/sites. |
| Design work | `data/projects-design.ts` | Notion pitch, Spotify IMC, Photography UI. |
| Gear | `data/gear.ts` | Camera kit (bodies/lenses/bags/accessories). |
| Socials | `data/socials.ts` | LinkedIn, GitHub, 2× Instagram, Letterboxd. |
| Photos | `data/photos.ts` | Gallery; author via a sync step (V4). |
| Writing | `content/writing/*.mdx` | Essays; route `/writing/[slug]`. |

## Constraints & gotchas
- **No dev server / browser automation** — crashes this machine. Verify with
  `npm run build`, `npx tsc --noEmit`, `npx eslint .`; view via Vercel branch
  preview.
- **Tailwind v4 = CSS-first** (`@theme` in globals.css; no config file).
- Read `node_modules/next/dist/docs/` before Next code. Heed deprecations.
- All motion respects `prefers-reduced-motion`.
- Don't commit/push unless Charlie asks.

## Working style
Each `UPDATELOGVN.md` has numbered stages. Per stage: implement, then fill its
`# Stage N Report` with `- [x]` bullets (files, classes, data flow) + an `Issues:`
line. See `ROADMAP.md` for the V1–V5 arc.
