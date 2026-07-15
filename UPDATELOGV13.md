charlie

# UPDATELOG V13 — CASE STUDIES FOR EVERY PROJECT (content-only)
# Work on one stage at a time. Do NOT combine stages.

**First read `AGENTS.md`, `DESIGN-BRIEF.md`, `site.config.ts` (the WEB PROJECTS block), and
the V11 + V12 stage reports.** V11/V12 built the screenshot-forward case-study template at
`/web-projects/[slug]` and, by design, authored the full section ecosystem on **Ostiara only**
as the flagship reference. Every other project (`MyLifeInARepo`, `Querryn`, `VaultDNA`,
`charlieramus.comv2`, `Backtrace`) still renders a bare header-only page because its case-study
fields are unset.

**This log fills that in: give ALL six projects the same full ecosystem Ostiara has** — hero
shot, Overview facts, "What I worked on", "The Challenge", the flower-bulleted process, the two
square rows + mid shot, the NYT article, the wide shot, and the closing banner.

**A case study here is pure data in `site.config.ts` — no code.** The V11/V12 template already
renders every section conditionally; V13 only *populates* the fields. It touches **no**
component, page, or CSS file. If any stage feels like it needs a code change, stop — that's a
sign the template regressed and should be fixed separately, not here.

**Images and copy are placeholders on purpose (Charlie's call).** There are only two real web
screenshots in the repo (`/images/web/charlieramus-com.webp`, `/images/web/mylifeinarepo.webp`).
Every project reuses those as **placeholder** shots, and the prose is a **draft distilled from
each project's existing `description`** — both clearly `// CUSTOMIZE`-marked so Charlie swaps in
real screenshots and final copy later. The point of V13 is that every project *renders the full
page now*, all editable from one file.

## Decisions (agreed with Charlie, 2026-07-14)
- **Every project gets every section, mirroring Ostiara's shape** (see `webProjects[0]` in
  `site.config.ts` as the exact template to copy): `heroShot`, `overview`, `worked`,
  `challenge`, `process[]`, `squares`, `midShot`, `squares2`, `article`, `wideShot`, `banner`.
- **Placeholder images, reusing the two existing shots.** Use a project's own `image` as its
  `heroShot` when it has one (`mylifeinarepo`, `charlieramus-com`); otherwise reuse one of the
  two `/images/web/*.webp` shots. Vary between the two across a project's slots for a little
  visual variety. **Never fabricate image files.** Mark every image `// CUSTOMIZE` PLACEHOLDER.
- **Draft copy distilled from real facts, not invented.** `worked` / `challenge` / `article`
  are rewrites of what each project's `description` already states (each description already
  names "the hard part"). `process` steps are a plausible **draft** build sequence — mark them
  clearly as draft for Charlie to correct. Charlie authorized placeholder text; keep it honest
  to the description rather than making up new capabilities.
- **`overview`:** set `role` (e.g. "Solo build") and `status` per project; leave `timeline` /
  `stack` / `link` unset so they fall back to `date` / `tags` / `href` (same as Ostiara).
- **Out of scope:** the `/web-projects` list page (its row thumbnails / Motif placeholders stay
  as they are — this log is the detail-page ecosystem only); real screenshot capture; final
  copy. No schema changes (the schema is frozen from V11/V12).
- **Content-only feature, five stages:** one authoring stage per project (the two thinnest
  paired), then a verify + coherence gate. No component/CSS/route changes in any stage.

## Hard constraints (carry over from V11/V12)
- **Data-only.** Every stage edits `site.config.ts` and nothing else (except the final stage,
  which may add a note to `MANUAL-TODO.md`). No `components/`, no `app/`, no `globals.css`.
- **Mirror Ostiara exactly in shape.** Same field names, same `// CUSTOMIZE` / PLACEHOLDER
  comment discipline, same use of fallbacks (`timeline`/`stack`/`link` omitted).
- **Every field stays optional + honest.** If a project genuinely shouldn't have a section
  (e.g. a banner line that would ring false), it's fine to omit that one field — "like Ostiara"
  means the full set by default, not a mandate to force a section that lies.
- **No new assets, no new deps, no new tokens.** Reuse the two existing shots.
- Verify each stage with `tsc --noEmit` + `eslint .` (or the repo's `npm run lint`) +
  `next build` (export). Confirm the project's page renders every authored section and no
  horizontal scroll at 375. Don't commit/push unless Charlie asks (`/complete-updatelog`
  handles the `stage<N>v13` commits when run).

---

