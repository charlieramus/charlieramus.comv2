charlie

# UPDATELOG V12 — CASE-STUDY PAGES 2/2: EDITORIAL BODY + FINISH
# Work on one stage at a time. Do NOT combine stages.

**First read `AGENTS.md`, `DESIGN-BRIEF.md`, `site.config.ts`, and the V11 stage reports.**
V11 rebuilt `/web-projects/[slug]` into a screenshot-forward shell and shipped the top of the
page — the full-width hero screenshot, the three cards (Overview facts / What I worked on /
The Challenge), and the flower-bulleted process timeline — all authored from `site.config.ts`.

**This is log 2 of 2 (V11 → V12).** V12 builds the **editorial body** below the process
timeline and finishes the page: the two side-by-side squares, the NYT-style article, the
second full-width screenshot, the full-bleed full-screen image, the customizable banner, and
the next-project nav — then a **hover-grow motion pass** across every screenshot and the full
sign-off.

**The section order (fixed, each optional) is unchanged from V11:** hero → 3 cards → process →
**2 squares → article → wide shot → full-bleed → banner → next project.** V11 shipped the first
three groups; V12 renders the rest into the placeholder slots V11 left in the page.

This log builds only the editorial-body sections + the motion/finish pass. It does **not**
change the schema (all fields were declared in V11 Stage 1), the routing, or the export
pipeline. Design-project pages stay gallery work, untouched.

## Decisions (agreed in the CEO-review brainstorm, 2026-07-14)
- **Squares** = `squares?: [string, string]` — exactly two square images side by side (the
  deliberate counterpoint to the full-width rectangles), stacking on mobile. Rounded, no caption.
- **Article** = `article?: { paragraphs: string[]; pullQuote?: string }` — NYT-clean: serif,
  generous measure, a **serif drop-cap on the first paragraph**, and an **optional large
  pull-quote** dropped between paragraphs. Opt-in per project; stays quiet.
- **Wide shot** (`wideShot`) and **full-bleed** (`fullBleed`) are two distinct visual beats: the
  wide shot is a second full-content-width rounded rectangle; the full-bleed runs **edge to edge**
  across the whole viewport (the one section that breaks the content gutter).
