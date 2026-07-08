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

**Decisions (Charlie, this session):** (a) **Top 4 work bands = Ostiara, MyLifeInARepo,
charlieramus.com, VaultDNA** — Charlie swapped Querryn out for charlieramus.com; Querryn +
Browser-automation drop to the `/web-projects` long tail. (b) Caption richness = "whatever
you recommend" → I went **compact** (title · date · tags), because the mockup's visual
panels can't hold a paragraph each without a redesign; the flagship's full blurb lives in
the `.touch` bar and per-project descriptions land on `/web-projects` (V4).

- [x] **`components/work.tsx` ← `webProjects`.** Four bands selected **by title** (honors
  Charlie's curation, robust to array reordering): `bands = BAND_TITLES.map(find)`. Each
  band keeps its bespoke placeholder device visuals; a `<Caption>` helper wires the
  `.label` to `title` + `date` + top-2 `tags` (mockup's `<b>name</b><span>meta</span>`
  shape, no new CSS). Band 1 is the flagship (Ostiara); its `.ui` device card lost the
  literal **"Placeholder product headline / placeholder metric caption"** filler — now
  reads the flagship title + an honest "5 home-service verticals" stat, so nothing says
  "Placeholder" on the shipped preview.
- [x] **`.touch` case-study bar → flagship (Ostiara).** `<p>` = `flagship.description`
  (real 3-sentence blurb); button = "View Ostiara ↗" → `flagship.href` (GitHub, external
  new-tab) with a `/web-projects` fallback if href is ever empty.
- [x] **"See all my work ↗" link** added after the bands → `/web-projects` (dead until V4).
  New CSS: one small `.proj-all` rule (centered uppercase link, blue→red hover).
- [x] **`components/digital-home.tsx` ← `webProjects`.** The six `.shot` browser-window
  placeholders now caption the six real project titles (Ostiara → Browser-automation),
  cycling the mockup's color variants. Visuals stay placeholder (real screenshots = V4);
  the carousel scrolls horizontally within itself (`overflow-x:auto`, unchanged).

**Data flow:** `webProjects` → work bands (title/date/tags caption, flagship drives the
touch bar) + digital-home shot captions. `image` fields stay empty (V4 screenshots). No
content re-typed inline.

**Verify:** `npx tsc --noEmit`, `npx eslint .`, `npm run build` clean. Rendered on the prod
server at 1440 / 768 / 375: no console errors; four bands read Ostiara → MyLifeInARepo →
(touch: Ostiara blurb) → charlieramus.com → VaultDNA with correct captions; bands collapse
to one column < 880px and the touch bar stacks; carousel shows real titles and scrolls
internally on mobile.

**Horizontal-overflow finding (correcting Stages 1–2):** the residual doc `scrollWidth`
(511 @375 / 783 @768) is **not** the carousel — the carousel is a proper internal scroller.
The real overflow is `.fan .fc` in the **services** section (Stage 4): an
absolutely-positioned fanned card sticks out to x=511. The page does **not** actually
scroll horizontally (`body{overflow-x:hidden}` clips it; `window.scrollTo(9999,0)` leaves
`scrollX` at 0), but `scrollWidth` exceeds `clientWidth`. **Left for Stage 4** to constrain
the fan (it's the services component). Carousel confirmed clean.

**Dead links (V4 targets) added this stage:** `/web-projects` (see-all link). The touch
button points at Ostiara's real GitHub; carousel shots are captions, not links.

**Issues:** (1) The `.touch` bar now holds Ostiara's full 3-sentence blurb — informative
but ~6 lines tall on desktop (the mockup had one sentence); acceptable for a case-study
bar, trim later if Charlie wants it lighter. (2) Band device visuals remain decorative
placeholders until the V4 screenshot pass. (3) Services-fan overflow noted above.

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

**Decision (Charlie, this session):** the "highlights right now" surface = "whatever you
recommend" → I built a **new "Right now" section in V3** (option 1): a compact strip after
the digital-home carousel with the three real, text-backed items; the recent-trip photo
highlight is deferred to V4 (photos empty until the gallery sync).

- [x] **`components/services.tsx` ← `data/services.ts`.** Swapped the inline `SERVICES`/
  heading/sub for `services` (→ `.svc-grid` cells), `servicesHeading` ("Things I build and
  make"), `servicesSub`. Heading/sub now non-freelance, matching the honest capabilities
  list. **Fixed the fan overflow** (the Stage-3 note): the `.fc` cards were laid out at
  `left:i*44px` from the edge and blew past the viewport on mobile (x=511); they're now
  centered on `50%` via `translateX`, and `.fan { overflow:hidden }` clips the outer cards
  on narrow screens (decorative deck — tucking is fine).
- [x] **`components/finale.tsx` ← `data/about.ts`.** Quote wired to a new `finaleQuote`
  export ("The whole thing, built by hand — / backend, design, and the words in between."),
  echoing the about copy; `\n` drives the line break. Flowers stay decorative.
- [x] **`components/right-now.tsx` (new) + `app/page.tsx`.** New `<RightNow />` between the
  carousel and the bento. Three cards from real data: **Building** ← `webProjects.filter(
  spotlight)[0]` (Ostiara), **Journaling** ← spotlight[1] (MyLifeInARepo), **Latest essay**
  ← newest `writing`. Card desc = the project's first sentence (derived, not re-typed) or
  the essay's date; CTAs link GitHub / `/web-projects` / `/writing`. Reuses the bento's
  `.kick`/`.fdot`/`.go` language; small dedicated `.now-*` CSS (card grid, clamp, hover).
- [x] **Global horizontal-overflow eliminated.** Beyond the fan, two pre-existing bleeds
  surfaced once the fan was fixed: the contact `.box` (`53vw`/`90vw` > wrap) and the
  finale flower field (edge flowers + wind-spin). Fixed with `.contact .box{max-width:100%}`
  and `.finale{overflow:hidden}`. **Result: `no-hscroll` and `scrollX==0` at 375/768/1440**
  (was carried since Stage 1). This clears the Stage-5 "no horizontal scroll" goal early.

**Data flow:** `data/services` → services grid + heading/sub; `data/about.finaleQuote` →
finale line; `webProjects.filter(spotlight)` + newest `writing` → Right Now cards. No
content re-typed inline.

**Verify:** `npx tsc --noEmit`, `npx eslint .`, `npm run build` clean. Rendered on the prod
server at 1440 / 768 / 375: no console errors; services reads the honest list with a
centered fan; finale shows the new quote over the flower grid; Right Now stacks 3→1 columns
cleanly with clamped descriptions; **zero horizontal scroll at every width**.

**Dead links (V4 targets) added this stage:** `/writing` (Right Now essay card),
`/web-projects` (Right Now journal card fallback). Ostiara's Right Now card links to its
real GitHub.

**Issues:** (1) The Right Now photo highlight is intentionally absent until V4 (photos
empty) — the section ships with 3 items, add a 4th photo card in V4. (2) The services fan
is clipped at the edges on mobile by design (decorative). (3) Nothing else outstanding for
Stage 5 except the final full-page sweep + Vercel preview.

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

- [x] **`npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean** (final run after
  the placeholder sweep below).
- [x] **Rendered + eyeballed at 1440 / 768 / 375** on the prod server (`npm run start`):
  **`no-hscroll` and `scrollX==0` at every width**, **zero console errors**, real copy
  doesn't overflow (essay titles clamp, band captions wrap, Right Now descs clamp), and the
  **career timeline places correctly** (2026 top → 2025 bottom, three real roles newest-
  first, Ostiara featured as `.big`). Full-page screenshots captured for Charlie.
- [x] **Placeholder sweep — found + fixed two visible leftovers:**
  - `components/about.tsx` subline was still the mockup's "…swap this for a short, friendly
    intro." → rewritten to a real `// CUSTOMIZE` lead-in.
  - `app/page.tsx` legal line was "© 2026 — placeholder content · homepage rebuilt from the
    mockup" → now `© {year} {snapshot.name} · {snapshot.location}` from `data/about`.
  - Remaining "placeholder" strings are **comments only** (explaining the V4 device/photo
    visuals), not shipped copy.
- [x] **Every content section reads from `data/`** (no re-typed content): `hero` +
  `page` (legal) ← `about`/`socials`; `about` ← `about`; `contact` ← `socials`;
  `right-now` ← `projects-web`/`writing`; `personal-bento` ← `experience`/`writing`/
  `projects-design`; `work` + `digital-home` ← `projects-web`; `services` ← `services`;
  `finale` ← `about`. Only `flower`/`reveal`/`Stack` (visual primitives) carry no content.
- [x] **Design still pixel-faithful** to `mockups/hellodani-mockup.html` — same layout,
  palette, fonts, motion; wiring added only justified CSS (layer/overflow fixes, clamps,
  `.proj-all`/`.now-*`, all in `@layer components`).

**V4 dead-link list (homepage links to inner routes that don't exist yet):**
| Route | Where it's linked from |
|---|---|
| `/photography` | bento Photography card ("View the gallery") |
| `/design` | bento Graphic-design card ("See the work") |
| `/writing` | bento Writing ("Read all essays") + "More essays" ("Browse the archive") + Right Now essay card ("Read it") |
| `/web-projects` | bento Playground ("Poke around") + Work "See all my work" + Right Now journal card (MyLifeInARepo fallback) |

Not dead (real/external/anchors): hero nav `#work`/`#about`; hero + contact `mailto:`;
contact pills → external socials; Work touch bar + Right Now Ostiara card → Ostiara GitHub.

**Content-model gaps (for V4):**
- **`photos` is empty** — the biggest gap. Bento Photography grid + Graphic grid use
  placeholder gradient tiles; the Right Now photo highlight is deferred until the gallery
  sync exists. Also `webProjects.image` / `designProjects.images` / essay header images are
  all empty, so work bands, the carousel, and writing thumbnails use placeholder visuals.
- **Blog: resolved** — folded into `writing` (no separate `data/blog.ts`), per V2 addendum.
- **Services: resolved** — `data/services.ts` now backs the section.
- **Inner routes** (`/photography`, `/design`, `/writing/[slug]`, `/web-projects`) are the
  V4 build target (the dead-link table above is their homepage entry points).

**Preview / push:** the branch `v1-homepage-preview` tracks
`origin/charlieramus.comv2` and Stages 1–4 are already committed + pushed
(`stage1v3`…`stage4v3`), so Vercel has a running preview. The Stage-5 changes (this report,
`about.tsx`, `page.tsx`) are **staged in the working tree, not committed** — left for
Charlie to commit as `stage5v3` and push (his per-stage pattern; the repo rule is no
commit/push without his ask). The Vercel preview URL lives in Charlie's Vercel dashboard
(the Vercel MCP connector isn't authorized in this session, so I can't fetch it here).

**Issues:** None blocking. The homepage is fully wired to `data/`, pixel-faithful, clean on
all three checks, and free of horizontal scroll + console errors at 1440/768/375. Remaining
work is all **V4** (real photos + screenshots + the inner routes above).
