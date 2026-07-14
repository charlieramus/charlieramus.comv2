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

_Pending._

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

_Pending._

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

_Pending._

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

_Pending._

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