- **Banner** = `banner?: { image?: string; text?: string }` — a customizable band: optional
  background image + optional overlaid text, both `// CUSTOMIZE`. Rounded unless it's a full-bleed
  band (implementer's call, kept consistent with the site).
- **Next project** = derived from `webProjects` array order (wraps last → first) — **no config
  field**. A quiet "Next project → {title}" link/band at the foot of every case study.
- **Hover-grow, not a lightbox.** Every screenshot (hero, squares, wide, full-bleed) scales up
  a touch on hover (~1.02, eased), clipped inside its rounded frame. **No click-to-enlarge** —
  Charlie declined the lightbox. The grow is disabled under `prefers-reduced-motion`.
- **No image captions** (clean rule). Every image frame rounded (except the full-bleed by design).
  Config-driven; `data/projects-web.ts` stays a thin re-export.
- **Medium feature, five stages:** squares → article → wide + full-bleed → banner + next-project
  → hover-grow motion + Ostiara reference authoring + full sign-off (the gate).

## Hard constraints (carry over from V7–V11)
- **Additive / re-skin, non-regressive.** Only the `/web-projects/[slug]` detail body changes
  (plus the `/web-projects` list page gains nothing here — next-project nav lives on the detail
  page). Schema is frozen from V11; do not re-add retired fields.
- **Every section conditional.** Render a section **only** if its field is present and non-empty.
  Next-project nav renders whenever there is more than one project (it always resolves a target).
- **Config is the surface.** All copy + images edited from `site.config.ts` behind `// CUSTOMIZE`.
- **Motion respects `prefers-reduced-motion`.** The hover-grow is removed for reduced-motion users.
- **Full-bleed must not cause horizontal scroll.** The edge-to-edge image uses a safe full-bleed
  technique (e.g. `100vw` centered) that never exceeds the viewport width at any breakpoint.
- Verify each stage with `tsc --noEmit` + `eslint .` + `next build` (export). No horizontal
  scroll at 1440 / 768 / 375, no console errors. Don't commit/push unless Charlie asks
  (`/complete-updatelog` handles the `stage<N>v12` commits when run).

---

## Stage 1 — Two squares, side by side

The paired square images that follow the process timeline — the deliberate change of rhythm
after the full-width hero.

```
1. In app/web-projects/[slug]/page.tsx, in the slot after the process section, render a
   `.case-squares` section if `project.squares` is set (a 2-tuple of /public paths). Render the
   two images as equal square frames side by side (next/image, fill, sizes), rounded, no caption,
   wrapped in Reveal. Under the site's mobile breakpoint they stack to one column.
2. Add `.case-squares` CSS to app/globals.css: a 2-column grid (1fr 1fr, minmax(0,1fr) so no
   overflow), square aspect frames, the site's radius, consistent gap with the rest of the page.
   Existing @theme tokens only; no new deps.
3. Author a real `squares` on the Ostiara project using two existing/placeholder /public shots
   so the section renders in review (if no true square assets exist yet, note it and use the two
   existing /images/web/*.webp cropped to square via object-fit: cover — do NOT fabricate files).

Verify: tsc --noEmit; eslint; next build (export) green. Ostiara shows two side-by-side squares
that stack on mobile; a project without `squares` shows no section. No horizontal scroll at 375;
frames stay square and uncropped-awkward via object-fit.
```

## Stage 1 Report

- [x] **`app/web-projects/[slug]/page.tsx` — rendered the `.case-squares` section** in the
  slot right after the process timeline, gated on `project.squares`. It maps the 2-tuple to two
  equal `.case-square` frames, each a `next/image` (`fill` + `sizes="(max-width: 880px) 100vw,
  600px"`), no caption, the whole row wrapped in `Reveal as="section"`. Reused the existing
  `Image` import (already in the file for the hero). Keyed `${src}-${i}`.
- [x] **CSS (`app/globals.css`, `@layer components`):** added `.case-squares` (a
  `grid-template-columns: repeat(2, minmax(0, 1fr))` — the `minmax(0,1fr)` guards against
  track overflow — with the site's clamp gap and the same `margin-top` rhythm as
  `.case-process`), `.case-square` (`aspect-ratio: 1/1`, 16px radius, `overflow: hidden`,
  panel surface + line border to match the hero frame), and `.case-square-img`
  (`object-fit: cover`). Added `.case-squares { grid-template-columns: 1fr }` to the existing
  `@media (max-width: 880px)` block so it stacks on the same breakpoint the cards use.
  Existing `@theme` tokens only; no new deps.
- [x] **Authored a real `squares` on Ostiara** in `site.config.ts`. **Placeholder note:** no
  true square Ostiara screenshots exist in `/public` (only two `/images/web/*.webp` shots
  exist at all), so per the stage's explicit instruction I used the two existing web shots
  (`mylifeinarepo.webp`, `charlieramus-com.webp`) cropped to square via `object-fit: cover` —
  **no files fabricated** — and flagged it in a `// CUSTOMIZE` comment for Charlie to swap for
  real square assets. Other projects stay unset.

**Verify:** `npx tsc --noEmit` clean; `npm run lint` (the repo's bare-`eslint` flat-config
script — `eslint .` errors under this flat config, so `npm run lint` is the correct
invocation) clean; `next build` (export) green — all 24 routes prerender, all six
`/web-projects/<slug>` included. In the built HTML, `out/web-projects/ostiara.html` contains
the `case-square` markup (two frames); `out/web-projects/querryn.html` has zero — a project
without `squares` shows no section. Frames are square via `aspect-ratio: 1/1` + `object-fit:
cover` (no awkward crop); the `minmax(0,1fr)` tracks and `body { overflow-x: hidden }` keep
375 free of horizontal scroll (live sweep is the Stage 5 gate).

Issues: Ostiara's squares are placeholder crops of the two existing web screenshots (no real
square assets yet) — noted in the config comment and to be logged in MANUAL-TODO at Stage 5.

---

## Stage 2 — The article (NYT-clean, drop-cap + optional pull-quote)

The editorial reading beat: clean serif paragraphs with a drop-cap and an optional pull-quote.

```
1. Render a `.case-article` section if `project.article?.paragraphs?.length`. Lay the paragraphs
   in a single centered reading column (narrower than the full content width — editorial measure,
   ~62–68ch). Serif body (--font-serif), generous line-height. Wrap in Reveal.
2. Drop-cap: style the FIRST paragraph's first letter as a serif drop-cap (CSS ::first-letter on
   `.case-article > p:first-of-type`) — sized to ~3 lines, aligned to the text, in body ink. Keep
   it tasteful, not decorative-slop.
3. Pull-quote: if `project.article.pullQuote` is set, render it as a large serif aside between
   paragraphs (e.g. after the first paragraph, or centered mid-column) — bigger type, quiet rule
   or generous whitespace, NOT a colored callout box. `aria`-appropriate (it's a blockquote).
4. Add `.case-article` CSS to app/globals.css on existing tokens: the reading column, the
   ::first-letter drop-cap, the pull-quote treatment. No gradients, no AI slop, no new deps.
5. Author a real `article` on the Ostiara project (2–4 paragraphs + one pullQuote) so it renders
   in review. Other projects stay unset.

Verify: tsc --noEmit; eslint; next build (export) green. Ostiara shows a clean serif article with
a drop-cap and the pull-quote; a project without `article` shows no section; a project with
paragraphs but no pullQuote shows the article and no quote. Reading column stays legible and
centered at 1440 / 768 / 375; no horizontal scroll.
```

