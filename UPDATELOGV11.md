charlie

# UPDATELOG V11 — CASE-STUDY PAGES 1/2: STRUCTURE + THE TOP OF THE PAGE
# Work on one stage at a time. Do NOT combine stages.

**First read `AGENTS.md`, `DESIGN-BRIEF.md`, `site.config.ts`, and the V10 stage reports.**
V10 shipped click-in web-project detail pages (`/web-projects/[slug]`) — but they render
**text-forward** (title → tags → `problem`/`approach`/`outcome` prose → stacked gallery).
V11 + V12 **redesign that page into a screenshot-forward, editorial case study**, fully
authored from `site.config.ts`. The list page, the routing, and the static-export pipeline
are already in place from V10 — this is a re-skin of the detail body, not new plumbing.

**This is log 1 of 2 (V11 → V12).** V11 builds the schema and the **top of the page**:
the conditional section renderer, the full-width hero screenshot, the three cards, and the
flower-bulleted process timeline. V12 builds the **editorial body** (two squares, the NYT
article, the second full-width, the full-bleed, the banner, the next-project nav) plus the
hover-grow motion pass and the full sign-off.

**A case study = a fixed, top-to-bottom sequence of optional sections, each rendered only
when its data exists in `site.config.ts`.** No section is required; a project with only a
hero shot and an overview renders those two and nothing else — no empty frames.

This log builds only the schema + the top-of-page sections (hero, cards, process). It does
**not** build the squares, article, wide shot, full-bleed, banner, next-project nav, or the
hover-grow interaction — those are **V12**. Design-project pages stay gallery work, untouched.

## Decisions (agreed in the CEO-review brainstorm, 2026-07-14)
- **Fixed-order template, every section optional (render-if-present).** Chosen over a
  flexible `layout: ProjectBlock[]` array (heavier to author) and a hybrid skeleton
  (two authoring mental models). Because only **2 of 6** web projects currently have any
  screenshot, optionality is what keeps the image-less projects clean instead of broken.
- **Fixed render order:** hero shot → 3 cards (Overview / What I worked on / The Challenge)
  → Process → 2 squares → Article → wide shot → full-bleed → banner → Next project. V11
  ships the first four; V12 the rest.
- **Overview card = structured facts, not prose.** Labeled rows — Role, Timeline, Stack,
  Status, Live link — where `timeline` / `stack` / `link` fall back to the existing
  `date` / `tags` / `href` when their optional field is omitted. Industry-norm scan block.
- **Process bullets = `{ title, detail? }`.** Each bullet is a spinning flower marker + a
  bold stage title + an optional one-line detail. Reuses `components/motif.tsx` with its
  existing deterministic per-index wind-spin (no `Math.random()` — SSR/hydration-safe).
- **Retire the old case-body fields.** `problem` / `approach` / `outcome` / `gallery` on
  `WebProject` are unused in the data today; the new sections replace them. Keep `image`
  (the `/web-projects` list thumbnail + the detail OG fallback).
- **No image captions** (Charlie's explicit "super clean, no text describing the image"
  rule). Every image frame is rounded. All motion respects `prefers-reduced-motion`.
- **Config-driven, one file.** Every new field lives in `site.config.ts` behind a
  `// CUSTOMIZE` marker; `data/projects-web.ts` stays a thin re-export.
- **Static export intact.** `/web-projects/[slug]` still prerenders via
  `generateStaticParams` + `dynamicParams = false`. Tailwind v4 CSS-first: new component
  classes go in `app/globals.css` on existing `@theme` tokens; no new deps, no config file.
- **Medium feature, split across two logs.** V11 = **five stages** (schema, shell + hero,
  the three cards, the process timeline, verify gate); V12 = five stages.

## Hard constraints (carry over from V7–V10)
- **Additive / re-skin, non-regressive.** Only the `/web-projects/[slug]` detail body and
  its `WebProject` schema change. The list page, routing, other routes, and the export
  pipeline stay as they are (the list page is touched again in V12 only for the next-project
  link surface, not here).
