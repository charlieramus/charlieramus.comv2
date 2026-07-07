# UPDATELOG V3 — HOMEPAGE WIRED

**First read `DESIGN-BRIEF.md`** (design system + Data map), `AGENTS.md`, and the
**V2 stage reports in `UPDATELOGV2.md`** (they name the exact data exports + the
decisions handed to this stage). Goal of V3: replace the homepage's **placeholder
copy** with Charlie's **real content from `data/*.ts`**, section by section, while
keeping the V1 design **pixel-identical**. This is the "done right" wiring pass.

**Scope guard.** Homepage only. Do **not** build inner routes (`/photography`,
`/writing/[slug]`, `/blog`, `/design`, `/gear`, `/web-projects`) — that's **V4**.
Do not author the photo gallery or MDX rendering. Nav links + section CTAs may point
at the future route paths (dead links until V4) — note them. Keep the design system
in `app/globals.css` intact; wiring should add **near-zero** new CSS (only if real
content changes a length/count the mockup hardcoded). Preserve every `// CUSTOMIZE`
marker. All motion still respects `prefers-reduced-motion`.

**Data is the source of truth.** Import from `data/` — never re-type content inline.
The V2 exports: `snapshot`/`aboutParagraphs`/`tagline` (`data/about.ts`), `entries`
(`experience.ts`), `webProjects` (`projects-web.ts`), `designProjects`
(`projects-design.ts`), `gear`/`gearSections` (`gear.ts`), `socials`/`contactEmail`
(`socials.ts`), `photos` (`photos.ts`), `writing` (`writing.ts`), `services`/
`servicesHeading`/`servicesSub` (`services.ts`).

Verify with `npm run build` + `npx tsc --noEmit` + `npx eslint .`, then **render it**
(`npm run dev` / gstack `/browse`) at **1440 / 768 / 375** — wiring real strings of
different lengths is exactly where layouts break, so eyeball it, don't just typecheck.
Push the branch for a Vercel preview. Don't commit/push unless Charlie asks.

---

## Stage 1 — Identity sections: hero, nav, about, contact

- **`app/layout.tsx`** — set `metadata.description` (and any OG/social description)
  from `tagline`. `metadata.title` = Charlie's name/site.
