# UPDATELOG V6 — REFINEMENT · MOTIF SYSTEM · HOMEPAGE REWORK

**First read `DESIGN-BRIEF.md`, `AGENTS.md`, the V5 stage reports, and `MANUAL-TODO.md`.**
V5 left the site feature-complete, accessible (axe 0), and SEO-ready. **V6 is a second
polish pass focused on the _details_** plus three larger moves Charlie asked for:

1. **Chrome cleanup** — strip the script wordmark from the inner-page header, rework the
   footer copy to match the homepage contact card, and remove the footer from the bottom of
   the homepage so the flower finale fills the screen.
2. **A pluggable motif system** — turn the one hardcoded daisy into a registry of 7–10
   selectable SVG designs Charlie can swap in as the "flowers."
3. **Homepage rework** — the "A little more personal" bento + career-journey timeline are
   cramped/unviewable; re-lay the homepage to breathe across a longer (~two-screen) scroll:
   bigger cards, more whitespace, more motif accents, a readable timeline, and a better name
   for that section.

Plus a general UI-clean pass and a visual sign-off. **Deploy + cutover moved to its own log:
`UPDATELOGV7.md` (Cloudflare Pages) — it supersedes V5 Stage 5's Vercel plan and only needs V6
finished, so the two are independent.**

**Hard constraints (carry over from V5 + additions).**
- **Read `node_modules/next/dist/docs/` before writing Next code** — static export, `next/image`
  loaders, metadata routes under export, deploy. Heed deprecations (modified Next 16).
- **Tailwind v4 is CSS-first** — reuse the `@theme` tokens + component classes in `globals.css`;
  add polish in `@layer components`, no new scoped dump.
- **Don't regress V5.** Keep **axe at 0 violations**, no horizontal scroll, no console errors,
  reduced-motion honored, every route still prerenders. Re-run the axe sweep after visual work.
- **Data is still the source of truth** (`// CUSTOMIZE` markers stay). The motif registry is new
  data; the homepage rework is a re-layout of existing data, not new content.
- **Pixel-faithfulness to the mockup is intentionally relaxed** for the homepage rework
  (Stage 4) and the chrome changes — Charlie is deliberately departing from the mockup here.
  Everything else stays on-system.
- Verify each stage with `build` + `tsc` + `eslint`, then **render + eyeball** every affected
  route at 1440 / 768 / 375 (+ spot-check a short viewport for the finale fill). Don't
  commit/push unless Charlie asks.

---

## Stage 1 — Chrome cleanup: header wordmark, footer copy, homepage footer

Small, high-signal edits to the shared chrome.

- **Inner-page header (`components/site-header.tsx` + `.site-header*` CSS)** — remove the
  script **"charlie ramus"** wordmark (`.site-logo`, `--font-script`). Keep the cross-nav
  (`Work · Design · Photography · Writing · Gear`) exactly as it is (Charlie likes it).
  - **DECISION → Charlie:** what sits top-left where the wordmark was?
    (a) nothing — the nav left-aligns / centers;
    (b) **a small brand motif mark that links home** *(recommended — keeps a home affordance,
    on-brand, no script font)*;
    (c) a tiny plain-text "CR" home link.
    _Draft assumes (b): a small motif (the new Stage 3 mark) as the home link._
- **Footer copy (`components/site-footer.tsx`)** — replace **"Think we vibe?"**
  (`.site-footer-vibe`) with **"Looking to reach me?"** and keep the **"Get in touch"** button,
  so the inner-page footer CTA reads exactly like the homepage contact card (`.vibe` +
  `.huge`). No other footer change (socials + legal stay).