## Stage 1 — MyLifeInARepo

The richest of the remaining projects (a life-tracking git-repo system with a finance module).
It already has its own screenshot (`/images/web/mylifeinarepo.webp`) to use as the hero.

```
In site.config.ts, on the `mylifeinarepo` entry, add the full case-study field set mirroring
the Ostiara entry's shape (webProjects[0]). Draw all copy from its existing `description`:

1. heroShot: "/images/web/mylifeinarepo.webp" (its own real shot). // CUSTOMIZE.
2. overview: { role: "Solo build", status: "Mostly done — occasional contributions" }.
   Leave timeline/stack/link to fall back to date/tags/href.
3. worked: a freeform paragraph distilled from the description — the git-repo-of-daily-markdown
   architecture, the Next.js dashboard, the financial module (net worth, budgeting, cash-flow
   forecasting), the bank-statement import pipeline, the Monarch-style categorization engine.
4. challenge: the hard part the description already names — turning freeform daily markdown notes
   into reliable structured data.
5. process: 4-6 DRAFT bullets ({ title, detail? }) tracing a plausible build order (e.g. daily
   markdown schema → parser to structured data → dashboard → finance module → statement import →
   categorization engine). Mark the array with a // CUSTOMIZE "draft — refine" note.
6. squares / midShot / squares2 / wideShot: PLACEHOLDER images reusing the two existing
   /images/web shots (vary which one per slot). Each // CUSTOMIZE PLACEHOLDER.
7. article: { paragraphs: [2-3 drafted from the description], pullQuote: one line about turning
   freeform notes into reliable data }. Marked // CUSTOMIZE draft.
8. banner: { image: a placeholder /images/web shot, text: a drafted closing line }. // CUSTOMIZE.

Verify: tsc --noEmit; npm run lint; next build (export) green. /web-projects/mylifeinarepo now
renders hero → cards → process → squares → midShot → squares2 → article → wideShot → banner, in
order, no empty sections, no horizontal scroll at 375. Report which slots are placeholder images.
```

## Stage 1 Report

- [x] Authored the full case-study field set on the `mylifeinarepo` entry in
  `site.config.ts`, mirroring `webProjects[0]` (Ostiara) in shape and comment
  discipline. **Data-only** — no `components/`, `app/`, or CSS touched.
- [x] `heroShot` = `/images/web/mylifeinarepo.webp` — the project's own real shot
  (marked `// CUSTOMIZE`).
- [x] `overview` = `{ role: "Solo build", status: "Mostly done — occasional
  contributions" }`. `timeline` / `stack` / `link` omitted → fall back to
  `date` / `tags` / `href`; `href` is `""` so the Link row stays hidden (as intended).
- [x] `worked` + `challenge` — drafted straight from the existing `description`:
  the git-repo-of-daily-markdown architecture, the Next.js dashboard, the finance
  module (net worth / budgeting / cash-flow forecasting), the statement-import
  pipeline and the Monarch-style categorization engine; the challenge is the
  freeform-notes → reliable-structured-data problem the description already names.
- [x] `process` — 6 DRAFT bullets tracing a plausible build order (daily markdown
  schema → parser → dashboard → finance module → statement import → categorization
  engine), marked `// CUSTOMIZE (V13): DRAFT`.
- [x] `article` — 3 drafted paragraphs + a pull-quote about turning freeform notes
  into structured data, `// CUSTOMIZE` DRAFT.
- [x] `banner` — drafted closing line over a PLACEHOLDER image.
- **Placeholder image slots** (only the two real `/images/web/*.webp` shots exist,
  reused and varied per slot; every slot `// CUSTOMIZE PLACEHOLDER`):
  - `heroShot` → `mylifeinarepo.webp` (real, its own)
  - `squares` → `[charlieramus-com.webp, mylifeinarepo.webp]`
  - `midShot` → `charlieramus-com.webp`
  - `squares2` → `[mylifeinarepo.webp, charlieramus-com.webp]`
  - `wideShot` → `mylifeinarepo.webp`
  - `banner.image` → `charlieramus-com.webp`
- **Verify:** `tsc --noEmit` clean; `npm run lint` (eslint) clean; `next build`
  (export) green — `/web-projects/mylifeinarepo` prerenders in the `[slug]` group
  alongside the other five. The page now renders, in order: slim header → hero →
  Overview/What-I-worked-on/Challenge cards → process (flower-bulleted) → squares
  → midShot → squares2 → article → wideShot → banner → next-project. No empty
  sections; no schema/component change so the existing responsive/no-scroll rules
  carry over. **Issues:** none.

