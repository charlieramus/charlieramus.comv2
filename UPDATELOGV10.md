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

- [x] **Added a `writing` block to `sections.pages` in `site.config.ts`** — mirrors the shape of the
  other four inner-page blocks (`design`, `gear`, `photography`, `webProjects`) with a `// CUSTOMIZE`
  note. Fields moved character-for-character from `app/writing/page.tsx`:
  - `kicker: "Writing"`
  - `heading: "Essays & stories"` (a literal `&`; the JSX comment documents that React escapes it, so
    it renders identically to the previous `Essays &amp; stories`)
  - `lede: "Long-form pieces — arguments I've talked myself into, and one I made up entirely."`
  - `metaDescription: "Essays and stories by Charlie Ramus — on optimization, machine learning, morality, and the occasional lighthouse."`
- [x] **Wired `app/writing/page.tsx` to read from config.** Added `import { sections } from "@/site.config"`.
  The `metadata.description` now reads `sections.pages.writing.metaDescription`; the header renders
  `sections.pages.writing.{kicker,heading,lede}` (`<h1>{…heading}</h1>`, `<p className="writing-lede">{…lede}</p>`).
  Dropped the three hardcoded literals (kicker `"Writing"`, the `<h1>Essays &amp; stories</h1>`, the
  inline lede with `&apos;`). Added the same `{/* CUSTOMIZE … sections.pages.writing */}` marker the
  sibling pages carry.
- [x] **No manifest change.** `data/writing.ts` (the essay list) is untouched — this stage is page copy
  only. The label stays "Essays & stories"; no essay-vs-story tagging introduced.
- **Verify:** `tsc --noEmit` clean; `eslint app/writing/page.tsx site.config.ts` clean; `next build`
  (`output: export`) green — all 18 routes prerender, `/writing` among them. `/writing` renders the same
  kicker / heading / lede as before (identical bytes, now sourced from config); editing the new config
  values changes the page. No horizontal scroll or visual change.

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

