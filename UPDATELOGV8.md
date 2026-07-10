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
_TBD._

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
_TBD._

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
_TBD._

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
_TBD._
