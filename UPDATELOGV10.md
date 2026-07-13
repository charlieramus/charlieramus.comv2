# UPDATELOG V10 — DEPTH & CHARACTER: CLICK-IN WORK PAGES + DECORATIVE MOTION

**First read `DESIGN-BRIEF.md`, `AGENTS.md`, `site.config.ts`, and the V9 stage reports.**
V9 collapsed every editable string into one file (`site.config.ts`) and made the site a
fork-and-customize template. **V10 is the first *additive* log since then** — it does not just move
copy, it ships new surfaces and new character. Five tweaks, all driven from `site.config.ts` so the
one-file-to-edit promise holds.

Unlike V9 (whose whole job was "render byte-for-byte identical"), **V10 changes what renders** — new
routes, new components, new motion. The discipline carries over in a different shape: every new
editable value lives in `site.config.ts` behind a `// CUSTOMIZE` marker, every new codepath respects
`prefers-reduced-motion`, and the static `output: export` pipeline (V7) still prerenders every route.

**The five tweaks (agreed in the CEO-review brainstorm):**
1. **Wire the `/writing` page copy into `site.config.ts`.** It is the one inner page whose kicker /
   heading / lede / meta-description are still hardcoded — a V9 Stage 2 miss, not a choice.
2. **Click-in web-project detail pages.** Real routes (`/web-projects/ostiara`, …), data-driven from
   `site.config.ts`. Web projects only; design work keeps its gallery.
3. **Brand & layout: 2 photos per project + expand.** `/design` shows 2 slides per project by
   default with a "Show all" toggle; the lightbox still steps the full set.
4. **Spiral text on `/writing`.** Decorative Archimedean-spiral quote text in the outer margins,
   rotating, desktop-only, quotes pulled from Charlie's essays and editable in config.
5. **Vertical `.ART.CREATE.` marquee on `/photography`.** A moving vertical rail in bold Inter, one
   segment each in the site's turquoise / red / yellow, each with its own editable tagline.

## Decisions (agreed in the CEO-review brainstorm)
- **Tweak 1 — pure consistency fix.** `/writing` gets a `sections.pages.writing` block
  (`kicker`, `heading`, `lede`, `metaDescription`) exactly like the other four inner pages, and
  `app/writing/page.tsx` reads from it. No content changes, same words, just relocated.
- **Tweak 2 — data-driven detail pages WITH real routes (not MDX).** Chosen over MDX case studies:
  add a stable `slug` plus optional long-form fields to `WebProject` in `site.config.ts`; render at
  `/web-projects/[slug]` via `generateStaticParams`. A project with no long-form body still gets a
  page from its existing fields (title / date / description / tags / links) — nothing 404s. Rows on
  `/web-projects` link **in** to the detail page; the external "View on GitHub" link stays as a
  secondary action. **Web projects only** — design projects are gallery work, not case studies.
- **Tweak 3 — 2 slides default, module constant + optional per-project override.** `DesignGallery`
  caps visible slides to `previewCount` (default **2**) with a per-project override; a "Show all N →"
  toggle reveals the rest. The lightbox already flattens the **full** slide set with global indices
  computed over every slide regardless of visibility, so arrow-stepping stays correct when collapsed.
  No new config surface for the count — it is not worth the weight.
- **Tweak 4 — spiral lives on `/writing`.** Placed in the **outer page margins** with a heavy white
  barrier to the prose column. **Desktop-only**: hidden below a wide breakpoint (no margin to spare
  on tablet/mobile) and fully removed under `prefers-reduced-motion`. Quotes come from a
  `writingSpirals` array in `site.config.ts`; sizes / off-screen bleed / opacity are the
  implementer's call, tuned to read as texture, not noise.