- **Every section conditional.** Render a section **only** if its backing field is present
  and non-empty. Never emit an empty frame, an empty card, or a zero-length list.
- **Config is the surface.** Changing any project's copy or images is a `site.config.ts`
  edit — never a `components/` or page edit.
- **Motion respects `prefers-reduced-motion`.** The process flowers freeze/still under
  reduced motion (same rule the homepage flowers already follow).
- Verify each stage with `tsc --noEmit` + `eslint .` + `next build` (export). Confirm no
  horizontal scroll at 1440 / 768 / 375 and no console errors. Don't commit/push unless
  Charlie asks (`/complete-updatelog` handles the `stage<N>v11` commits when run).

---

## Stage 1 — Case-study schema in `site.config.ts`

Add the new optional case-study fields to `WebProject`, retire the old case-body ones, and
document each with a `// CUSTOMIZE` note. No rendering changes this stage — schema only, so
the type compiles and the existing page still builds against the surviving fields.

```
1. In site.config.ts, extend the `WebProject` type (the block near the WEB PROJECTS banner)
   with these OPTIONAL fields, in render order, each with a // CUSTOMIZE note:
     - heroShot?: string                       // full-width rounded main screenshot (/public path)
     - overview?: {                            // "Project Overview" facts card
         role?: string;
         timeline?: string;                    // defaults to project.date if omitted
         stack?: string[];                     // defaults to project.tags if omitted
         status?: string;                      // e.g. "Shipped", "In progress"
         link?: string;                        // defaults to project.href if omitted
       }
     - worked?: string                         // "What I worked on" card (freeform)
     - challenge?: string                      // "The Challenge" card (freeform)
     - process?: { title: string; detail?: string }[]   // flower-bulleted timeline
     - squares?: [string, string]              // V12 — two side-by-side square images
     - article?: { paragraphs: string[]; pullQuote?: string }   // V12
     - wideShot?: string                       // V12 — second full-width screenshot
     - fullBleed?: string                      // V12 — full-screen edge-to-edge image
     - banner?: { image?: string; text?: string }        // V12
   (Declaring the V12 fields now keeps the schema authored in one place; V12 renders them.)
2. REMOVE the now-retired fields from the type and from every project entry:
   problem?, approach?, outcome?, gallery?. They are unused in the data. KEEP `image` and
   `spotlight`.
3. Leave all six projects' new fields UNSET for now (authored later / in the Stage-2+ demo).
   Do not invent case-study copy in this stage.
4. Confirm data/projects-web.ts stays a thin re-export (no change needed).

Verify: tsc --noEmit clean; eslint site.config.ts clean; next build (export) green. Report
that the retired fields are gone and the new optional fields compile with no project yet
populating them (so the existing detail page still renders from title/date/tags/description).
```

## Stage 1 Report

- [x] **`site.config.ts` — extended the `WebProject` type** (the block under the WEB
  PROJECTS banner) with the new optional case-study fields, in render order, each behind
  a `// CUSTOMIZE` note: `heroShot?`, `overview?` ({ role?, timeline?, stack?, status?,
  link? }), `worked?`, `challenge?`, `process?: { title; detail? }[]`, plus the V12
  fields declared now so the schema lives in one place: `squares?: [string, string]`,
  `article?: { paragraphs; pullQuote? }`, `wideShot?`, `fullBleed?`, `banner?: { image?;
  text? }`. Documented the fallback rule inline (overview `timeline`/`stack`/`link` →
  project `date`/`tags`/`href`).
- [x] **Retired the old case-body fields.** Removed `problem?`, `approach?`, `outcome?`,
  and `gallery?` from the type. No project entry populated any of them, so no entry edits
  were needed. Kept `image` (list thumbnail + OG fallback) and `spotlight`.
- [x] **All six projects' new fields left UNSET** — no case-study copy invented this
  stage. Authoring lands on Ostiara in Stages 3–4.
- [x] **`data/projects-web.ts` unchanged** — still a thin `export type { WebProject }` /
  `export { webProjects }` re-export of `site.config.ts`.