---

## Stage 2 — charlieramus.comv2 (this site)

The portfolio itself — it has its own screenshot (`/images/web/charlieramus-com.webp`) for the
hero and the most first-hand facts (you're editing it right now).

```
In site.config.ts, on the `charlieramus-com` entry, add the full case-study set mirroring
Ostiara, copy distilled from its description (Next.js + TypeScript + Tailwind portfolio, MDX
writing, masonry photography grid + fullscreen lightbox):

1. heroShot: "/images/web/charlieramus-com.webp" (its own shot). // CUSTOMIZE.
2. overview: { role: "Solo — design + build", status: "In progress" }. timeline/stack/link fall back.
3. worked: paragraph on the Next.js/TS/Tailwind rebuild, the site.config.ts one-file content
   model, MDX writing, the masonry photography grid + lightbox, the decorative flower system.
4. challenge: a truthful one — e.g. collapsing every editable value into one config file while
   keeping the design-system character (or the masonry/lightbox correctness). Keep it honest.
5. process: 4-6 DRAFT bullets (design system from the mockup → content model in site.config.ts →
   inner pages → photography pipeline → case-study pages → polish). // CUSTOMIZE draft note.
6. squares / midShot / squares2 / wideShot: PLACEHOLDER shots reusing the two existing images.
7. article: { paragraphs: [2-3 drafted], pullQuote: e.g. the finale line "A portfolio is not
   proof of what you built. It is proof you noticed." }. // CUSTOMIZE draft.
8. banner: { image: placeholder shot, text: drafted closing line }. // CUSTOMIZE.

Verify: tsc --noEmit; npm run lint; next build (export) green. /web-projects/charlieramus-com
renders the full ecosystem in order, no empty sections, no horizontal scroll at 375.
```

## Stage 2 Report

- [x] Authored the full case-study field set on the `charlieramus-com` entry in
  `site.config.ts`, mirroring the Ostiara shape. **Data-only** — nothing outside
  `site.config.ts`.
- [x] `heroShot` = `/images/web/charlieramus-com.webp` — the site's own real shot
  (`// CUSTOMIZE`).
- [x] `overview` = `{ role: "Solo — design + build", status: "In progress" }`;
  `timeline` / `stack` / `link` omitted → fall back to `date` / `tags` / `href`
  (`href` is the live URL, so the Link row shows "charlieramus.com ↗").
- [x] `worked` + `challenge` — drafted from the description: the Next.js/TS/Tailwind
  rebuild, the `site.config.ts` one-file content model, MDX writing, the masonry
  grid + lightbox, and the flower system; the challenge is the honest one —
  collapsing every editable value into one config file while keeping design-system
  character and masonry/lightbox correctness.
- [x] `process` — 6 DRAFT bullets (design system from the mockup → content model in
  `site.config.ts` → inner pages → photography pipeline → case-study pages →
  polish), `// CUSTOMIZE (V13): DRAFT`.
- [x] `article` — 3 drafted paragraphs + the finale-line pull-quote ("A portfolio
  is not proof of what you built. It is proof you noticed."), `// CUSTOMIZE` DRAFT.
- [x] `banner` — drafted closing line over a PLACEHOLDER image.
- **Placeholder image slots** (only the two real shots exist; varied per slot,
  each `// CUSTOMIZE PLACEHOLDER`):
  - `heroShot` → `charlieramus-com.webp` (real, its own)
  - `squares` → `[mylifeinarepo.webp, charlieramus-com.webp]`
  - `midShot` → `mylifeinarepo.webp`
  - `squares2` → `[charlieramus-com.webp, mylifeinarepo.webp]`
  - `wideShot` → `charlieramus-com.webp`
  - `banner.image` → `mylifeinarepo.webp`
- **Verify:** `tsc --noEmit` clean; `npm run lint` clean; `next build` (export)
  green — `/web-projects/charlieramus-com` prerenders in the `[slug]` group. The
  page renders the full ecosystem in order (hero → cards → process → squares →
  midShot → squares2 → article → wideShot → banner → next). No empty sections; no
  component/CSS change. **Issues:** none.

---

## Stage 3 — Backtrace

The wildfire-origin field instrument — a rich, technical description (bearings, angular
uncertainty, a probability heatmap). No own screenshot, so all images are placeholders.

```
In site.config.ts, on the `backtrace` entry, add the full case-study set mirroring Ostiara,
copy distilled from its description (walk-the-burn workflow, flagging fire-pattern indicators,
recording bearings, fusing them with per-bearing angular uncertainty into a probability field /
heatmap with credible regions — "not a single false-precision dot"):

1. heroShot: a PLACEHOLDER /images/web shot. // CUSTOMIZE PLACEHOLDER.
2. overview: { role: "Solo build", status: "Shipped" } (it has a public GitHub — link falls back
   to href). timeline/stack fall back.
3. worked: paragraph on the map-based burn walk, indicator flagging, bearing capture, the
   sensor-fusion math, and the heatmap output.
4. challenge: the honesty-of-uncertainty framing the description already carries — fusing noisy
   bearings into a credible probability field instead of a false-precision single point.
5. process: 4-6 DRAFT bullets (indicator taxonomy → map + bearing capture → angular-uncertainty
   model → bearing fusion → probability field / heatmap → PDF report generation). // CUSTOMIZE draft.
6. squares / midShot / squares2 / wideShot: PLACEHOLDER shots reusing the two existing images.
7. article: { paragraphs: [2-3 drafted from the description], pullQuote: a line about credible
   regions vs a false-precision dot }. // CUSTOMIZE draft.
8. banner: { image: placeholder shot, text: drafted closing line }. // CUSTOMIZE.

Verify: tsc --noEmit; npm run lint; next build (export) green. /web-projects/backtrace renders
the full ecosystem in order, no empty sections, no horizontal scroll at 375.
```

## Stage 3 Report

- [x] Authored the full case-study field set on the `backtrace` entry in
  `site.config.ts`, mirroring the Ostiara shape. **Data-only.**
- [x] `overview` = `{ role: "Solo build", status: "Shipped" }`; `timeline` /
  `stack` / `link` omitted → fall back to `date` / `tags` / `href`. `href` is the
  public GitHub repo, so the Link row shows "View on GitHub".
- [x] `worked` + `challenge` — drafted from the description: the walk-the-burn
  workflow, indicator flagging, bearing capture, the sensor-fusion math, the
  heatmap output and PDF report; the challenge is the honesty-of-uncertainty
  framing (fusing noisy bearings into a credible probability field, not a
  false-precision dot).
- [x] `process` — 6 DRAFT bullets (indicator taxonomy → map + bearing capture →
  angular-uncertainty model → bearing fusion → probability field / heatmap → PDF
  report generation), `// CUSTOMIZE (V13): DRAFT`.
- [x] `article` — 3 drafted paragraphs + a pull-quote on credible regions vs a
  false-precision dot, `// CUSTOMIZE` DRAFT.
- [x] `banner` — drafted closing line over a PLACEHOLDER image.
- **Placeholder image slots** — Backtrace has NO own screenshot, so every image is
  a PLACEHOLDER reusing the two real `/images/web/*.webp` shots (varied per slot,
  each `// CUSTOMIZE PLACEHOLDER`):
  - `heroShot` → `charlieramus-com.webp`
  - `squares` → `[mylifeinarepo.webp, charlieramus-com.webp]`
  - `midShot` → `mylifeinarepo.webp`
  - `squares2` → `[charlieramus-com.webp, mylifeinarepo.webp]`
  - `wideShot` → `charlieramus-com.webp`
  - `banner.image` → `mylifeinarepo.webp`
- **Verify:** `tsc --noEmit` clean; `npm run lint` clean; `next build` (export)
  green — `/web-projects/backtrace` prerenders in the `[slug]` group. Full
  ecosystem renders in order (hero → cards → process → squares → midShot →
  squares2 → article → wideShot → banner → next). No empty sections; no
  component/CSS change. **Issues:** none.

---

## Stage 4 — Querryn & VaultDNA (the two shorter builds)

The two thinnest descriptions, authored together in one stage. Both are single-purpose tools
with short descriptions — draft copy accordingly, no padding. Neither has its own screenshot.

```
In site.config.ts, author BOTH the `querryn` and `vaultdna` entries with the full case-study set
mirroring Ostiara. Keep each project's copy honest to its short description — do not inflate.

QUERRYN (Chrome extension rating source credibility for student papers; tiered domain-trust;
exports MLA/APA/Chicago/BibTeX; submitted to the Chrome Web Store):
1. heroShot: PLACEHOLDER shot. // CUSTOMIZE PLACEHOLDER.
2. overview: { role: "Solo build", status: "Submitted to the Chrome Web Store" }. fallbacks for
   timeline/stack; link falls back to href (empty → row hidden).
3. worked: the tiered domain-trust scoring + the multi-format citation exporter.
4. challenge: designing a credibility signal students can trust from a tiered domain system.
5. process: 3-5 DRAFT bullets (domain-trust tiers → credibility scoring UI → citation formatters
   → Chrome Web Store submission). // CUSTOMIZE draft.
6. squares / midShot / squares2 / wideShot: PLACEHOLDER shots (reuse the two existing images).
7. article: { paragraphs: [2 drafted], pullQuote: a line on source credibility }. // CUSTOMIZE draft.
8. banner: { image: placeholder, text: drafted line }. // CUSTOMIZE.

VAULTDNA (Obsidian plugin encoding a knowledge base into synthetic DNA sequences; real
DNA-storage constraints — homopolymer-run limits, GC-content biasing; ~1-2 week build):
1. heroShot: PLACEHOLDER shot. // CUSTOMIZE PLACEHOLDER.
2. overview: { role: "Solo build", status: "Shipped — quick build" }. fallbacks for the rest.
3. worked: the Obsidian plugin + the DNA-encoding scheme respecting homopolymer/GC constraints.
4. challenge: encoding arbitrary notes into DNA within real biological storage constraints.
5. process: 3-5 DRAFT bullets (encoding scheme → homopolymer/GC constraint handling → Obsidian
   plugin integration → round-trip decode). // CUSTOMIZE draft.
6. squares / midShot / squares2 / wideShot: PLACEHOLDER shots (reuse the two existing images).
7. article: { paragraphs: [2 drafted], pullQuote: a line on notes-as-DNA }. // CUSTOMIZE draft.
8. banner: { image: placeholder, text: drafted line }. // CUSTOMIZE.

Verify: tsc --noEmit; npm run lint; next build (export) green. Both /web-projects/querryn and
/web-projects/vaultdna render the full ecosystem in order, no empty sections, no horizontal
scroll at 375.
```

## Stage 4 Report

_Pending._

---

## Stage 5 — Coherence + verify (the gate)

Prove all six projects now render the full case-study ecosystem, nothing regressed, and log the
real-asset debt for Charlie.

```
1. Full build gate: tsc --noEmit, eslint . / npm run lint (whole repo), next build (export) all
   green. Paste the route list + count; confirm all six /web-projects/<slug> prerender.
2. Parity check: confirm each of the six projects (ostiara + the five authored here) renders the
   SAME section sequence in order — hero → 3 cards → process → squares → midShot → squares2 →
   article → wideShot → banner. Spot-check the exported HTML for one authored project to confirm
   every section is present and none is empty.
3. Config-is-the-surface: confirm every new value lives in site.config.ts behind // CUSTOMIZE and
   that no component/page/CSS file was touched by Stages 1-4 (git diff --stat should show only
   site.config.ts changed across those stages).
4. Honesty check: confirm no fabricated image files were added (only the two existing
   /images/web shots are referenced) and that every placeholder image + draft copy block carries
   a // CUSTOMIZE / PLACEHOLDER marker.
5. Responsive sweep at 1440 / 768 / 375 on two of the newly-authored pages: no horizontal scroll,
   cards/squares stack, article column legible, banner text legible.
6. Motion sweep: with prefers-reduced-motion, the process flowers are still on the new pages.
7. Update MANUAL-TODO.md with the real-asset debt: a per-project list of the screenshots Charlie
   still needs to capture (hero, two square pairs, mid shot, wide shot, banner) and a note that
   all case-study copy is DRAFT distilled from descriptions and awaits his final pass.

Verify: paste the build route list, the parity spot-check, the git diff --stat proving data-only
changes, and the responsive + reduced-motion results (or an honest deferral if no browser is
available — do NOT fabricate an axe score or screenshots). Report the asset/copy debt in
MANUAL-TODO.md.
```

## Stage 5 Report

_Pending._

---

# After These Stages
- **Every web project is a full case study.** All six `/web-projects/<slug>` pages render the
  complete screenshot-forward ecosystem — hero, cards, process, squares, mid shot, second
  squares, article, wide shot, banner — not just Ostiara.
- **Still one file.** Every project's content is authored and editable entirely from
  `site.config.ts`; no `components/` or CSS was touched.
- **The debt is explicit, not hidden.** Every image is a documented placeholder reusing the two
  real shots, and every copy block is a draft distilled from the real description — all
  `// CUSTOMIZE`-marked, with the per-project real-screenshot + final-copy checklist logged in
  `MANUAL-TODO.md`. Charlie finishes each project by swapping placeholders, no code required.