- **Homepage footer removal (`app/page.tsx`)** — drop the `<footer className="legal-min">`
  copyright line so **nothing sits below the flower finale** (sets up Stage 2's fill-the-screen).
  - **DECISION → Charlie:** where the © line goes now —
    (a) **a tiny, unobtrusive © pinned in a corner of the finale** *(recommended — keeps the
    legal line without adding chrome below the flowers)*;
    (b) drop the homepage © entirely (it still lives in the inner-page footer);
    (c) keep it but restyle so it doesn't break the fill.
    _Draft assumes (a)._
- Leave the **homepage hero nav** (`work · photography · about`) as-is — Charlie didn't object.

# Stage 1 Report

Chrome cleanup landed. Both **DECISION → Charlie** points were answered by Charlie
(not the draft defaults):

- **Header mark → (a) nothing, nav left-aligns.**
- **Homepage © → (b) dropped entirely** (it still lives in the inner-page footer).

- [x] **`components/site-header.tsx`** — removed the `<Link href="/" className="site-logo">charlie
  ramus</Link>` script wordmark. The header is now nav-only; `.site-header-inner`'s
  `justify-content: space-between` leaves the single `<nav>` left-aligned inside `.wrap`. The
  cross-nav (Work · Design · Photography · Writing · Gear) and its active-state logic are
  untouched. Updated the file's top comment to reflect the wordmark removal. `Link` is still
  imported (used by the nav links).
- [x] **`components/site-footer.tsx`** — replaced `Think we vibe?` with **`Looking to reach me?`**
  in `.site-footer-vibe`. The `Get in touch` mailto button, socials row, and legal line are
  unchanged, so the inner-page footer CTA now reads like the homepage contact card.
- [x] **`app/page.tsx`** — deleted the `<footer className="legal-min">© {year} …</footer>` block
  (and its `CUSTOMIZE` comment) so nothing sits below `<Finale />`. `snapshot` stays imported
  (still used by the `personLd` structured data).
- [x] **`app/globals.css`** — removed the now-dead `.site-logo` / `.site-logo:hover` rules and the
  `.legal-min` rule (both were only used by the two elements deleted above; remaining refs are
  docs + the mockup). The `--font-script` token stays (still used elsewhere, e.g. `.script`).

**Data flow:** no data changes — this is pure chrome. Footer/header still read from
`data/socials.ts` + `data/about.ts`; the homepage © was static JSX and is simply gone.

**Verify:** `npx tsc --noEmit` clean · `npx eslint .` clean · `npm run build` clean (all 18
routes still prerender static/SSG). Rendered `/writing` at 1440 + 375 — header is nav-only, no
wordmark; footer reads "Looking to reach me? / Get in touch". Rendered `/` at 1440 scrolled to
bottom — the flower finale is the last thing on the page, no © line beneath it; `.legal-min` is
absent from the DOM.

**Issues:** None in the shipped code. Turbopack's dev server threw a stale
`global-error.js` React-Client-Manifest error after in-place edits (a known Next 16 HMR caching
artifact, per the `[[turbopack-stale-css]]` note); clearing `.next` and restarting resolved it.
The production `build` was clean throughout, so this was dev-only. Leftover HMR-websocket 500s in
the dev console trace to the earlier killed dev process, not to any Stage 1 change.

---

## Stage 2 — The flower finale fills the screen

Make the closing flower field a deliberate, full-viewport moment.

- **`components/finale.tsx` + `.finale` / `.grid-flowers` / `.center-text` CSS** — give the
  finale `min-height: 100svh` (use `svh`/`dvh`, not `vh`, so mobile browser chrome doesn't
  clip it) and center the quote + flower grid so scrolling to the bottom lands on a flower
  field that **perfectly fills the screen** with no chrome beneath it.
- Verify the fill at **1440 / 768 / 375** and a couple of viewport *heights* (short laptop,
  tall phone) — the grid should scale/crop gracefully, never leave a gap or force a second
  scroll past it.
- Fold in the © per the Stage 1 decision (tiny, non-intrusive) if (a) was chosen.
- Reduced-motion: the flower wind-spin already disables under `prefers-reduced-motion`; keep it.

# Stage 2 Report
_TBD._

---

## Stage 3 — Pluggable motif system (make the "flowers" swappable)

**Today the flower is one hardcoded daisy** (`components/flower.tsx` generates ellipse petals
+ a circle core; `lib/flower-svg.ts` mirrors it for OG/icons). Color and petal-count vary; the
**shape does not**. This stage turns it into a registry Charlie can populate with 7–10 SVGs.

- **New `data/motifs.ts` registry** — a typed list of named motif designs. Each entry:
  - an **SVG** (viewBox `0 0 100 100`) authored as inline markup or a small render function;
  - declared **color slots** (1 or 2 — e.g. `fill`/`accent`) so any SVG tints cleanly via CSS
    vars / `currentColor`, whether or not it has "petal/core" structure;
  - an optional **`spin: false`** for designs that shouldn't rotate.
  - Ship the existing daisy as one default entry so nothing regresses on day one.
- **`components/motif.tsx`** (rename/generalize `Flower`) — renders a motif **by key**, keeps
  the deterministic **index-seeded wind-spin** (`--spin-dur`/`--spin-delay`, no `Math.random`),
  the color/tint props, and `aria-hidden`. Old `<Flower>` becomes a thin alias or is replaced
  at all call sites.
- **`activeMotifs` selection** — a small list of which registry keys are "in rotation." Render
  sites pick deterministically by index so fields stay varied + desynced (same discipline as
  today's flower field). One switch changes the whole site's motif set.
- **Wire every render site** to the registry: `hero`, `finale`, `personal-bento`, `work`,
  `web-projects` placeholders, and **`lib/flower-svg.ts`** (so the generated OG card + favicon
  use the active motif too).
- **CUSTOMIZE workflow (documented in `data/motifs.ts` + `MANUAL-TODO.md`):** paste an SVG into
  the registry, add its key to `activeMotifs`, done — no component edits.
- **DECISION → Charlie:** supply the 7–10 SVGs now, or ship with the daisy **+ a few starter
  shapes I author** (simple geometric blooms/stars/etc.) as placeholders he swaps later?
  _Draft assumes: build the system + a small starter set, Charlie swaps in his own SVGs via
  `MANUAL-TODO.md`._
- Keep it SSR-safe (no hydration drift) and reduced-motion-safe.

# Stage 3 Report
_TBD._

---

## Stage 4 — Homepage rework: two-scroll, breathing room, the bento + timeline

The heart of V6. The "A little more personal" bento and the career-journey timeline are
cramped and, per Charlie, **unviewable**. Re-lay the homepage so it breathes.

- **Rename the section** ("A little more personal" — Charlie finds it awkward/suggestive).
  - **DECISION → Charlie:** options — **"Beyond the code"** *(recommended)*, "Off the screen",
    "The other stuff", "More than code", "Life outside the repo". _Draft assumes "Beyond the code."_
- **Career journey (`components/personal-bento.tsx` `.cj*` CSS)** — replace the fixed-pixel,
  absolutely-positioned timeline (the `AXIS_BOTTOM` / `roleTop` math) with a **readable, spacious
  vertical timeline**: real vertical rhythm, larger type, comfortable tap targets, honest year
  axis. It should be legible at 375 without overlap.
- **Spread the bento across ~two viewports** — fewer, bigger cards per row; generous whitespace;
  motif accents between blocks; let sections breathe instead of packing one screen. "More
  flowers, more whitespace, more fun" (Charlie). Same data, calmer layout.
- Keep it **data-driven** (experience, writing, photos, design projects) — this is a re-layout,
  not new content.
- **Guardrails:** no horizontal overflow at any width; **axe stays 0**; reduced-motion honored on
  the new reveals/motifs; the real-photo bento tiles + "Right now" photo card (V5 Stage 2) survive
  the rework.

# Stage 4 Report
_TBD._

---

## Stage 5 — General UI clean pass (the minor details)

A section-by-section detail sweep now that the big moves have landed.

- **Sweep every section at 1440 / 768 / 375** (spot-check 320 + 1920): spacing rhythm, type
  scale, alignment, gaps, tap-target sizes, awkward wraps, cramped mobile states. Sections:
  hero, digital-home carousel, right-now strip, the reworked bento + timeline, work bands,
  services fan, about collage, contact card, finale — plus the inner pages (writing, photography,
  web-projects, design, gear).
- **Digital-home carousel** — decide the placeholder browser-window shots vs real screenshots
  (ties to `MANUAL-TODO.md §1`; the white-on-orange caption contrast noted in V5 Stage 3 gets
  resolved when real shots or a scrim land).
- **Consistency** — motif usage, whitespace rhythm, and type scale read as one system across
  home + inner pages. No orphaned V5 artifacts (e.g. the old wordmark spacing).
- Re-confirm **axe 0**, no horizontal overflow, no console errors on every route/width.

# Stage 5 Report
_TBD._

---

## Stage 6 — Verify + consistency (visual sign-off, feature-complete ahead of V7)

The V6 gate. No deploy here — that's `UPDATELOGV7.md`.

- `tsc` / `eslint` / `build` all clean; every route still prerenders (static/SSG).
- **Render + eyeball** every route at 1440 / 768 / 375 (+ a short viewport for the finale):
  **axe 0 violations**, no horizontal overflow, no console errors.
- Spot-check the V6 moves end-to-end:
  - **Motif system** — changing `activeMotifs` swaps the whole site's motifs **and** the
    generated OG card + favicon; SSR-safe, reduced-motion-safe.
  - **Finale** fills the screen at multiple viewport heights, nothing below it.
  - **Header** = nav only (script wordmark gone); **footer** reads "Looking to reach me? /
    Get in touch"; no footer under the homepage finale.
  - **Reworked bento + timeline** are legible on mobile; the V5 real-photo tiles + "Right now"
    photo card survive the re-layout.
- Confirm the site is **visually done and internally consistent**, feature-complete ahead of the
  **V7 Cloudflare deploy**. List anything deliberately left.

# Stage 6 Report
_TBD._