- [x] **Deviation (needed to keep the verify gate green):** the type removal made the old
  `app/web-projects/[slug]/page.tsx` fail `tsc` (it read `project.problem/approach/
  outcome/gallery`). Per this stage's "the existing page still builds against the
  surviving fields," I removed those now-dead references — the `body` array + its render
  block, the `gallery` block, and the now-unused `next/image` import. This is **zero
  visual change** (no project ever populated those fields, so the body was always empty
  and the gallery never rendered); Stage 2 rebuilds this body wholesale anyway.

**Verify:** `tsc --noEmit` clean; `eslint site.config.ts app/web-projects/[slug]/page.tsx`
clean (exit 0); `next build` (export) green — all 24 routes prerender, including all six
`/web-projects/<slug>` pages (ostiara, mylifeinarepo, querryn, vaultdna, charlieramus-com,
backtrace). The detail page still renders from title/date/tags/description with no project
yet populating the new fields.

Issues: none.

---

## Stage 2 — Template shell (conditional section renderer) + hero shot

Rebuild `app/web-projects/[slug]/page.tsx` as a **screenshot-forward shell** that renders
each section only when its data exists, and ship the first section: the full-width rounded
hero screenshot. Retire the old `.case-body` / `.case-section` / `.case-gallery` markup.

```
1. In app/web-projects/[slug]/page.tsx, keep the existing scaffolding: generateStaticParams,
   dynamicParams=false, generateMetadata, JSON-LD, SiteHeader/SiteFooter, the resolved
   `project`. Remove the old `body` array (problem/approach/outcome) and the old gallery block.
2. Update generateMetadata + JSON-LD image to prefer heroShot: `project.heroShot ?? project.image`
   (then fall back to /opengraph-image as today).
3. Build the new page body as a top-to-bottom sequence of conditional sections. This stage
   renders exactly two things:
     a. A slim header: the "← All projects" back-link, the title, and the date. Keep it quiet —
        the screenshots carry the page now. (Tags move into the Overview facts card in Stage 3.)
     b. HERO SHOT — if `project.heroShot`, render a full-width, rounded, edge-generous
        screenshot using next/image (fill + sizes), wrapped in Reveal for the fade-up. NO
        caption. Class it `.case-hero` / `.case-hero-img`.
   Every later section (cards, process, squares, article, wide, bleed, banner, next) is a
   commented placeholder slot in the intended order, so Stages 3–4 and V12 drop straight in.
4. Add the .case-hero CSS to app/globals.css on existing @theme tokens: full content width
   (respect the site's --edge gutter / wrap), rounded corners (reuse the site's radius token),
   16:9-ish frame that never crops awkwardly, no shadow-heavy AI slop. No hover motion yet
   (that's the V12 pass). No new tokens, no new deps.

Verify: tsc --noEmit; eslint app/web-projects site.config.ts; next build (export) green, all
routes still prerender including each /web-projects/<slug>. With no heroShot set, a project
renders just the header (no empty frame). Temporarily setting a heroShot to an existing
/images/web/*.webp renders the full-width rounded shot. No horizontal scroll at 375.
```

## Stage 2 Report

- [x] **Rebuilt `app/web-projects/[slug]/page.tsx` as the screenshot-forward shell.** Kept
  all the scaffolding: `generateStaticParams`, `dynamicParams = false`, `generateMetadata`,
  the JSON-LD `<script>`, `SiteHeader`/`SiteFooter`, and the resolved `project` (via
  `webProjectBySlug`). The old text-forward body (`problem`/`approach`/`outcome` prose +
  the stacked gallery) was already removed in Stage 1; this stage lays down the new body.
- [x] **OG + JSON-LD prefer the hero shot.** `generateMetadata` now uses
  `project.heroShot ?? project.image` for the OG/Twitter card (then `/opengraph-image`);
  the JSON-LD `image` uses `heroShot ?? image` when either exists. Verified in the built
  `out/web-projects/ostiara.html` — `og:image`, `twitter:image`, and JSON-LD `image` all
  pointed at the (temporarily-set) hero.