## Stage 2 Report

- [x] **`app/web-projects/[slug]/page.tsx` — rendered the `.case-article` section** in the
  slot after the squares, gated on `project.article?.paragraphs?.length`. Each paragraph is a
  direct `<p>` child of the section (so the CSS `::first-letter` drop-cap targets the true
  first paragraph); the paragraphs are mapped inside a `Fragment` so the optional pull-quote
  can be injected **after the first paragraph** without wrapping the `<p>`s in an extra element
  that would break `p:first-of-type`. Wrapped in `Reveal as="section"`. Added the
  `import { Fragment } from "react"`.
- [x] **Pull-quote** — rendered as a real `<blockquote className="case-pullquote">` (correct
  semantics, no `aria` hacks needed) only when `article.pullQuote` is set, dropped in right
  after the first paragraph. A project with paragraphs but no `pullQuote` renders the article
  and no quote.
- [x] **CSS (`app/globals.css`):** added `.case-article` — a centered reading column
  (`max-width: 66ch; margin-inline: auto`, narrower than the `--maxw` content width for an
  editorial measure), `--font-serif`, `line-height: 1.85`, clamp body size; `.case-article > p`
  bottom-margin rhythm (last `<p>` zeroed); the drop-cap via
  `.case-article > p:first-of-type::first-letter` (`float: left`, `3.4em`, `line-height: 0.78`
  ≈ 3 lines, body ink, tasteful not decorative); and `.case-pullquote` — a large italic serif
  aside with quiet hairline rules top+bottom (`--color-line`) and generous whitespace,
  centered, **not** a colored callout box. Existing tokens only, no new deps.
- [x] **Authored a real `article` on Ostiara** in `site.config.ts`: 3 paragraphs + one
  `pullQuote`, drawn entirely from the existing description / challenge / about copy (the
  solo end-to-end build, the customer-discovery split between fixed-price-menu and
  measure-on-site quoting, what that split owes each group) — **no new facts invented**. Other
  projects stay unset.

**Verify:** `npx tsc --noEmit` clean; `npm run lint` clean; `next build` (export) green — all
24 routes. In the built HTML, `out/web-projects/ostiara.html` contains `.case-article`, the
`.case-pullquote` blockquote, and the article body ("Ostiara started as a platform…" through
the doorstep pull-quote); `out/web-projects/querryn.html` has no `.case-article` — a project
without `article` shows no section. The reading column is centered at `66ch` and the
`overflow-x: hidden` body + `margin-inline: auto` keep 375 free of horizontal scroll (live
sweep is the Stage 5 gate).

Issues: mid-build hit the same `EBUSY: rmdir out/web-projects` tooling artifact V11 Stage 4
flagged — a shell (my HTML-inspection `cd`) held a Windows handle on `out/web-projects`, so
the export-clean couldn't remove it. tsc + lint had already passed and the build had generated
all 24 pages; moving the shell's CWD out of `out/`, clearing `out/`, and rebuilding ran green.
Not a code issue — a CWD/handle artifact (I now inspect the built HTML via the Grep tool
instead of `cd`-ing into `out/`).

---

## Stage 3 — Wide shot + full-bleed full-screen image

The two large visual beats after the article: a second full-width rounded rectangle, then an
edge-to-edge full-screen image.