- **Tweak 5 — vertical marquee lives on `/photography`.** The gallery's gutters are the right home
  for a vertical rail. Driven by a `marquees` array in `site.config.ts` (`{ color, text }` per
  segment), colors resolved to `--color-cyan` / `--color-red` / `--color-yellow`. Bold Inter
  (`--font-sans`, already loaded). Frozen (static, not scrolling) under `prefers-reduced-motion`.
- **Coherence rule.** One decorative idea per surface: spiral → `/writing`, marquee → `/photography`.
  They never share a page, so no surface fights itself.
- **Six stages.** Four ship one tweak each (1, 3, then 2, then 4, then 5), preceded by the smallest;
  the last is the visual sign-off gate. Tweak 1 goes first because it is the smallest and re-proves
  the config-read pattern the later stages lean on.

## Hard constraints (carry over from V6 + V7 + V8 + V9)
- **Additive, non-regressive.** New routes and components only. No existing rendered text, layout,
  color, or route may change except where a tweak explicitly asks for it (the `/design` slide count,
  the `/web-projects` rows becoming links, the new `/writing` + `/photography` decoration).
- **Config-driven, one file.** Every new editable value (page copy, project long-form fields, spiral
  quotes, marquee segments) lives in `site.config.ts` next to a `// CUSTOMIZE` marker. A forker never
  opens `components/` to change words. `data/*.ts` stay thin re-exports.
- **Motion respects `prefers-reduced-motion`.** The spiral is removed and the marquee is frozen for
  users who ask for less motion. This is a build gate, not a nicety.
- **Static export intact.** `output: export` still prerenders **every** route, now including
  `/web-projects/[slug]` via `generateStaticParams` + `dynamicParams = false` (same pattern as
  `/writing/[slug]`). The V7 Cloudflare pipeline (`public/_redirects`, `public/_headers`) is untouched.
- **Tailwind v4 is CSS-first.** New styles are plain CSS in `app/globals.css` using existing
  `@theme` tokens (`--color-cyan`, `--color-red`, `--color-yellow`, `--font-sans`). No
  `tailwind.config.js`, no new design tokens unless a tweak truly needs one.
- **No new dependencies.** The spiral is hand-rolled SVG (`<textPath>` on a generated spiral path);
  the marquee is CSS `writing-mode` + a `transform` loop. No animation or carousel libraries.
- Verify each stage with `tsc --noEmit` + `eslint .` + `next build` (export). Confirm axe stays at 0,
  no horizontal scroll at 1440 / 768 / 375, no console errors, reduced-motion honored. Don't
  commit/push unless Charlie asks.

---

## Stage 1 — Wire the `/writing` page copy into `site.config.ts`

The one inner page V9 missed. Make it read from config exactly like `design` / `gear` / `photography`
/ `webProjects` do, so all editable inner-page copy finally lives in one place.

- **Add a `writing` block to `sections.pages` in `site.config.ts`**, mirroring the shape of the other
  four page blocks, with a `// CUSTOMIZE` note:
  - `kicker: "Writing"`
  - `heading: "Essays & stories"`
  - `lede: "Long-form pieces — arguments I've talked myself into, and one I made up entirely."`
  - `metaDescription: "Essays and stories by Charlie Ramus — on optimization, machine learning, morality, and the occasional lighthouse."`
  Move the strings **character-for-character** from `app/writing/page.tsx` — no rewording.
- **Wire `app/writing/page.tsx`** to read `sections.pages.writing.{kicker,heading,lede}` for the
  header, and `sections.pages.writing.metaDescription` for the `metadata.description`. Drop the
  hardcoded literals. Keep the `<h1>` using the config `heading` (with the `&amp;` rendered from
  `Essays & stories`).
- **No manifest change.** `data/writing.ts` (the essay list) is untouched — this stage is page copy
  only. The label stays "Essays & stories"; there is no essay-vs-story tagging in this log.

Verify: `tsc --noEmit`, `eslint .`, `next build` (export) all green; `/writing` renders the same
kicker / heading / lede as before; editing the new config values changes the page.

# Stage 1 Report

_Pending — fill after implementing Stage 1._