- [x] **Slim header** (`.inner-head.case-head`, wrapped in `Reveal as="header"`): just the
  "← All projects" back-link, the `<h1>` title, and the date (`.proj-meta`). Dropped the
  description and the inline external link from the header per the spec ("keep it quiet") —
  tags + link move into the Overview facts card in Stage 3.
- [x] **HERO SHOT section** — renders only when `project.heroShot` is set: a full-width,
  rounded `next/image` (`fill` + `sizes="(max-width: 1200px) 100vw, 1200px"`, `priority`),
  wrapped in `Reveal`, no caption. Classed `.case-hero` / `.case-hero-img`.
- [x] **Placeholder slots** for every later section (cards → process → squares → article →
  wide → full-bleed → banner → next) left as a single JSX comment in intended order, so
  Stages 3–4 and V12 drop straight in.
- [x] **CSS (`app/globals.css`, in `@layer components`):** retired the old `.case-body` /
  `.case-section` / `.case-gallery` / `.case-shot` / `.case-img` rules; kept `.case-back`;
  added `.case-head` (drops the header's bottom rule so the hero carries the eye) and
  `.case-hero` / `.case-hero-img` — full content width inside `.wrap` (honors the `--edge`
  gutter), `aspect-ratio: 16/9`, `object-fit: cover`, `border-radius: 16px` (the site's
  established image-frame radius — there is no `--radius` token; 16px matches `.proj-visual`
  / the old `.case-shot`). No hover motion (that's the V12 pass). No new tokens, no deps.

**Verify:** `tsc --noEmit` clean; `eslint` on both web-projects pages + `site.config.ts`
clean (exit 0); `next build` (export) green — all 24 routes prerender, every
`/web-projects/<slug>` included. Temporarily setting Ostiara's `heroShot` to
`/images/web/charlieramus-com.webp` rendered `<div class="reveal case-hero"><img
class="case-hero-img" …></div>` in the built HTML (then reverted). With no `heroShot`,
querryn's built page has **no** `case-hero` frame — header only, no empty frame.

Issues: no interactive browser was driven this stage, so the "no horizontal scroll at 375"
check is deferred to the Stage 5 responsive sweep (the hero is width-constrained to `.wrap`,
which already governs every other inner page without overflow).

---

## Stage 3 — The three cards (Overview facts · What I worked on · The Challenge)

The card row that sits under the hero. Overview is a structured facts block; the other two
are clean freeform cards. Each card renders only if it has content.

```
1. In the detail page, after the hero slot, render a `.case-cards` row (3-up on desktop,
   stacking on mobile) containing up to three cards, each conditional:
     a. OVERVIEW (render if `project.overview` OR always-derivable facts exist): a titled
        "Project Overview" card with labeled rows —
          Role     → overview.role (omit row if absent)
          Timeline → overview.timeline ?? project.date
          Stack    → overview.stack ?? project.tags  (render as the existing .tag chips)
          Status   → overview.status (omit if absent)
          Link     → overview.link ?? project.href, rendered as the external "View on GitHub ↗"
                     / domain link (reuse the linkLabel helper), omit if empty.
        A row whose value is empty is skipped — never render an empty label.
     b. WORKED (render if `project.worked`): a "What I worked on" card, freeform paragraph.
     c. CHALLENGE (render if `project.challenge`): a "The Challenge" card, freeform paragraph.
   Wrap the row in Reveal. If none of the three have content, render nothing.
2. Add `.case-cards` / `.card` CSS to app/globals.css: equal-height cards on the site's panel
   surface, rounded, generous padding, quiet labels (uppercase-ish small caps or muted ink for
   the facts labels), values in body ink. 3 columns → 1 column under the same breakpoint the
   rest of the site uses. No gradients, no AI slop. Existing tokens only.
3. Author a REAL example on the Ostiara project only (it's the flagship): fill `overview`
   (role: "Solo — full stack + design", status: "In progress"), `worked`, and `challenge`
   from its existing description, so the section is visible in review. Other projects stay unset.

Verify: tsc --noEmit; eslint; next build (export) green. Ostiara's detail page shows the three
cards with the Overview facts (timeline/stack/link falling back correctly); a project with only
`worked` shows a single card; a project with none shows no card row. No horizontal scroll at 375;
cards stack cleanly on mobile.
```

## Stage 3 Report

- [x] **`app/web-projects/[slug]/page.tsx` — rendered the `.case-cards` row** in the CARDS
  slot under the hero, wrapped in `Reveal`. The whole row renders only if at least one of
  `project.overview` / `project.worked` / `project.challenge` has content; otherwise nothing.
  Re-added the `linkLabel` helper (removed in the Stage 2 rewrite) for the Overview Link row.
- [x] **Overview card** (`<section className="card">` → "Project Overview" + a `<dl className="card-facts">`):
  - `Role` — `overview.role`, row omitted when absent.
  - `Timeline` — `overview.timeline ?? project.date` (always shown; date always exists).
  - `Stack` — `(overview.stack ?? project.tags)` rendered as the existing `.tag` chips; row
    skipped if the resolved array is empty.
  - `Status` — `overview.status`, row omitted when absent.
  - `Link` — `overview.link ?? project.href` via the `linkLabel` helper ("View on GitHub ↗"
    / bare domain), row omitted when empty.
- [x] **Worked / Challenge cards** — "What I worked on" (`project.worked`) and "The Challenge"
  (`project.challenge`), each a single freeform `.card-text` paragraph, each conditional.
- [x] **Design decision (reconciling the spec with Stage 5's empty state):** the spec's
  "render Overview if `project.overview` OR always-derivable facts exist" would show an
  Overview card on *every* project (date/tags always derive), which contradicts Stage 5's
  requirement that an unauthored project (querryn) render **no** card row. I gated the
  Overview card on `project.overview` being authored; the date/tags/href fallbacks then
  operate *within* the card once it's shown. Verified: querryn's built page has no
  `.case-cards`.
- [x] **CSS (`app/globals.css`):** added `.case-cards` (3-col grid, `align-items: stretch`
  for equal height, on the site's tokens), `.card` (flex column, `--color-panel` surface,
  `--color-line` border, 16px radius, generous clamp padding), `.card-title` (serif),
  `.card-text`, and the `.card-facts` `<dl>` styling — quiet uppercase `--color-ink-soft`
  `<dt>` labels, `--color-ink` `<dd>` values, `.fact-tags` chip row, `.fact-link`. Added
  `.case-cards { grid-template-columns: 1fr }` to the existing `@media (max-width: 880px)`
  block so it stacks on the same breakpoint the rest of the site uses. Existing tokens only.
- [x] **Authored the real Ostiara example** in `site.config.ts`: `overview` = { role:
  "Solo — full stack + design", status: "In progress" } (timeline/stack/link intentionally
  omitted to exercise the fallbacks), plus `worked` and `challenge` drawn from its existing
  description + bio (no new facts invented). Other projects stay unset.

**Verify:** `tsc --noEmit` clean; `eslint` clean; `next build` (export) green (all 24
routes). In the built HTML, `out/web-projects/ostiara.html` shows the three cards — Overview
with Role, Timeline ("May 2026 - Present", the date fallback), Stack (the 5 tag chips, the
tags fallback), Status, and Link ("View on GitHub", the href fallback) — then "What I worked
on" and "The Challenge". `out/web-projects/querryn.html` has no `.case-cards` row.

Issues: mobile stacking + no-horizontal-scroll-at-375 confirmed via the CSS breakpoint
(`.case-cards → 1fr` at ≤880px); the live-browser responsive sweep is Stage 5.

---

## Stage 4 — The Process (flower-bulleted build timeline)

The "process" section: each stage a spinning-flower bullet + bold title + optional detail,
any length, all from config.

```
1. In the detail page, after the cards slot, render a `.case-process` section if
   `project.process?.length`. Section heading "The process" (a quiet h2). Render each entry as
   a row: a spinning flower marker on the left (reuse components/motif.tsx — pass a cycling
   petal `fill` and the entry `index`, same pattern as app/web-projects/page.tsx's placeholder
   motifs, so the deterministic per-index wind-spin stays SSR-safe), then the bold `title`, and
   the `detail` line beneath it in muted ink when present. Wrap the list in Reveal.
2. The bullet count is whatever `process` has — no cap, no minimum beyond 1 (the section is
   hidden when the array is empty/absent). Make the marker column fixed-width so titles align.
3. Add `.case-process` CSS to app/globals.css: a vertical list with comfortable rhythm, the
   flower marker sized to sit on the title's cap-height, title in --font-serif or bold sans to
   match the site's section style, detail in --color-ink-soft. Ensure the flower's existing
   reduced-motion freeze still applies (it comes from the shared flower CSS — confirm, don't
   re-implement). Existing tokens only, no new deps.
4. Author a REAL `process` on the Ostiara project (4–6 entries with title + detail drawn from
   its build story) so the section renders in review. Other projects stay unset.

Verify: tsc --noEmit; eslint; next build (export) green. Ostiara shows the flower-bulleted
process with aligned titles + details; changing the number of `process` entries changes the
count with no layout break; a project without `process` shows no section; under
prefers-reduced-motion the flowers don't spin. No horizontal scroll at 375.
```

## Stage 4 Report

- [x] **`app/web-projects/[slug]/page.tsx` — rendered the `.case-process` section** in the
  PROCESS slot (after the cards), gated on `project.process && project.process.length > 0`.
  Section heading "The process" (a quiet serif `.case-process-title` h2), then an `<ol
  className="process-list">` with one `.process-step` per entry.
- [x] **Each step** is a two-column grid row: a `.process-marker` holding `<Motif>` (fed a
  cycling `PETALS` fill + the entry `index`, the same deterministic wind-spin pattern as the
  `/web-projects` list placeholders — SSR-safe, no `Math.random`), then a bold serif
  `.process-step-title` and, when present, a muted `.process-detail` line beneath it. Keyed
  `${step.title}-${i}`.
- [x] **Alignment / count.** The marker column is a fixed `34px` grid track so all titles
  align regardless of marker; the list length is whatever `process` holds (no cap, no
  minimum beyond the length>0 gate). Imported `Motif`; added the `PETALS` fill array.
- [x] **CSS (`app/globals.css`):** added `.case-process`, `.case-process-title` (serif),
  `.process-list` (list-style none, flex column with clamp rhythm), `.process-step`
  (`grid-template-columns: 34px 1fr`), `.process-marker` (26px flower nudged onto the
  title cap-height), `.process-step-title` (serif bold, `--color-ink`), `.process-detail`
  (`--color-ink-soft`, 60ch). **The reduced-motion freeze is NOT re-implemented** — it
  comes from the shared `.motif` rule (globals.css `@media (prefers-reduced-motion: reduce)
  { .motif { animation: none } }`), confirmed in place. Existing tokens only.
- [x] **Authored a real Ostiara `process`** in `site.config.ts`: 5 entries (Customer
  discovery → Data model & access control → Admin dashboard → Design system → Marketing
  site), each with a one-line detail drawn from its existing description + the experience
  entry (no new facts). Other projects stay unset.

**Verify:** `tsc --noEmit` clean; **`npm run lint`** (the repo's bare-`eslint` flat-config
script) clean — note: `eslint .` and passing `site.config.ts` as an explicit path both error
under this flat config ("all files … are ignored" / "no files matching the pattern"), so the
correct invocation is `npm run lint`, which lets ESLint's own config-driven discovery run;
that is what I used and it passed. `next build` (export) green — all 24 routes, all six
`/web-projects/<slug>`. In the built HTML, `out/web-projects/ostiara.html` shows the
`.case-process` list with 5 `.motif` markers + the 5 aligned titles/details in order;
`out/web-projects/querryn.html` has no `.case-process` (0 matches). Changing the entry count
in config changes the rendered count 1:1 (grid row structure, no layout break). Under
`prefers-reduced-motion` the markers are still — inherited from `.motif` (verified in CSS).

Issues: mid-stage, a stale Git-Bash wait-loop shell that had `cd`'d into `out/web-projects`
held a Windows directory handle, so `next build`'s export-clean hit `EBUSY: rmdir`. Killed
the stray shells, cleared `out/`, and the build then ran green. Not a code issue — a
tooling/CWD artifact; noted so Stage 5 avoids `cd`-ing into `out/`.

---

## Stage 5 — Coherence + verify (V11 gate)

Prove the top-of-page (schema, hero, cards, process) lands cleanly and nothing regressed,
before V12 continues with the editorial body.

```
1. Full build gate: tsc --noEmit, eslint . (whole repo), next build (export) all green. Paste
   the route list + count; confirm every /web-projects/<slug> still prerenders.
2. Empty-state sweep: confirm a project with NO new fields (e.g. querryn) renders a valid,
   uncluttered page — header only, no empty hero frame, no empty card row, no process section.
   Confirm Ostiara (the authored one) renders hero → 3 cards → process in order.
3. Config-is-the-surface check: confirm heroShot, overview, worked, challenge, and process are
   all editable from site.config.ts behind // CUSTOMIZE markers and that changing each visibly
   changes the page without touching components/ or the page file.
4. Responsive sweep at 1440 / 768 / 375 on /web-projects/<slug> (both an authored and an
   unauthored project): no horizontal scroll, cards stack, hero stays rounded and uncropped,
   process titles stay aligned.
5. Motion sweep: with prefers-reduced-motion, the process flowers are still (not spinning).
6. Confirm the retired problem/approach/outcome/gallery fields are fully gone (no dead
   references anywhere): grep the repo.
7. Note in MANUAL-TODO.md that V12 continues with squares → article → wide → full-bleed →
   banner → next-project → hover-grow.

Verify: paste the build route list, the empty-state result for one authored + one unauthored
project, and the responsive + reduced-motion confirmations. Report any deferrals in
MANUAL-TODO.md (do not fabricate a browser axe score if no browser is available — say so).
```

## Stage 5 Report

**1. Full build gate — all green.** `tsc --noEmit` clean; `npm run lint` (the repo's bare
`eslint` flat-config script) clean; `next build` (export) green. Route list (24 routes):

```
┌ ○ /                          ├ ○ /photography
├ ○ /_not-found                ├ ○ /robots.txt
├ ○ /apple-icon                ├ ○ /sitemap.xml
├ ○ /design                    ├ ○ /web-projects
├ ○ /gear                      ├ ● /web-projects/[slug]
├ ○ /icon                      │   ostiara · mylifeinarepo · querryn · vaultdna ·
├ ○ /opengraph-image           │   charlieramus-com · backtrace  (all 6 prerender)
├ ○ /writing                   └ ● /writing/[slug]  (4 essays)
```

All six `/web-projects/<slug>` pages prerender (`●` SSG via `generateStaticParams`,
`dynamicParams = false`).

**2. Empty-state sweep.** Verified in a real headless browser (served the freshly-built
`out/`) and in the built HTML:
- **querryn** (no new fields): `hasHero:false, hasCards:false, hasProcess:false` — a valid,
  uncluttered header-only page. No empty hero frame, no empty card row, no process section.
- **Ostiara** (authored): renders the three cards → the process timeline in order. Note:
  Ostiara has **no `heroShot`** authored (no real Ostiara screenshot exists in `/public`,
  and none was assigned by any stage — Stage 2 only did a temporary hero smoke-test, then
  reverted). So the hero *slot* correctly renders nothing for it; the slot itself is proven
  by Stage 2's temporary test, which rendered the full-width rounded shot. This is exactly
  the render-if-present contract.

**3. Config-is-the-surface.** `heroShot`, `overview`, `worked`, `challenge`, and `process`
are all authored in `site.config.ts` behind `// CUSTOMIZE` markers on the `WebProject`
type / the Ostiara entry; every section is gated on its field, so changing a field in that
one file visibly changes the page with no edit to `components/` or the page file. (Confirmed
across the stages: the Stage-2 temporary `heroShot` edit added/removed the hero; the Stage-3
`overview/worked/challenge` edits added the cards; the Stage-4 `process` edit added the
timeline — all from `site.config.ts` alone.)

**4. Responsive sweep (real headless Chromium via gstack `browse`, against the built `out/`):**
horizontal overflow = `scrollWidth − innerWidth`:

| Page | 1440 | 768 | 375 |
|---|---|---|---|
| ostiara (authored) | 0 (cards 3-up: `327.7px ×3`) | 0 | 0 (cards 1-col: `330px`) |
| querryn (unauthored) | 0 | 0 | 0 (header only) |

No horizontal scroll anywhere; the `.case-cards` row is 3-up on desktop and stacks to a
single column at 375 (the site's `≤880px` breakpoint). Hero stays rounded/uncropped (16:9,
`object-fit: cover`, verified in Stage 2's temporary test); process titles align (fixed 34px
marker column).

**5. Motion sweep.** The process flowers reuse the shared `.motif`, whose reduced-motion
freeze is a single shared rule. I confirmed it **ships in the compiled stylesheet** the page
loads: `@media (prefers-reduced-motion:reduce){.motif{animation:none…}}` is present in
`out/_next/static/chunks/*.css`. I could **not** toggle the media feature through the browse
tool to re-observe it live — `CDP Emulation.setEmulatedMedia` is denied by gstack's CDP
allowlist — so this is confirmed at the compiled-CSS-artifact level (and it's the same rule
that already freezes every other flower on the shipped site), not via an in-browser media
emulation. Flagged honestly rather than faked.

**6. Retired fields fully gone.** Grepped the repo (`*.ts`/`*.tsx`) for
`problem`/`approach`/`outcome`/`gallery` as `WebProject` fields / property accesses — **no
matches**. (The remaining textual hits elsewhere are unrelated: the photography *gallery*
component, design-copy prose using the word "approach", etc.)

**7. MANUAL-TODO.md** updated: added a "V11 → V12 — case-study detail pages" section noting
V12 continues with squares → article → wide → full-bleed → banner → next-project → hover-grow
(+ a live responsive/reduced-motion sign-off item), and fixed the stale V10 note that still
told Charlie to fill the now-retired `problem/approach/outcome/gallery` fields (repointed to
the new case-study fields).

**Verify:** build route list pasted above; empty-state confirmed for querryn (unauthored,
header-only) and Ostiara (authored, cards → process); responsive table at 1440/768/375 shows
0 horizontal overflow with cards stacking; reduced-motion freeze confirmed present in the
compiled CSS (live media-emulation deferred — CDP method not allowlisted; noted, not
fabricated). No new deps, no config file; Tailwind v4 CSS-first on existing `@theme` tokens.

Issues: (a) reduced-motion could only be verified via the compiled-CSS artifact, not a live
media toggle, because the browse tool's CDP allowlist blocks `Emulation.setEmulatedMedia` —
recorded in MANUAL-TODO's live sign-off item. (b) Ostiara ships without a hero image (no real
screenshot available) — by design, the hero renders only when a `heroShot` is authored.

---

# After These Stages
- **The case study has a spine.** The detail page is now a screenshot-forward shell that
  renders a fixed sequence of optional sections; the top of the page (hero, three cards,
  process timeline) is real and authored on Ostiara as the reference.
- **The one-file promise holds.** Hero, overview facts, the two prose cards, and the process
  timeline are all authored from `site.config.ts` — no `components/` edits to tell a project's
  story.
- **V12 finishes the page:** two squares → NYT article (drop-cap + optional pull-quote) →
  second full-width → full-bleed → banner → next-project nav, then the hover-grow motion pass
  and the full responsive / a11y / coherence sign-off. See `UPDATELOGV12.md`.