```
1. WIDE SHOT — render a `.case-wide` section if `project.wideShot`: a second full-content-width,
   rounded screenshot (same treatment as the V11 hero — reuse the .case-hero styling or a shared
   class), next/image fill + sizes, no caption, wrapped in Reveal.
2. FULL-BLEED — render a `.case-bleed` section if `project.fullBleed`: an image that runs EDGE TO
   EDGE across the full viewport width, breaking the content gutter. Use a safe full-bleed
   technique (width:100vw; margin-left:calc(50% - 50vw); or a full-width wrapper) that never
   exceeds viewport width — verify no horizontal scroll at every breakpoint. This one is NOT
   rounded (it's meant to bleed). Tall, cinematic frame; next/image fill; no caption; Reveal.
3. Add `.case-wide` (if not shared) and `.case-bleed` CSS to app/globals.css on existing tokens.
   The full-bleed height should be generous but capped (e.g. clamp) so it never dominates on
   ultrawide. No new deps.
4. Author real `wideShot` and `fullBleed` on the Ostiara project (existing/placeholder /public
   shots — don't fabricate files; note any placeholder) so both render in review.

Verify: tsc --noEmit; eslint; next build (export) green. Ostiara shows the rounded wide shot then
the edge-to-edge full-bleed; projects without these fields show neither. CRITICAL: no horizontal
scroll from the full-bleed at 1440 / 768 / 375. Full-bleed spans the viewport with no side gutter.
```

## Stage 3 Report

- [x] **WIDE SHOT (`app/web-projects/[slug]/page.tsx`)** — rendered a `.case-hero.case-wide`
  frame in the slot after the article, gated on `project.wideShot`. It **reuses the hero
  frame** (grouped the selectors `.case-hero, .case-wide` in CSS rather than duplicating the
  rule) — same full-content-width, 16:9, 16px-rounded, panel-surface treatment — with
  `.case-wide` adding only a `margin-top` to space it from the article. `next/image` (`fill` +
  `sizes="(max-width: 1200px) 100vw, 1200px"`), `className="case-hero-img"`, no caption,
  wrapped in `Reveal`.
- [x] **FULL BLEED** — rendered a `.case-bleed` frame in the slot after the wide shot, gated
  on `project.fullBleed`: an edge-to-edge image that breaks the content gutter, **not rounded**
  (by design), `next/image` (`fill` + `sizes="100vw"`), no caption, `Reveal`.
- [x] **CSS (`app/globals.css`):** grouped `.case-hero, .case-wide` for the shared frame; added
  `.case-wide { margin-top }`. Added `.case-bleed` using the safe full-bleed technique —
  `width: 100vw; margin-left: calc(50% - 50vw)` (re-centers on the viewport because the `.wrap`
  it lives in is centered via `margin: 0 auto`, so its content-box centre **is** the viewport
  centre), height **capped** via `clamp(320px, 68vh, 660px)` so it never dominates on
  ultrawide, `overflow: hidden`, no border-radius. `body { overflow-x: hidden }` (already in
  base) is the belt-and-braces against any scrollbar-width overflow. `.case-bleed-img
  { object-fit: cover }`. Existing tokens only, no new deps.
- [x] **Authored real `wideShot` + `fullBleed` on Ostiara** in `site.config.ts`. **Placeholder
  note:** no real Ostiara wide/full-bleed captures exist, so per the stage I reused the two
  existing `/images/web` shots (`charlieramus-com.webp` for the wide, `mylifeinarepo.webp` for
  the bleed) — **no files fabricated** — flagged in a `// CUSTOMIZE` comment. Other projects
  stay unset.

**Verify:** `npx tsc --noEmit` clean; `npm run lint` clean; `next build` (export) green — all
24 routes. In the built HTML, `out/web-projects/ostiara.html` contains both `.case-wide` and
`.case-bleed`; `out/web-projects/querryn.html` has **neither** — projects without these fields
show neither section. The rounded wide shot precedes the edge-to-edge full-bleed in order.