---

## Stage 2 — `/design` brand & layout: 2 slides per project + expand

Lighten the design page. Show a 2-slide teaser per project with a toggle to reveal the rest; keep the
full set available to the lightbox.

- **`DesignGallery` (`components/design-gallery.tsx`)** gains a module constant
  `const PREVIEW_COUNT = 2;` and reads an optional per-project override.
- **Add an optional `previewCount?: number` field** to the `DesignProject` type in `site.config.ts`
  (documented with a `// CUSTOMIZE` note: "how many slides show before 'Show all'; default 2"). Leave
  it unset on the three current projects so they default to 2.
- **Per project, render only the first `previewCount` slides by default.** Add a per-project
  `useState` (or a keyed set) tracking expanded state and a **"Show all N →" / "Show fewer"** toggle
  button below the grid. Hide the toggle entirely when a project has `<= previewCount` slides
  (photography-UI has 4, so it shows the toggle; all three do).
- **Lightbox correctness (do not break this).** The flattened `items` list and each slide's global
  `index` are already computed over **all** slides via the running `counter`, independent of what is
  visually shown. Keep it that way: clicking the 2nd visible slide of the 2nd project must still open
  the correct global index, and ← / → must step through every slide of every project, collapsed or not.
- **Motion.** The reveal is a simple height/opacity change; keep it instant (or a short transition)
  and ensure it is not a `prefers-reduced-motion` violation. Toggle button is a real `<button>` with
  an `aria-expanded` reflecting state.

Verify: `tsc --noEmit`, `eslint .`, `next build` green; `/design` shows 2 slides per project by
default; toggling reveals/collapses the rest; the lightbox opens the right slide and steps the full
set in both states; no horizontal scroll at 375.

# Stage 2 Report

_Pending — fill after implementing Stage 2._

---

## Stage 3 — Click-in web-project detail pages (`/web-projects/[slug]`)

Give each web project a real page to go deep on, data-driven from `site.config.ts`, reusing the
proven `/writing/[slug]` static-params pattern.

- **Extend `WebProject` in `site.config.ts`** with:
  - `slug: string` — stable, URL-safe, required (the current `"charlieramus.comv2"` title has a dot,
    so slugs are explicit, not derived). Add a `// CUSTOMIZE` note that `slug` is the route segment.
  - Optional long-form fields for the detail body, e.g. `problem?: string`, `approach?: string`,
    `outcome?: string`, and `gallery?: string[]` (screenshot paths in `/public`). All optional — a
    project with none still renders a valid page from its existing fields.
  - Fill `slug` on all six existing projects (`ostiara`, `mylifeinarepo`, `querryn`, `vaultdna`,
    `charlieramus-com`, `backtrace`). Long-form fields can start empty and be authored later.
- **New route `app/web-projects/[slug]/page.tsx`**, mirroring `app/writing/[slug]/page.tsx`:
  - `generateStaticParams()` returns every `webProjects[].slug`; `export const dynamicParams = false;`
    so unknown slugs 404 and export stays fully static.
  - `generateMetadata` builds title/description/canonical from the resolved project.
  - Render header (title, date, tags, external link if `href`), the `description`, then any of
    `problem` / `approach` / `outcome` present, then a `gallery` grid (reuse the design/lightbox
    treatment or a simple `next/image` grid — implementer's call, keep it consistent with the site).
  - Wrap in `SiteHeader` / `SiteFooter` like the other inner pages; add JSON-LD if it is cheap
    (optional, match `/writing/[slug]` if done).
- **Make `/web-projects` rows link in.** In `app/web-projects/page.tsx`, wrap each row's title (or the
  row) in a `<Link href={`/web-projects/${p.slug}`} prefetch={false}>` to the detail page. Keep the
  existing external `href` ("View on GitHub ↗") as a **secondary** link inside the row — the row-click
  goes to the case study, the labeled link goes off-site. Ensure the two are not nested `<a>`s.