- **`components/hero.tsx`** — **hero headline = `snapshot.name`** ("Charlie Ramus"),
  NOT `tagline` (Charlie's V2 Stage 1 call — `tagline` is `<meta>`-only). Decide what
  the lede line under the name is (short line from `snapshot.roles` or a hand-written
  one — see decision). Wire the nav labels/hrefs to the real sections/routes (the
  mockup's "works · studio · garden" are placeholders).
- **`components/about.tsx`** — "Behind the pixels": render `aboutParagraphs`. **Note:
  V2 made this 4 paragraphs; the mockup's `.about-grid .bio` was 2** — confirm the
  layout holds with 4 (it's a simple `p + p` stack, should flow) and adjust spacing
  only if needed. The 4-photo `.collage` stays placeholder here (real photos = V4).
- **`components/contact.tsx`** — the `.pills` row from `socials`; the "Get in touch"
  CTA uses `contactEmail` (mailto). Keep the red box + peace SVG + "Think we vibe?".
- **DECISION → Charlie:** (a) the hero **lede** under the name — options: the
  `roles` joined ("Developer · Designer · Photographer · Writer"), a one-liner, or
  nothing. (b) Final **nav** items + order (they double as the inner-route map for V4).

# Stage 1 Report

**Decisions (Charlie, this session):** (a) hero **lede = nothing** — the name stands
alone under the "Hi, I'm" greeting, no role line. (b) nav = **`work · charlie ramus ·
about`** (Charlie: "whatever you recommend") — all homepage anchors, so V3 ships with
**zero dead links**; the center wordmark is the Caveat script logo.

- [x] **`app/layout.tsx`** — imports `snapshot`, `tagline` from `data/about`.
  `metadata.title` = `` `${snapshot.name} — Developer, Designer, Photographer` ``;
  `metadata.description` = `tagline`; added `openGraph` (title = `snapshot.name`, description
  = `tagline`, `type: "website"`). Per the V2 decision the visible hero is the name, and
  `tagline` stays `<meta>`-only.
- [x] **`components/hero.tsx`** — headline `<h1>` now renders `snapshot.name`
  (`data/about`). `.hi` = "Hi, I'm" (greeting kept; name carries the line). **`.lede`
  removed** (lede decision = nothing). Nav rewired: `<a href="#work">work</a>` ·
  `<span class="logo">charlie ramus</span>` · `<a href="#about">about</a>`. Hero `.btn`
  "Chat with me" → `mailto:${contactEmail}` (`data/socials`).
- [x] **`components/about.tsx`** — `<section id="about">` (new anchor for the nav).
  `.bio` maps `aboutParagraphs` (4 `<p>`) instead of the 2 placeholder paragraphs. The
  2→4 stack flows fine at 1440/768/375; collage stays placeholder (real photos = V4).
- [x] **`components/contact.tsx`** — `.pills` now derived from `socials`
  (LinkedIn · GitHub · Instagram (photography) · Instagram (personal) · Letterboxd; the
  two Instagrams disambiguated by their `note`), all `target="_blank"` external. The red
  `.box` is now `Reveal as="a"` → `mailto:${contactEmail}` (whole card is the CTA). Peace
  SVG + "Think we vibe?" + "Get in touch" kept verbatim.
- [x] **`app/globals.css`** — moved the base `a { color: inherit; text-decoration: none }`
  reset into `@layer base`. **Bug found during render:** unlayered, that reset beat every
  `@layer components` rule, so `.btn` computed `color: ink` on `ink` (invisible "Chat with
  me" / "Get in touch" text) and `nav a` rendered black instead of red — a regression vs
  the mockup's layer-free CSS. Base-layering it restores mockup colors (verified in a
  production build: `.btn` = `#fff`, `nav a` = `#f32317`). This was the only CSS change.

**Data flow:** `data/about` → `snapshot.name` (hero `<h1>` + layout title/OG),
`aboutParagraphs` (about `.bio`), `tagline` (`<meta>` description + OG only).
`data/socials` → `socials` (contact `.pills`), `contactEmail` (hero + contact `mailto`).

**Verify:** `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean. Rendered on the
production server (dev HMR left a stale duplicate stylesheet that masked the CSS fix — prod
is the source of truth) at 1440 / 768 / 375: no console errors; hero/nav/about/contact all
within viewport; nav links red, wordmark script, CTA white-on-ink, pills wrap cleanly on
mobile; about's 4 paragraphs sit correctly beside the collage.

**Dead links (V4 targets):** none introduced this stage — nav is homepage anchors
(`#work`, `#about`), CTAs are `mailto:`, pills are external social URLs. (Inner routes like
`/photography`, `/writing/[slug]` still arrive in Stage 2+.)

**Issues:** (1) Page still has a small document-level horizontal overflow at 375/768,
caused entirely by the **digital-home carousel** `.shot`s (Stage 3 component, pre-existing
mockup behavior), not any stage-1 section — flagged for Stage 3/5. (2) The contact `.box`
runs ~8px past its `.wrap` on mobile because the mockup hardcodes `width: 90vw` inside a
`--edge`-padded wrap; clipped by `overflow-x: hidden`, no visible scrollbar, pre-existing
(unchanged by the `<div>`→`<a>` swap) — leave for a Stage 5 polish pass.

---

## Stage 2 — Personal / explore bento (`components/personal-bento.tsx`)

The densest wiring. The bento's cards each map to a data source:
- **Career-journey timeline** (`.cj` / `ROLES[]` / `YEARS[]`) ← `experience.entries`.
  Drive the absolute-positioned `.role` cards from each entry's `title`/`org`/`dates`
  and the timeline placement from numeric `start`/`end`; the chip `.lg` uses
  `logo`/`logoBg`/`logoFg` (now all `var(--color-*)` tokens after V2 Stage 5). Keep
  the `.big` variant for the featured (newest) role.
- **Writing card** (`.p-writing` / `.wlist`) ← `writing` (top N by `order`, newest
  first) → `title` + `date`; links to `/writing/[slug]` (dead until V4).
- **Photography / graphic cards** (`.p-photo` / `.p-graphic` halftone `.pgrid`s) ←
  thumbnails from `photos` / `designProjects`. `photos` is **empty until V4** — keep
  the halftone placeholder tiles and wire the real grid in V4; the card's "View the
  gallery" link points at `/photography`.
- **Blog card** (`.p-blog` / `.blist`) — **DECIDED (V2 addendum): there is no separate
  blog.** Charlie has one body of written work (the essays). So **fold this into
  Writing**: either render more `writing` entries here (e.g. this card = older essays,
  `.p-writing` = latest) or drop the `.p-blog` card. Do **not** add `data/blog.ts`.
- Keep the accent `.ptile` flowers + `.p-play` playground as-is (decorative).

# Stage 2 Report

All wiring is in **`components/personal-bento.tsx`**; the only CSS touched is in
**`app/globals.css`** (bento grid + two clamps, all justified by real string lengths).

- [x] **Career-journey timeline ← `experience.entries`.** Drives the `.role` cards from
  each entry's `title`/`org`/`dates` and the chip `.lg` from `logo`/`logoBg`/`logoFg`
  (already `var(--color-*)` tokens). Newest entry (Ostiara) = the `.big` featured card.
  **Axis decision:** the mockup's 2020→2027 8-year axis was a fake résumé; Charlie's real
  range is **2025–2026 and every role is ongoing ("Present")**, so two roles share 2026. A
  strict year→pixel map collides, so cards are placed **ordinally** (newest at top) while
  the year ticks (2026 top → 2025 bottom, derived from `min/max start`) act as the honest
  axis behind them — same visual intent as the mockup, which also placed cards for rhythm.
  Band relabeled "Freelance & Side Projects" → **"Solo builds & side work"** to fit Charlie.
- [x] **Writing card (`.p-writing`) ← `writing`.** Top 2 by `order` (newest first) →
  `yr` (year parsed from the `date` string) + clamped `title`; card links `/writing`.
- [x] **Blog card folded into writing (V2 addendum: no separate blog).** Kept the `.p-blog`
  grid slot so the bento layout is intact, but repurposed it as **"More essays"** — renders
  the *remaining* `writing` entries (order 3–4) as `title` + `date`, links `/writing`. No
  `data/blog.ts` added.
- [x] **Photography (`.p-photo`) & Graphic design (`.p-graphic`).** `photos` is empty until
  V4, so the halftone placeholder tiles stay; the graphic grid is now **count-driven off
  `designProjects`** (3 → 3 tiles) with placeholder gradients. Titles/CTAs made honest:
  graphic card `h3` → "Brand & layout" (Charlie does pitches/IMC/UI, not "posters & type").
  Gallery/portfolio links point at `/photography` and `/design`.
- [x] **Accent `.ptile` flowers + `.p-play` playground kept decorative** (per stage). Only
  de-placeholdered the playground blurb (dropped the literal "Placeholder —") and pointed
  "Poke around" at `/web-projects`, where Charlie's smaller builds live.
- [x] **CSS (all in `@layer components`, `app/globals.css`):**
  - `.pbento` columns → `minmax(0, …)`. **Bug found during render:** a real long essay
    title (`white-space:nowrap`) in `.p-blog` floored its grid column at max-content and
    blew the whole grid out (career squished 290→201px, `.p-photo`/`.p-blog` ballooned to
    463px). `minmax(0,…)` caps the columns so the ellipsis engages. Applied to the mobile
    `1fr 1fr` too. The mockup's short blog titles never hit this.
  - `.wlist .wt` → 2-line clamp (real essay titles run long; the mockup's were one line).
  - `.blist li .bt` → single-line ellipsis (+ restated ink/size, since `.blist li span`
    also matches the title span) so the nowrap date always keeps its line.

**Data flow:** `experience.entries` → career timeline (chip tokens + ordinal placement,
`start` drives the year axis); `writing` (order-sorted) → `.p-writing` top-2 +
`.p-blog` "more essays"; `designProjects` → graphic-grid tile count. `photos` stays empty
(V4). No content re-typed inline.

**Verify:** `npx tsc --noEmit`, `npx eslint .`, `npm run build` clean. Rendered on the prod
server at 1440 / 768 / 375: no console errors; grid columns even (career 290 / others 232
at 1440); career reads 2026→2025 with three real roles, Ostiara featured; essay titles
clamp/ellipsize instead of overflowing; on 768 the full-width career card puts every role
title on one line. No new horizontal overflow (the 783/768 · 511/375 doc overflow is the
Stage-3 carousel, unchanged).

**Dead links (V4 targets) added this stage:** `/photography`, `/design`, `/writing`
(×2 cards), `/web-projects`. All are homepage-bento CTAs pointing at inner routes that
don't exist until V4.

**Issues:** (1) Role cards with long titles ("TA & Media Manager (Seasonal) · Liberty
Puzzles") still wrap to 3–4 lines inside the narrow desktop career column — readable and
contained, but tighter than the mockup's short-title chips; the full-width mobile/tablet
layout is roomier. (2) The `photos`/`designProjects` grids are still decorative gradients
until the V4 image sync populates real thumbnails.

---

## Stage 3 — Work bands + digital-home carousel

- **`components/work.tsx`** — "Tiny fraction of my work": drive the four
  `.band`/`.band.flip` rows from `webProjects`. **Respect the V2 curation order** (the
  array is flagship → `spotlight` → long tail, *not* chronological) — the top bands
  should be the `spotlight` projects (Ostiara, MyLifeInARepo). Each band shows
  `title`/`date`/`description`/`tags`; the bespoke device cards (`.ui`/`.mini`/`.photo`)
  keep their placeholder visuals (real screenshots = V4, `image` fields still empty).
  The `.touch` case-study bar → the flagship (Ostiara) blurb.
- **`components/digital-home.tsx`** — the "Step into my digital home" `.carousel` of
  six `.shot`s. Decide what the shots represent (featured project/photo captions) —
  they can stay as tasteful placeholders since real imagery is V4; wire only the
  captions/labels if a data source fits.
- **DECISION → Charlie:** how many work bands (mockup has 4; `webProjects` has 6) —
  show the top 4 on the homepage with a "see all → `/web-projects`" link, or restyle
  to fit more? Recommend top-4 + link.

# Stage 3 Report
_TBD._

---

## Stage 4 — Services, finale, and the "highlights right now" surface

- **`components/services.tsx`** — **DECIDED (V2 addendum): `data/services.ts` exists.**
  Reframed from the mockup's for-hire agency copy into an honest capabilities list.
  Swap the inline `SERVICES`/heading/sub for the imports: `services` (drop-in
  `string[]` → `.svc-grid` cells), `servicesHeading`, `servicesSub`. Update the `<h2>`
  ("I've got your back with…") + subhead to `servicesHeading`/`servicesSub` — the
  copy is now non-freelance, so the heading must match.
- **`components/finale.tsx`** — the flower-grid finale + centered serif quote. Wire
  the quote to a real line (from `about.ts` or a new `// CUSTOMIZE` quote export) or
  keep the mockup's. Flowers stay decorative.
- **"Highlights right now" (Charlie's V2 Stage 2 idea).** He wants a rotating "what's
  fresh" surface: recent-trip photos + active project (Ostiara) + open-source journal
  (MyLifeInARepo) + latest article. The building blocks exist:
  `webProjects.filter(p => p.spotlight)`, `photos.filter(p => p.featured)` +
  `location`/`date`, latest `writing`. DECISION → Charlie: **which existing section
  hosts this** (repurpose the bento, the work section, or digital-home) vs. a new
  section — and whether it ships in V3 or waits for V4 photos (the photo slot is empty
  until then). Design it deliberately; don't bolt it on.

# Stage 4 Report
_TBD._

---

## Stage 5 — Verify + consistency + preview

- `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean.
- **Render + eyeball** at 1440 / 768 / 375 (dev server / gstack `/browse`): real copy
  doesn't overflow, the career timeline places correctly from `start`/`end`, no
  horizontal scroll, zero console errors. Screenshot for Charlie.
- Confirm **every section now reads from `data/`** (no re-typed content) and the
  design is still pixel-faithful to the mockup (diff against the V1 screenshots).
- List every homepage link that points at a **V4** route (dead until then) so V4 has
  its target list. Note anything the content model still lacks (blog, services).
- Push the branch → Vercel preview; share the URL.

# Stage 5 Report
_TBD._