Issues: the CRITICAL "no horizontal scroll from the full-bleed at 1440 / 768 / 375" check is a
**live** measurement, and (matching how V11 split its work) I run the full live responsive
sweep at the **Stage 5 gate**, where this log explicitly mandates it ("no horizontal scroll
anywhere — especially the full-bleed"). The technique itself is the standard centered-container
full-bleed (`calc(50% - 50vw)` + `width: 100vw`) with `body { overflow-x: hidden }` as the
safety net; a local static-server + headless-browser measurement at all three widths lands in
Stage 5 rather than being claimed here unverified.

---

## Stage 4 — Customizable banner + next-project nav

The closing beats: a customizable banner, then the auto-derived next-project link that hands the
visitor to the following case study.

```
1. BANNER — render a `.case-banner` section if `project.banner` and (banner.image || banner.text).
   Render a band with the optional background image (next/image or CSS background) and the optional
   overlaid text (serif, legible over the image — add a subtle scrim only if needed for contrast,
   no heavy gradient). If only text is set, render a clean color/panel band with the text; if only
   image, render the image band. Rounded to match the page (full-bleed banner is out of scope —
   keep it in the content frame). Wrap in Reveal. No caption.
2. NEXT PROJECT — always render a `.case-next` foot link (there is always another project). Resolve
   the target from the webProjects array order: the project after the current one, wrapping the
   last back to the first. Add a small helper (in data/previews.ts, next to webProjectBySlug, e.g.
   `nextWebProject(slug)`) that returns the next WebProject deterministically. Render a quiet
   "Next project → {title}" Link (prefetch={false}) to /web-projects/{next.slug}. No new config
   field — it's derived. (A hero-shot thumbnail on this link is explicitly deferred — text link only.)
3. Add `.case-banner` and `.case-next` CSS to app/globals.css on existing tokens. Banner text
   legible, no AI-slop gradients; next-project link uses the site's existing link-hover treatment
   (mirror .proj-title-link / .case-back). No new deps.
4. Author a real `banner` on the Ostiara project (text, or text + an existing /public image) so it
   renders in review.

Verify: tsc --noEmit; eslint; next build (export) green. Ostiara shows the banner then a
"Next project → …" link that navigates to the next project and wraps from the last project back to
the first. A project without `banner` shows no banner but still shows next-project. No horizontal
scroll at 375; banner text stays legible over its image.
```

## Stage 4 Report

_Pending._

---

## Stage 5 — Hover-grow motion + Ostiara reference + coherence sign-off (the gate)

The finish: the shared hover-grow interaction on every screenshot, a fully-authored Ostiara
reference case study, and the full responsive / a11y / coherence sign-off for the whole V11+V12
redesign.

```
1. HOVER-GROW: add a shared hover interaction to every screenshot frame (hero, squares, wide,
   full-bleed) — on hover the image scales up subtly (~1.02) with an eased transition, clipped
   inside its frame (overflow: hidden on the frame so the rounded corners stay crisp). Do this
   with one shared CSS class/rule, not per-section copies. NO click-to-enlarge / lightbox.
   GATE: wrap the scale in `@media (prefers-reduced-motion: no-preference)` (or disable it under
   reduce) so reduced-motion users get no grow. Verify the full-bleed grow doesn't introduce
   horizontal scroll.
2. OSTIARA REFERENCE: confirm the Ostiara project now exercises EVERY section (heroShot, overview,
   worked, challenge, process, squares, article + pullQuote, wideShot, fullBleed, banner) so the
   template is proven end-to-end and Charlie has a real reference to copy for other projects.
   Where a real asset doesn't exist, use an existing /public image as a documented placeholder —
   never fabricate files.
3. FULL BUILD GATE: tsc --noEmit, eslint . (whole repo), next build (export) all green. Paste the
   route list + count; confirm every /web-projects/<slug> prerenders.
4. RESPONSIVE SWEEP at 1440 / 768 / 375 on the Ostiara (fully-authored) page AND an unauthored
   project (e.g. querryn): no horizontal scroll anywhere (especially the full-bleed), cards/squares
   stack, article column stays legible, banner text legible, sections in the correct fixed order.
5. MOTION SWEEP: with prefers-reduced-motion — no hover-grow, process flowers still. Without it —
   hover-grow eases smoothly, flowers spin.
6. A11y: axe = 0 on the detail pages (if a browser is available; if not, say so honestly and log
   the manual check — do NOT fabricate a score). No console errors. Images have real alt text
   (project title + section), the next-project link is a real Link, no nested <a>.
7. Update ROADMAP.md / MANUAL-TODO.md: mark the case-study redesign done; note the deferred
   next-project thumbnail and any placeholder assets that need real screenshots.

Verify: paste the build route list, the responsive + reduced-motion + a11y results (or the honest
deferral), and confirm the hover-grow is reduced-motion-gated and the full-bleed causes no
horizontal scroll. Report deferrals in MANUAL-TODO.md.
```

## Stage 5 Report

_Pending._

---

# After These Stages
- **The case study is whole.** Every project detail page is now a screenshot-forward editorial
  story — hero → cards → process → squares → article → wide → full-bleed → banner → next project —
  each section optional and every one authored from `site.config.ts`.
- **Ostiara is the reference.** The flagship project exercises every section, so Charlie can copy
  its shape to flesh out the other projects by editing config alone.
- **The rhythm is intentional.** Full-width and full-bleed screenshots carry the weight; the two
  squares and the NYT article change the pace; the hover-grow makes the shots feel alive without a
  single caption or a lightbox.
- **Deferred on purpose (see `MANUAL-TODO.md`):** a hero-shot thumbnail on the next-project link;
  real square/wide/full-bleed screenshots for projects still using placeholders; authoring the
  remaining projects' case-study copy (a pure `site.config.ts` task now that the template is proven).