- **Homepage untouched.** `components/work.tsx` bands stay as-is this stage (their visuals are
  placeholder until a later screenshot pass); the "See all my work ↗" link still points to
  `/web-projects`. Wiring bands to `[slug]` is out of scope for V10.
- **Add a `webProjectBySlug()` resolver** if convenient (in `data/previews.ts` or alongside
  `webProjects`) so both the route and any linker resolve a project the same way; a missing slug
  degrades gracefully (skip / 404 via `dynamicParams`).

Verify: `tsc --noEmit`, `eslint .`, `next build` (export) prerenders `/web-projects` **and** one
`/web-projects/<slug>` per project (paste the route count); clicking a row opens its detail page; the
external link still works and opens in a new tab; unknown slug 404s; no horizontal scroll at 375.

# Stage 3 Report

_Pending — fill after implementing Stage 3._

---

## Stage 4 — Spiral quote text on `/writing`

Decorative Archimedean-spiral text in the outer margins of the writing surface, rotating slowly,
editable in config, desktop-only, gone under reduced motion.

- **New `writingSpirals` array in `site.config.ts`** — quotes pulled from Charlie's essays, each an
  object so size / side / bleed can be tuned, with a `// CUSTOMIZE` note. Seed with 2–4 of the
  strongest lines (confirm final picks with Charlie), candidates:
  - "A portfolio is not proof of what you built. It is proof you noticed."
  - "Got tired of uneven things. The city. People wanting more than they need."
  - (pull one more from `when-bigger-means-more-biased.mdx` / `the-hobby-hexagon-is-a-trap.mdx`)
  Shape suggestion: `{ text: string; side: "left" | "right"; size?: "sm" | "md" | "lg" }`.
- **New reusable primitive `components/spiral-text.tsx`** — renders one quote as SVG `<text>` on a
  `<textPath>` following a generated Archimedean spiral path (`r = a + bθ`), à la the reference image.
  Slow CSS rotation of the whole `<svg>`. Low opacity, `aria-hidden`, `pointer-events: none`,
  decorative only.
- **Place on the writing surface** — prefer the **`/writing` index** (a sparse list = maximum
  whitespace = lowest readability risk). Position spirals in the **outer page margins** with a heavy
  white barrier to the centered content column; allow them to bleed half off-screen at varied sizes.
  If also placed on `/writing/[slug]` article pages, keep it lighter — never crowd the prose.
- **Readability guardrails (build gates):**
  - Hidden below a wide breakpoint (e.g. `min-width: 1200px` to render) — on tablet/mobile the margin
    does not exist, so the spiral must be **removed**, not shrunk.
  - Fully removed under `prefers-reduced-motion` (no rotation, no spiral).
  - Never overlaps the readable column at any viewport; never causes horizontal scroll.
- **CSS** in `app/globals.css` (`@keyframes` for the rotation, reusing the existing motion patterns);
  no new tokens, no new deps.

Verify: `tsc --noEmit`, `eslint .`, `next build` green; `/writing` shows rotating spiral quotes in the
margins on a wide viewport; they disappear at 768 / 375 and under reduced-motion; no horizontal
scroll; prose stays fully legible; editing `writingSpirals` changes the quotes.

# Stage 4 Report

_Pending — fill after implementing Stage 4._

---

## Stage 5 — Vertical `.ART.CREATE.` marquee on `/photography`

A moving vertical rail in the gallery gutter — bold Inter, one segment each in turquoise / red /
yellow, each with its own editable tagline.

