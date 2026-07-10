# UPDATELOG V8 — PREVIEW LAYER · PETAL SIMON · TIGHTER ABOUT

**First read `DESIGN-BRIEF.md`, `AGENTS.md`, the V6 + V7 stage reports, and `MANUAL-TODO.md`.**
V6 made the site visually done; V7 made it a static export ready for Cloudflare Pages. **V8 is
three targeted content/interaction changes Charlie asked for** — none of them touch the deploy
pipeline (they re-export through V7 unchanged):

1. **A real preview/curation layer** — today "what's previewed" on the homepage is welded to
   content and scattered across components (the photo bento hardcodes codes, the design card grabs
   each project's *first slide*, "Right now" keys off a `featured` flag, the carousel maps raw
   `webProjects`). Pull all of that into **one file Charlie edits** so previews are chosen
   independently of the underlying content.
2. **Replace the "Side experiments" Playground card with _Petal Simon_** — a small, actually
   playable memory game (watch a growing sequence of brand-color flowers, repeat it) built from the
   motif registry. Charlie doesn't need the playground link.
3. **Shorten "Behind the pixels"** — it's 4 paragraphs (~210 words) and paragraph 2 duplicates the
   career-timeline description right above it. Collapse it behind a **"read more"** so the default
   view is short.

## Decisions (Charlie picked these up front)
- **Playground →** _Petal Simon_ memory game (not an ambient animation).
- **Behind the pixels →** **expandable "read more"** (short teaser by default, full bio on expand).
- **Previews →** **one curation file** (`data/previews.ts`), with a **custom preview image per
  item** allowed (a design/web preview may differ from its content's first slide).

## Hard constraints (carry over from V6 + V7)
- **Don't regress V6/V7.** Keep **axe at 0**, no horizontal scroll, no console errors, reduced-motion
  honored, and **every route still prerenders under `output: export`** — re-run `next build` (export)
  and the `out/` smoke-test after the game lands (a client component is fine under export; verify no
  hydration drift and no new prefetch/404s).
- **Data is the source of truth.** The preview layer is **new curation data** referencing existing
  content by id/code/slug — it must not duplicate or fork content. Keep `// CUSTOMIZE` markers.
- **Tailwind v4 is CSS-first** — reuse the `@theme` tokens + component classes in `globals.css`; add
  the game/about styles in `@layer components`, no scoped dump.
- **Accessibility is non-negotiable** — the game is **keyboard-playable** (focusable controls,
  `aria` state, visible focus) and reduced-motion-safe; the "read more" is a real
  `aria-expanded` button. Decorative motifs stay `aria-hidden`.
- Verify each stage with `build` + `tsc` + `eslint`, then **render + eyeball** every affected route
  at 1440 / 768 / 375. Don't commit/push unless Charlie asks.

---

## Stage 1 — Preview curation layer (`data/previews.ts`)

Make previews a first-class, content-independent choice.

- **New `data/previews.ts`** — a typed, `// CUSTOMIZE`-annotated registry of what each homepage
  surface shows, referencing content by stable id (photo `code`, project `title`/`slug`). Each
  entry may also carry a **custom `previewImage`** so a preview can differ from the content's own
  image. Cover, at minimum:
  - **Photography bento** — the 4 (or N) photo `code`s shown (replaces `BENTO_PHOTO_CODES` hardcoded
    in `personal-bento.tsx`).
  - **Graphic-design bento** — which design projects appear + an optional per-project preview image
    (replaces the "just use `images[0]`" assumption).
  - **"Right now" photo card** — the chosen highlight photo (replaces the implicit
    `featured` + newest-date pick), still overridable to "auto = newest featured."
  - **Digital-home carousel** — which projects tour + their order (replaces mapping raw
    `webProjects`); keep the browser-window variant per entry.
  - **Work bands** — the curated 4 (replaces `BAND_TITLES` hardcoded in `work.tsx`).
- **Wire each render site** to read `data/previews.ts` (with a safe fallback if a referenced id is
  missing — skip, don't crash the build). Content files (`data/photos.ts`, `data/projects-*.ts`)
  stay untouched as the full catalog.
- **Document the workflow** in `data/previews.ts` header + a new `MANUAL-TODO.md` section: "to
  change what's previewed, edit this one file — no component edits."
- **DECISION → Charlie:** the `featured` flag on `data/photos.ts` — keep it as the *default* Right-now
  source (previews.ts overrides when set), or retire it in favor of previews.ts only?
  _Draft assumes: keep `featured` as the fallback; previews.ts wins when it names a photo._
- Guardrail: `next build` (export) still green; no route reads content it no longer should.

# Stage 1 Report

- [x] **New `data/previews.ts`** — one typed, `// CUSTOMIZE`-annotated curation
  layer sitting on top of the content catalogs. A single `previews` config object
  (the part Charlie edits) names, by stable id, what each homepage surface shows:
  - `photographyBento` — photo `code`s (`["0001","0013","0030","0004"]`, unchanged
    default). Each pick is a `PhotoPick` = `{ code, previewImage? }`.
  - `graphicDesignBento` — design-project `title`s (all 3, unchanged). Each pick is
    a `DesignPick` = `{ title, previewImage? }`; `previewImage` overrides slide 1.
  - `rightNowPhoto` — the highlight photo named directly by `code` (default
    `"0055"`, which is the photo the old `featured`+newest-date logic resolved to).
  - `digitalHomeCarousel` — web-project `title` + browser-window `variant` per
    entry (all 6, same skins/order as before).
  - `workBands` — the curated 4 project `title`s (unchanged).
- [x] **Resolvers** in the same file (`bentoPhotoTiles`, `bentoDesignTiles`,
  `rightNowPhoto`, `carouselShots`, `workBandProjects`) turn the config into
  ready-to-render data and **skip any pick whose id isn't found** — a typo drops
  that tile instead of crashing the build. Render sites no longer look up content
  directly, so curation lives in exactly one place.
- [x] **Wired each render site** to read the resolvers:
  - `components/personal-bento.tsx` — dropped `BENTO_PHOTO_CODES` + the
    `designProjects.map(images[0])` assumption; now `bentoPhotoTiles()` /
    `bentoDesignTiles()`. Tile shape is `{ key, src, blurDataURL? }` (blur only
    when using the content's own thumb, not an override).
  - `components/right-now.tsx` — dropped the inline `featured` + newest-date sort;
    now `rightNowPhoto()`.
  - `components/digital-home.tsx` — dropped the raw `webProjects.map` + local
    `VARIANTS`; now `carouselShots()` (variant carried per entry).
  - `components/work.tsx` — dropped `BAND_TITLES`; now `workBandProjects()`.
    Hardened for graceful degradation: `Caption` takes `p?` and renders null when
    a band id is missing; the flagship band title and the `.touch` case-study bar
    guard on `flagship` (`bands[0]`).
- [x] **Content files untouched** — `data/photos.ts`, `data/projects-web.ts`,
  `data/projects-design.ts` remain the full catalog; `previews.ts` only references
  them by id, never forks or duplicates content.
- [x] **Documented the workflow** — header block in `data/previews.ts` +
  new §8 in `MANUAL-TODO.md`: "to change what's previewed, edit this one file."
- [x] **DECISION (featured flag) — Charlie chose: retire it.** The right-now card
  is now driven **entirely from `previews.ts`** (`rightNowPhoto` = a `code`,
  pinned to `"0055"` to preserve the current visual). The `featured`+newest-date
  logic is gone; nothing reads `featured` anymore. The field still exists in the
  auto-generated `data/photos.ts` (harmless — regenerated by sync-gallery).
- [x] **Verified** — `tsc --noEmit`, `eslint .`, and `next build` (export) all
  green; **all 18 routes still prerender** (static/SSG). Confirmed in the exported
  `out/index.html` that the default curation reproduces the V7 output exactly:
  same 4 bento thumbs (0001/0013/0030/0004), same 6 carousel titles, same 4 work
  bands, same right-now photo.

Issues: none. Output is intentionally byte-for-byte equivalent to V7 — this stage
only relocates the curation into one editable file; it doesn't change what shows.
Full render + eyeball at 1440/768/375 is deferred to Stage 4 per the plan.

---

## Stage 2 — Petal Simon (replace the Playground card)

Swap the `p-play` "Side experiments" card in the "More than code" bento for a small memory game.

- **New `components/petal-simon.tsx`** (client component) — the classic Simon loop with the brand
  flowers: the game flashes a growing sequence of **brand-color motifs** (from the motif registry /
  palette); the player repeats it by clicking/tapping (or keyboard) the pads; each correct round
  extends the sequence and bumps the score; a miss ends the round with a restart.
  - **Reuse the motif system** — the pads are `<Motif>` marks in the named palette (red / blue /
    yellow / cyan, + pink if we want 5 pads). A pad "lights" by scaling/tinting, not by a jarring
    flash.
  - **Keyboard-playable + a11y** — pads are real `<button>`s with `aria-label`s, visible focus, and
    an `aria-live` status ("Round 3", "Your turn", "Miss — restart"). No color-only signal (add a
    subtle motion/label so it's not purely hue-dependent).
  - **Reduced-motion** — under `prefers-reduced-motion` the sequence still plays (slower, no
    scale/spin; use opacity/outline steps) so the game stays usable.
  - **SSR/export-safe** — deterministic initial render, all randomness created after mount (no
    hydration drift); it's a leaf client component inside the server-rendered bento.
- **`components/personal-bento.tsx`** — replace the `<Reveal as="a" href="/web-projects" className="pcard
  p-play">…</Reveal>` block (kicker + "Side experiments" + blurb + `.p-play-art` motifs) with the
  game card. Keep the `.pcard` shell + kicker ("Playground" or a new label) so it sits in the 2×2
  grid unchanged. Losing the card drops one `/web-projects` link — fine (nav + "See all my work"
  still link there).
- **`app/globals.css`** — game styles in `@layer components` (`.psimon*`): the pad grid, lit state,
  score/status line. Sized to the existing `.pcard` (~300px min-height); no overflow at 375.
- **DECISION → Charlie:** **4 pads or 5?** _Draft assumes 4 (red/blue/yellow/cyan — classic Simon
  feel); pink is easy to add._ Also: label the card **"Playground"** still, or rename (e.g. "Take a
  break")? _Draft: keep "Playground."_

# Stage 2 Report

- [x] **New `components/petal-simon.tsx`** (leaf `"use client"` component) — the
  classic Simon loop built from the motif registry. Flow: **Start → watch a
  growing flower sequence → repeat it**; each cleared round appends one pad and
  bumps the score; a wrong pad ends the round with a "Play again" restart. Tracks
  a session **Best** too.
  - **4 pads (draft decision kept)** — red / blue / yellow / cyan, each a `<Motif>`
    in the named palette. **Each pad also uses a DISTINCT motif shape** (daisy /
    clover / star / aster) so the sequence never relies on hue alone
    (colorblind-safe). A pad "lights" by tinting to its brand color + a gentle
    scale, and the non-lit pads dim — a brightness cue, not a jarring flash.
  - **Keyboard + a11y** — pads are real `<button>`s with static `aria-label`s
    ("Red daisy", …), a visible `:focus-visible` ring, and number keys **1–4** as
    a fast path (native Enter/Space also work). An `aria-live="polite"`,
    `role="status"` line narrates the game ("Round 3 — watch the sequence.", "Your
    turn", "Miss on Red daisy. You reached round 2. Press Play again."). The lit
    state is a purely visual cue, so it never re-announces per pad.
  - **Reduced-motion** — timing slows (560ms on / 300ms gap vs 420/220) and the CSS
    drops the scale/spin, keeping the tint + dim as the signal so the game stays
    fully playable. The pad motifs also have their wind-spin killed (`.psimon-pad
    .motif { animation: none }`) so they hold still.
  - **SSR/export-safe** — initial render is deterministic (empty sequence, "idle"
    phase, fixed status, "Round 0"); **all randomness runs after mount** in
    handlers/effects. Verified the static export contains exactly that idle markup
    → no hydration drift. All timers are cleaned up on unmount / phase change; the
    eslint `set-state-in-effect` rule is satisfied (no synchronous setState in
    effect bodies — resets/announcements happen at the transitions).
- [x] **`components/personal-bento.tsx`** — replaced the `<Reveal as="a"
  href="/web-projects" className="pcard p-play">…</Reveal>` block with
  `<PetalSimon />`. The game renders its own `.pcard psimon` shell (kept the
  "Playground" kicker), so it sits in the 2×2 grid unchanged. Dropping the card
  removes one `/web-projects` link (nav + "See all my work" still cover it).
- [x] **`app/globals.css`** — added `.psimon*` styles in `@layer components` (pad
  grid, lit state, status/score/start footer) and a reduced-motion override;
  removed the now-dead `.p-play-art` rules. Sized to the existing `.pcard`
  (min-height 300px); **no horizontal overflow at 375** (verified
  `scrollWidth === clientWidth`).
- [x] **DECISION (pads + label)** — kept the draft: **4 pads**, card still labeled
  **"Playground"**, title "Petal Simon". Pink is a one-line add if Charlie wants a
  5th pad later.
- [x] **Verified** — `tsc`, `eslint`, `next build` (export) all green; all 18 routes
  still prerender. Live-drove the game in a headless browser: **no console errors
  / clean hydration**; started a game, observed the sequence flash, pressed the
  correct pad → advanced to Round 2 (Best 1), pressed a wrong pad → miss + "Play
  again", restart → Round 1. Screenshotted the card at 375 — pads read clearly,
  fits the shell.

Issues: none. Live reduced-motion behavior and the full axe/1440/768/375 sweep are
the Stage 4 gate; the CSS + JS paths for reduced-motion are in place.

---

## Stage 3 — "Behind the pixels": expandable bio

Shorten the About section by default; keep the full text one tap away.

- **`components/about.tsx`** — split `aboutParagraphs` into a **short teaser** (shown by default —
  the first paragraph, or a tightened 2-sentence intro) and the **rest behind a "read more"**
  toggle. A real `<button>` with `aria-expanded` / `aria-controls`; the hidden paragraphs are in the
  DOM (SEO/export-friendly) and revealed on expand, not fetched.
  - Reduced-motion: the expand is instant (no height animation) under `prefers-reduced-motion`;
    otherwise a gentle reveal.
- **Trim the timeline redundancy** — paragraph 2 (the long Ostiara description) largely repeats the
  "More than code" career-timeline entry. **DECISION → Charlie:** cut/condense that paragraph in
  `data/about.ts`, or leave the full text intact but simply hidden behind "read more"?
  _Draft assumes: tighten paragraph 2 in `data/about.ts` so even the expanded bio doesn't echo the
  timeline verbatim._
- **`app/globals.css`** — `.bio` gets the collapsed/expanded states + the toggle button styling
  (on-system: small, `--color-blue` link-ish like the `.go` links). No layout shift that breaks the
  collage alignment at any width.
- Keep it **data-driven** — the teaser/rest split derives from `aboutParagraphs` (e.g. `[0]` =
  teaser, rest = expandable), so Charlie still edits copy in `data/about.ts`.

# Stage 3 Report

- [x] **New `components/about-bio.tsx`** (leaf `"use client"` component) — splits
  `aboutParagraphs` data-driven: `[0]` is the teaser shown by default, the rest
  fold behind a **"Read more about me" / "Read less"** toggle. The toggle is a real
  `<button>` with `aria-expanded` + `aria-controls` pointing at the rest region; a
  small `aria-hidden` caret (↓/↑) hints direction. The hidden paragraphs are
  **always rendered in the DOM** (collapsed with CSS, not fetched) → export-static
  and crawlable; the collapsed region carries `aria-hidden` so assistive tech
  tracks the visual state (the rest is plain text, no focusable elements, so no
  hidden-focus trap).
- [x] **`components/about.tsx`** — dropped the `aboutParagraphs.map` stack and the
  now-unused `aboutParagraphs` import; renders `<AboutBio />` in the `.bio` slot.
  The collage + head stay server-rendered.
- [x] **Trimmed the timeline redundancy (DECISION: tighten, per draft)** — rewrote
  `aboutParagraphs[1]` in `data/about.ts`. It was a near-verbatim restatement of
  the Ostiara career-timeline entry (`data/experience.ts` — "SaaS platform for
  door-to-door sales teams… pest control, solar, roofing…", "design system I built
  for it", "customer-discovery interviews… quote prices on a doorstep"). Condensed
  to keep only the insight the timeline lacks (the menu-priced vs measure-on-site
  split), so the expanded bio no longer echoes the timeline.
- [x] **`app/globals.css`** — `.bio-rest` collapses via the grid-rows `0fr→1fr`
  trick so the reveal animates to the content's exact height (no fixed max-height,
  no layout jump that would knock the collage out of alignment); `.bio-toggle` is
  styled small + `--color-blue` link-ish (→ `--color-red-ink` on hover) matching
  the `.go` links, with a visible `:focus-visible` ring. The teaser→rest gap is
  padding applied **only** when open, so the collapsed track measures a true `0px`
  (verified) rather than leaking the padding. Reduced-motion sets
  `.bio-rest`/`.bio-rest-inner` `transition: none` → the expand is instant.
- [x] **Verified** — `tsc`, `eslint`, `next build` (export) all green; all 18 routes
  prerender. Confirmed the **static export contains every bio paragraph** even
  while collapsed (SEO-friendly). Live-drove it: collapsed default shows only the
  teaser (`aria-expanded=false`, rest `aria-hidden=true`, grid rows `0px`); clicking
  expands (`aria-expanded=true`, `aria-hidden=false`, rows → full height, opacity
  1); no console errors; collage stays aligned in both states; no horizontal
  overflow at 1440 or 375; screenshotted both states.

Issues: none. Live reduced-motion behavior and the full axe/1440/768/375 sweep are
the Stage 4 gate; the reduced-motion CSS path is in place.

---

## Stage 4 — Verify + consistency (visual sign-off)

The V8 gate. No deploy changes — this re-exports through V7.

- `tsc` / `eslint` / `build` all clean; **every route still prerenders** (static/SSG); the **static
  export (`out/`) still smoke-tests clean** (no console errors, no new prefetch/404s, images/blur,
  lightbox, motifs, finale fill).
- **Render + eyeball** every affected surface at 1440 / 768 / 375: **axe 0**, no horizontal overflow,
  no console errors, reduced-motion honored.
- Spot-check the V8 moves end-to-end:
  - **Preview layer** — editing `data/previews.ts` swaps what the photo bento / design card / Right
    now / carousel / work bands show, **without touching content files**; a missing id degrades
    gracefully.
  - **Petal Simon** — playable with mouse **and** keyboard; `aria-live` status announces; a11y
    passes; reduced-motion still lets you play; fits the card at 375.
  - **Behind the pixels** — short by default; "read more" expands accessibly; no collage misalignment;
    the expanded bio no longer echoes the timeline.
- Confirm the site is still **visually consistent** and **export-ready** (V7 pipeline unchanged).
  List anything deliberately left.

# Stage 4 Report

Verification-only stage — no code changes. Built the export, served `out/` over a
local static server, and drove it in a headless browser (axe-core injected from
`node_modules`).

**Static gate**
- [x] `tsc --noEmit`, `eslint .`, `next build` (export) all clean.
- [x] **All 18 routes still prerender** — every app route is `○ (Static)` except
  `/writing/[slug]` which is `● (SSG)`; no route regressed to dynamic.
- [x] **Static export smoke-tests clean** — served `out/` and hit `/`,
  `/photography`, `/design`, `/web-projects`, `/writing`, and a nested
  `/writing/<slug>`: all 200, **no failed requests** (all assets/fonts/chunks
  200), **no console errors** on any route.

**axe / overflow / console at 1440 · 768 · 375**
- [x] **axe = 0 violations** on: home (all three viewports), `/photography`
  (including with the **lightbox open**), `/design`, `/web-projects`, `/writing`.
- [x] **No horizontal overflow** (`scrollWidth === clientWidth`) and **no console
  errors** on every route × viewport tested.

**V8 moves, end-to-end**
- [x] **Preview layer** — the carousel renders the 6 curated projects in order
  (Ostiara → MyLifeInARepo → Querryn → VaultDNA → charlieramus.com →
  Browser-automation experiments); the photo bento shows the 4 curated codes; the
  Right-now card shows the pinned `0055` (Longs Peak). **Graceful degradation
  confirmed**: temporarily set a bad photo code (`9999`) and a bad work-band title
  (`NoSuchProject`) → `next build` **stayed green, all 18 routes generated**, the
  bad photo tile simply dropped (bento fell to 3 tiles), the bad band was skipped
  and never leaked into the HTML. Reverted + rebuilt clean. **Content files were
  never touched** — only `data/previews.ts`.
- [x] **Petal Simon** — playable with **mouse and keyboard**: native Enter on a
  focused pad cleared a round; the **number-key (1–4) path** confirmed by pressing
  a deliberately wrong digit and getting the expected "Miss on … Press Play again."
  The `aria-live` status announces each transition (Round N / Your turn / Miss);
  **axe = 0**; fits the card at **375 with no overflow**.
- [x] **Behind the pixels** — short by default (only the teaser renders; the
  collapsed region measures a true `0px`); "Read more" expands **accessibly**
  (`aria-expanded` flips, keyboard Enter **and** Space toggle it, verified live);
  the collage stays aligned in both states; the expanded bio no longer echoes the
  career timeline (paragraph 2 was tightened in Stage 3).

**Export-wide behaviors (V7 pipeline unchanged)**
- [x] **Lightbox** — opens as `role="dialog"` `aria-modal="true"`, moves focus to
  the close button, locks body scroll, **Escape closes** and returns focus; axe = 0
  with it open.
- [x] **Finale fill** — the finale field renders 40 motif marks, all filled
  (opacity 1) after scroll-in.
- [x] **Motifs / images / blur** — bento + carousel + finale motifs render; no
  broken images or failed prefetches in the network log.

**Reduced-motion**
- [x] Live `prefers-reduced-motion` media emulation was **blocked by browse's CDP
  allowlist** (`Emulation.setEmulatedMedia` denied), so verified structurally
  instead: both new reduced-motion rules are present in the exported CSS bundle
  inside the `@media (prefers-reduced-motion: reduce)` block —
  `.bio-rest,.bio-rest-inner{transition:none}` (instant expand) and
  `.psimon-pad.is-lit,.psimon-pad.is-lit .motif{transform:none}` (no pad scale).
  The game's JS timing gate (`prefersReduced()` slows the sequence) is code-level.

**Deliberately left**
- Live reduced-motion emulation not exercised end-to-end (tooling/CDP-allowlist
  constraint) — covered via the compiled-CSS + code review above.
- The pre-existing `MANUAL-TODO.md` 🔴 items (web-project screenshots, the
  Cloudflare Pages cutover) are unrelated to V8 and unchanged.

**Verdict:** V8 is visually consistent and **export-ready** — the V7 Cloudflare
pipeline (`output: export`, `public/_redirects`, `public/_headers`) is untouched;
V8 re-exports through it cleanly. axe 0 everywhere, no console errors, no
horizontal scroll, reduced-motion honored.