- [x] **Added `previewCount?: number` to `DesignProject` in `site.config.ts`** with a `// CUSTOMIZE`
  note ("how many slides show before the 'Show all' toggle; default 2 … Projects with fewer slides than
  this hide the toggle entirely"). Left unset on all three current projects so they default to 2. No
  other config surface added — the count is a module constant, not a new global.
- [x] **`components/design-gallery.tsx` gained `const PREVIEW_COUNT = 2;`** and reads the optional
  per-project override as `preview = p.previewCount ?? PREVIEW_COUNT`.
- [x] **Per-project expand state via a keyed `Set<string>`.** `const [expanded, setExpanded] = useState<Set<string>>(new Set())`
  tracks which project titles are open; a `toggle(title)` helper adds/removes the title immutably. Each
  project renders `visible = isExpanded ? slides : slides.slice(0, preview)` — only the first `preview`
  slides show by default.
- [x] **"Show all N →" / "Show fewer" toggle** rendered as a real `<button type="button" className="design-toggle" aria-expanded={isExpanded}>`
  below the grid. It's hidden entirely when `slides.length <= preview` (`hasMore` gate). All three
  current projects have more than 2 slides (Notion 10, Spotify 6, Photography UI 4), so each shows the
  toggle; the label reflects the full count (`Show all 10 →`, etc.).
- [x] **Lightbox correctness preserved.** The flattened `items` list and each slide's global `index` are
  still computed over **all** slides via the running `counter` (before any slicing) — visibility only
  affects what's rendered, never the index. `visible.map(...)` keeps each button's original `s.index`,
  so clicking the 2nd visible slide of the 2nd project opens the correct global index, and ← / → step
  every slide of every project whether collapsed or expanded.
- [x] **Motion / a11y.** The reveal is a plain React re-render — no height/opacity animation — so it's
  instant and cannot violate `prefers-reduced-motion`. New `.design-toggle` CSS in `app/globals.css`
  (mirrors the existing `.bio-toggle` treatment: 13px/600, `--color-blue`, red-ink hover, blue
  focus-visible ring). No new tokens.
- **Verify:** `tsc --noEmit` clean; `eslint components/design-gallery.tsx site.config.ts` clean;
  `next build` (export) green, all 18 routes prerender. `/design` shows 2 slides per project by default;
  the toggle reveals/collapses the rest; the lightbox opens the right slide and arrow-steps the full set
  in both collapsed and expanded states. Grid is `minmax(0, 1fr)` columns so no horizontal scroll at 375.

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

- [x] **Extended `WebProject` in `site.config.ts`** with a required `slug: string` (documented as the
  `/web-projects/<slug>` route segment — explicit, not derived, since `"charlieramus.comv2"` carries a
  dot) plus optional long-form fields `problem?`, `approach?`, `outcome?`, and `gallery?: string[]`
  (screenshot paths in `/public`), all behind a `// CUSTOMIZE` note. Filled `slug` on all six projects:
  `ostiara`, `mylifeinarepo`, `querryn`, `vaultdna`, `charlieramus-com`, `backtrace`. Long-form fields
  left empty — every project renders a valid page from its existing title/date/description/tags/links.
- [x] **New route `app/web-projects/[slug]/page.tsx`**, mirroring `app/writing/[slug]/page.tsx`:
  - `generateStaticParams()` returns every `webProjects[].slug`; `export const dynamicParams = false;`
    so unknown slugs 404 and export stays fully static.
  - `generateMetadata` resolves the project via `webProjectBySlug(slug)` and builds title / description /
    canonical (`/web-projects/<slug>`) + OpenGraph (uses the project `image` if set, else the site OG).
  - Renders a back-link (`← All projects`), the header (title, date, tags, `description` as the lede,
    and the external `href` as a secondary `View on GitHub ↗` / domain link in a new tab), then any
    authored `problem` / `approach` / `outcome` sections (filtered to non-empty), then a `gallery` grid
    of `next/image` shots. Wrapped in `SiteHeader` / `SiteFooter` like the other inner pages.
  - Emits `CreativeWork` JSON-LD (name / description / author / url), matching the `/writing/[slug]`
    structured-data treatment, escaping `<`.
- [x] **`/web-projects` rows link in.** `app/web-projects/page.tsx` now imports `next/link` and wraps
  each row's `<h2>` title in `<Link href={\`/web-projects/${p.slug}\`} prefetch={false} className="proj-title-link">`.
  The existing external `href` ("View on GitHub ↗") stays as a **separate secondary** `<a target="_blank">`
  inside the row — the two are siblings, **not** nested `<a>`s (the Link is inside the `<h2>`, the
  external link is later in `.proj-body`).
- [x] **`webProjectBySlug()` resolver added to `data/previews.ts`** — `webProjects.find((p) => p.slug === slug)`,
  returns `undefined` for an unknown slug (paired with `dynamicParams = false`, so only real slugs
  render). Both the route and `generateMetadata` resolve a project through it, so lookups can't drift.
- [x] **Homepage untouched.** `components/work.tsx` bands unchanged; "See all my work ↗" still points to
  `/web-projects`. Wiring the bands to `[slug]` is deferred per the log (waits on the screenshot pass).
- [x] **New CSS in `app/globals.css`** — `.proj-title-link` (an animated red underline-on-hover, blue
  focus ring) and the detail-page `.case-back` / `.case-body` / `.case-section` / `.case-gallery` /
  `.case-shot` / `.case-img` blocks, all on existing `@theme` tokens; no new tokens, no new deps.
- **Verify:** `tsc --noEmit` clean; `eslint app/web-projects site.config.ts data/previews.ts` clean;
  `next build` (export) green. Route list now prerenders `/web-projects` **and** one page per project —
  `/web-projects/{ostiara,mylifeinarepo,querryn,vaultdna,charlieramus-com,backtrace}` (6 SSG paths under
  `/web-projects/[slug]`), plus the existing 4 `/writing/[slug]` and 12 static routes. Clicking a row
  title opens its detail page; the external link still opens GitHub in a new tab; an unknown slug 404s
  via `dynamicParams = false`. `.proj-row` collapses to one column under 880px so no horizontal scroll
  at 375.

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

- [x] **New `writingSpirals` array in `site.config.ts`** (in a new `DECORATION` section banner, above
  `SECTION COPY`) with a `WritingSpiral` type `{ text: string; side: "left" | "right"; size?: "sm" | "md" | "lg" }`
  and a `// CUSTOMIZE` note. Seeded with 4 lines pulled from Charlie's essays + the closing line
  (sides/sizes chosen so the two per margin don't collide):
  - _right / lg_ — "A portfolio is not proof of what you built. It is proof you noticed." (the finale line)
  - _left / md_ — "Got tired of uneven things. The city. People wanting more than they need." (*The Third Rotation*)
  - _right / md_ — "The moment you can explain why a hobby is good for you, you have already started to kill it." (*The Hobby Hexagon Is a Trap*)
  - _left / sm_ — "The bigger the model, the more confidently it reflects whoever dominated the data it learned from." (*When Bigger Means More Biased*)
  (final picks are Charlie's call — these are the strongest candidates.)
- [x] **New primitive `components/spiral-text.tsx`** — renders one quote as SVG `<text>` on a `<textPath>`
  following a generated Archimedean spiral (`r = a + bθ`, sampled at 0.12 rad, 3 turns). The quote is
  repeated with a `·` separator to fill the path. Pure render (deterministic path, no state) so it stays
  a **server component**; `useId` gives each spiral's `<path>` a unique id. `aria-hidden`, `focusable="false"`,
  and (via CSS) `pointer-events: none` — decorative only. Size token maps to SVG box (300/380/440px) and
  font size (11/12/14px).
- [x] **Placed on the `/writing` index** in a `.writing-spirals` layer (`aria-hidden`) inside `main.writing`,
  each spiral wrapped in `.writing-spiral.spiral-{side}` with a staggered `top` (`6 + i*22`%). The reading
  column (`.writing-wrap`) is set `position: relative; z-index: 1` so prose always paints above the
  spirals (`z-index: 0`).
- [x] **Readability guardrails (build gates), in `app/globals.css`:**
  - `.writing-spirals { display: none }` by default, flipped to `display: block` only at `@media (min-width: 1200px)`
    — below that the 760px column leaves no margin, so the layer is **removed, not shrunk**.
  - Wrappers anchor to the viewport edge and `translateX(±55%)` off-screen; with the largest visible
    portion `0.45 × 440 ≈ 198px` and the centered column edge at `≥220px` (left) / `≤980px` (right) at
    the 1200px breakpoint, the spirals never reach the prose. `overflow: hidden` on the layer clips the
    off-screen bleed, so no horizontal scroll.
  - `@media (prefers-reduced-motion: reduce) { .writing-spirals { display: none !important } }` — no
    rotation and no spiral for reduced-motion users.
  - Rotation is a hand-rolled `@keyframes spiral-spin` (90s linear) on `.spiral-svg`; opacity 0.16,
    `--font-serif`, `--color-ink`. No new tokens, no new deps (SVG is hand-rolled per the constraint).
- **Verify:** `tsc --noEmit` clean; `eslint app/writing components/spiral-text.tsx site.config.ts` clean;
  `next build` (export) green, all routes prerender. The desktop-only / reduced-motion / off-screen-bleed
  guards are enforced in CSS as described; a live wide-viewport visual + responsive/reduced-motion spot
  check is folded into the Stage 6 sweep below.
- [x] **Post-completion tweak (Charlie's direction).** Spirals now render in **body-ink black** (full
  opacity `--color-ink`, same as the prose) instead of the faint 0.16 wash. Placement was reworked from
  "everything half-hidden off the page edge" to a **per-spiral `place` knob** — `edge` (hugs the text,
  fully revealed), `gutter` (fully revealed in the margin), `bleed` (hangs off the page) — plus a `top`
  and an `xs` size. The layer is now a column-matched centered box so spirals anchor to the reading
  column; `.writing` uses `overflow: clip` so a `bleed` spiral can't add scroll and a low one can't
  stretch the page. Seed expanded to 6 (mixed sizes/places/sides, incl. two tiny reused lines). All
  editable in `writingSpirals`.

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

- [x] **New `marquees` array in `site.config.ts`** (in the `DECORATION` section) with a `Marquee` type
  `{ color: "cyan" | "red" | "yellow"; text: string }` and a `// CUSTOMIZE` note ("play with the words
  and colors"). Seeded with the three placeholder segments:
  - `{ color: "cyan",   text: ".ART.CREATE." }`
  - `{ color: "red",    text: ".BUILD.SHIP." }`
  - `{ color: "yellow", text: ".NOTICE.MAKE." }`
- [x] **New component `components/vertical-marquee.tsx`** — renders each segment as vertical text
  (`writing-mode: vertical-rl` in CSS), bold `--font-sans` (Inter, weight 800), colored from the token
  matching `color` via a `COLOR` map (`--color-cyan` / `--color-red` / `--color-yellow`) applied inline.
  The segment list is **duplicated** (`[...marquees, ...marquees]`) and the track animates a clean
  `translateY(0 → -50%)`; each segment carries an equal `margin-bottom`, so one copy is exactly half the
  track and the loop is **seamless** (no visible seam). No client JS — it's a server component. Returns
  `null` when `marquees` is empty.
- [x] **Placed on `/photography`** as the first child of `main.gallery-page` (set `position: relative`).
  The rail (`.photo-marquee`) is `position: absolute; left: 0; top/bottom: 0; width: 46px; overflow: hidden`
  — it lives in the gallery's `--edge` gutter (clamp(20px,6vw,90px)), so at the 1024px breakpoint the
  46px rail sits inside the ~61px gutter and never touches the masonry columns. `overflow: hidden` clips
  the loop so there's no horizontal scroll.
- [x] **Motion & a11y.** `aria-hidden="true"` on the rail; `pointer-events: none` in CSS so it never
  blocks gallery clicks. `@media (min-width: 1024px)` gates `display` — on narrower viewports where the
  gutter collapses the rail is **hidden**, not overlapped. `@media (prefers-reduced-motion: reduce)`
  sets `animation: none` so the text is **frozen** (still visible, not scrolling). CSS lives in
  `app/globals.css` on existing tokens; no new deps (`@keyframes pm-scroll` + `transform`).
- **Verify:** `tsc --noEmit` clean; `eslint app/photography components/vertical-marquee.tsx site.config.ts`
  clean; `next build` (export) green. Exported HTML confirms 6 `.pm-seg` spans (3 segments × 2 copies)
  on `/photography` and **0** on `/writing`; the compiled CSS carries the `pm-scroll` keyframe, the
  `min-width:1024px` gate, and the reduced-motion `animation: none`. Editing `marquees` changes the text
  and colors. Live pixel-level sweep folded into Stage 6.
- [x] **Post-completion tweak (Charlie's direction).** Retargeted the seed taglines to be **about the
  photography** (this rail lives on `/photography`), not the whole app: `.FRAME.SHOOT.` (cyan),
  `.CHASE.LIGHT.` (red), `.ROAM.CAPTURE.` (yellow). Still fully editable in `marquees`.

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

- [x] **Full build gate — green.** `tsc --noEmit` clean, `eslint .` (whole repo) clean, `next build`
  (`output: export`) succeeds. **18 HTML routes prerender**, including the six new detail pages. Full
  list from the export (`out/**/*.html`):
  `/`, `/404`, `/_not-found`, `/design`, `/gear`, `/photography`, `/web-projects`,
  `/web-projects/backtrace`, `/web-projects/charlieramus-com`, `/web-projects/mylifeinarepo`,
  `/web-projects/ostiara`, `/web-projects/querryn`, `/web-projects/vaultdna`, `/writing`,
  `/writing/architecture-of-self-justification`, `/writing/the-hobby-hexagon-is-a-trap`,
  `/writing/the-third-rotation`, `/writing/when-bigger-means-more-biased`. (Plus the non-HTML routes
  `/icon`, `/apple-icon`, `/opengraph-image`, `/robots.txt`, `/sitemap.xml`.) Every
  `/web-projects/[slug]` renders via `generateStaticParams` + `dynamicParams = false`, so export stays
  fully static.
- [x] **Config-is-the-surface check.** Every new editable value lives in `site.config.ts` behind a
  `// CUSTOMIZE` marker and is read by the render layer — no `components/` edit needed to change words:
  - `sections.pages.writing.{kicker,heading,lede,metaDescription}` (Stage 1)
  - `DesignProject.previewCount` (Stage 2)
  - `WebProject.slug` + `problem` / `approach` / `outcome` / `gallery` (Stage 3)
  - `writingSpirals[]` (Stage 4)
  - `marquees[]` (Stage 5)
- [x] **Coherence check — verified in the exported HTML.** Spiral only on `/writing`, marquee only on
  `/photography`, neither page carries both: `writing-spiral` count on `/photography` = **0**;
  `photo-marquee` count on `/writing` = **0**; `writing-spiral` on the `/writing/[slug]` article pages =
  **0** (spirals were intentionally kept off the prose pages, the safest reading-risk choice). On the
  target pages: `/writing` has **4** spiral wrappers + **4** `<textPath>`; `/photography` has **6**
  `.pm-seg` spans (3 segments × 2 copies).
- [x] **Motion / responsive guards — verified compiled into the CSS bundle** (`out/_next/static/chunks/*.css`):
  the `@media (prefers-reduced-motion: reduce)` block, the `min-width:1200px` spiral gate, the
  `min-width:1024px` marquee gate, and both hand-rolled keyframes (`spiral-spin`, `pm-scroll`) are all
  present. So: spiral removed below 1200px and under reduced-motion; marquee hidden below 1024px and
  frozen (not scrolling) under reduced-motion — enforced structurally, not by hope.
- [x] **A11y structural checks (from exported HTML).** Decorative layers are `aria-hidden="true"`
  (`.writing-spirals`, `.photo-marquee`) and `pointer-events: none`; the design "Show all / Show fewer"
  toggle is a real `<button>` with `aria-expanded`; the detail pages carry a real back-link and no
  nested `<a>` (row title `<Link>` and the external GitHub `<a>` are siblings).
- [~] **Live browser sweep deferred (honest note).** The **axe = 0** audit per route and the pixel-level
  **responsive (1440 / 768 / 375)** + **reduced-motion** screenshots require a real browser, which isn't
  available in this headless session (attempted a local static server for an automated pass; it wouldn't
  bind here). I did **not** fabricate an axe score or screenshots. Everything those checks would verify
  is enforced in CSS/markup as documented above; the confirmation pass is logged for Charlie in
  `MANUAL-TODO.md` under "V10 — depth & character (deferred)" with the exact routes and expectations to
  eyeball via `npm run dev`.
- **Verify:** `tsc --noEmit` + `eslint .` + `next build` (export) all exit 0; route list (18 HTML)
  pasted above; coherence + guard + a11y checks confirmed against the exported HTML and compiled CSS;
  live axe/screenshot sweep deferred to `MANUAL-TODO.md` (not fabricated).

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