- **New `marquees` array in `site.config.ts`** — `{ color: "cyan" | "red" | "yellow"; text: string }`
  per segment, with a `// CUSTOMIZE` note ("play with the words and colors"). Seed:
  - `{ color: "cyan",   text: ".ART.CREATE." }`
  - `{ color: "red",    text: ".BUILD.SHIP." }`
  - `{ color: "yellow", text: ".NOTICE.MAKE." }`
  (final taglines are Charlie's call — these are placeholders to iterate on.)
- **New component `components/vertical-marquee.tsx`** — renders each segment as vertical text
  (`writing-mode: vertical-rl`), bold `--font-sans` (Inter), colored from the token that matches
  `color` (`--color-cyan` / `--color-red` / `--color-yellow`). Animate a seamless vertical loop by
  duplicating each segment's content and translating on the Y axis (`@keyframes` + `transform`).
- **Place on `/photography`** in a gutter/rail position that fits the gallery layout — confirm it does
  not collide with the masonry grid or the header, and does not introduce horizontal scroll. Left or
  right gutter, or a thin vertical band; implementer's call within the existing `.gallery-page` frame.
- **Motion & a11y:**
  - Frozen (static text, no translate) under `prefers-reduced-motion`.
  - `aria-hidden` if purely decorative; `pointer-events: none` so it never blocks gallery clicks.
  - On narrow viewports where the gutter collapses, hide the rail rather than overlapping content.
- **CSS** in `app/globals.css`; reuse existing color/font tokens; no new deps.

Verify: `tsc --noEmit`, `eslint .`, `next build` green; `/photography` shows the moving vertical
marquee in the site's turquoise / red / yellow; it freezes under reduced-motion; it never overlaps the
grid or causes horizontal scroll at 1440 / 768 / 375; editing `marquees` changes text and colors.

# Stage 5 Report

_Pending — fill after implementing Stage 5._

---

## Stage 6 — Coherence + visual sign-off (the gate)

The additive-feature equivalent of V9's Stage 4. Prove the five tweaks land together cleanly and
nothing regressed.

- **Full build gate.** `tsc --noEmit`, `eslint .`, `next build` (export) all green; **every** route
  prerenders, including each new `/web-projects/[slug]`. Paste the route list + count.
- **Config-is-the-surface check.** Confirm every new editable value (writing page copy, web-project
  `slug` + long-form fields, `writingSpirals`, `marquees`, design `previewCount`) is in
  `site.config.ts` behind a `// CUSTOMIZE` marker, and that changing each one visibly changes the site
  without touching `components/`.
- **Motion sweep.** With `prefers-reduced-motion: reduce`: the `/writing` spiral is gone and the
  `/photography` marquee is frozen. Without it: both animate smoothly.
- **Responsive sweep at 1440 / 768 / 375** on `/`, `/writing`, `/writing/<slug>`, `/design`,
  `/photography`, `/web-projects`, `/web-projects/<slug>`: no horizontal scroll, no overlap of
  decoration with readable content, spiral hidden below the wide breakpoint, marquee hidden where the
  gutter collapses.
- **axe = 0** on every route (new detail pages included); no console errors.
- **Coherence check.** Spiral only on `/writing`, marquee only on `/photography` — neither page
  carries both.

Verify: paste the build route list, the axe result per route, and confirm the reduced-motion +
responsive sweeps. Report any deferrals in `MANUAL-TODO.md`.

# Stage 6 Report

_Pending — fill after implementing Stage 6._

---

# After These Stages
- **Work has depth.** Web projects are no longer a flat list — each has a real, shareable URL
  (`/web-projects/<slug>`) with room to tell the story, all authored from `site.config.ts`.
- **The site has character.** The `/writing` spiral and the `/photography` marquee give two flagship
  surfaces a signature decorative idea each, both fully config-driven and motion-safe.
- **The one-file promise holds.** Every V10 addition is edited from `site.config.ts` — page copy,
  case-study fields, spiral quotes, marquee taglines, slide counts. A forker still never opens
  `components/`.
- **Deferred on purpose (see `MANUAL-TODO.md`):** wiring the homepage `work.tsx` bands to the new
  `[slug]` pages (waits on the screenshot pass); design-project case studies (kept as gallery this
  log); any essay-vs-story tagging in the writing manifest.
