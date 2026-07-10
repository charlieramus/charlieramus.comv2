# UPDATELOG V7 — CLOUDFLARE DEPLOY + CUTOVER

**First read `DESIGN-BRIEF.md`, `AGENTS.md`, the V6 stage reports, and `MANUAL-TODO.md`.**
This log **supersedes V5 Stage 5's Vercel plan** — Charlie deploys on **Cloudflare**, not
Vercel. It only needs V6 finished (a visually-done, axe-clean site); nothing here depends on
the internals of the V6 refinement work.

**The fit.** Every route in this app is already **static/SSG** — pages, the MDX essays
(`generateStaticParams` + `dynamicParams=false`), and the metadata route handlers
(`opengraph-image`, `icon`, `apple-icon`, `sitemap.xml`, `robots.txt` — all GET, no request
reads). So the clean, cheapest path is a **Next static export (`output: "export"`) →
Cloudflare Pages** (pure static hosting). No SSR, no Workers runtime needed.

**Hard constraints.**
- **Read `node_modules/next/dist/docs/` before writing Next code** — `static-exports` (supported
  vs unsupported features), `next/image` custom/`unoptimized` loader, `deploying`. Heed
  deprecations (modified Next 16).
- **Don't regress V6** — the export must render every route identically (no console errors, no
  overflow, images/blur intact, lightbox works, motifs render, finale fills the screen).
- **Cutover happens only when Charlie explicitly says so.**
- Verify with `build` (export) + `tsc` + `eslint`, then serve `out/` locally and smoke-test, then
  the Cloudflare Pages preview. Don't commit/push unless Charlie asks.

---

## Stage 1 — Static-export config + local export verify

- **`next.config.ts`** — add `output: "export"` and `images: { unoptimized: true }`. The default
  `next/image` loader is **unsupported** under export; the gallery already ships pre-sized WebP +
  `blurDataURL`, so an unoptimized `next/image` just serves the files. **Verify** the blur
  placeholders + intrinsic sizing still hold (no layout shift, no broken images).
- **`next build`** now emits an **`out/`** folder. Confirm the route map is unchanged and that the
  **metadata routes export as static files** in `out/`: `opengraph-image` / `icon` / `apple-icon`
  as PNGs, `sitemap.xml`, `robots.txt`. (ImageResponse runs at build — verify the PNGs are real,
  not empty.)
- Serve `out/` with a static server locally and smoke-test a few routes before touching Cloudflare.
- **Watch-outs to confirm during implementation:** `output: "export"` disables `next start`,
  `next.config` `redirects()`, and request-time APIs — audit that nothing in the app relies on
  them (the only `redirects()` today is `/blog → /writing`, handled in Stage 2). Decide
  `trailingSlash` behavior so Cloudflare serves `/writing/<slug>` cleanly (Pages serves
  `.../index.html`); test both link styles.

# Stage 1 Report
_TBD._

---

## Stage 2 — Redirects → Cloudflare `_redirects`

`next.config` redirects are **not** supported in a static export, so they move to Cloudflare
Pages' native redirects file.

- **`public/_redirects`** (copied into `out/` on build) — add:
  - `/blog  /writing  301` (replaces the current `next.config` redirect).
  - The **legacy article-slug map** from `MANUAL-TODO.md §5`:
    `article-one → architecture-of-self-justification`,
    `article-two → when-bigger-means-more-biased`,
    `article-three → the-third-rotation`,
    `article-four → the-hobby-hexagon-is-a-trap`.
  - **DECISION → Charlie:** confirm the old public URL prefix — `/writing/<old>`, `/blog/<old>`,
    or both — so the redirects match what search engines actually indexed. Add whichever apply.
- **Remove** the now-inert `redirects()` from `next.config.ts` (it no-ops under export).
- Verify each redirect resolves (301 → correct target) once on the Pages preview.

# Stage 2 Report
_TBD._

---

## Stage 3 — Cloudflare Pages project + preview smoke-test

Charlie owns the dashboard steps (as he would have for Vercel); no MCP connector needed.

- **Create the Pages project** — connect the repo; **build command** `next build`; **output
  directory** `out`; set the **Node version** and the **production branch**. No env vars are read
  by the app today (confirm).
- **Preview smoke-test** — on the Cloudflare Pages preview URL, check **every route** at
  **1440 / 768 / 375**:
  - no console errors; images + blur load; the photography + design **lightbox** works
    (focus-trap, arrows, Esc); internal links resolve; the **motifs** + **finale fill** render.
  - `og:image` / canonical tags are **absolute** and correct; `sitemap.xml` + `robots.txt` are
    reachable; favicon / OG PNGs render; the Stage 2 **redirects** resolve.
- Note the alternative for the record: the OpenNext Cloudflare adapter
  (`@opennextjs/cloudflare`) if SSR / on-the-fly image optimization is ever wanted — not needed
  for this fully-static site.

# Stage 3 Report
_TBD._

---

## Stage 4 — Domain cutover + full-push sign-off

- **Point the domain** — charlieramus.com DNS is already on Cloudflare; attach it (+ `www`) to
  the Pages project and retire the old site. **Only when Charlie explicitly says so.**
- **Preserve inbound links** — verify the Stage 2 redirects cover any indexed old URLs (the
  article slugs changed) so nothing 404s after cutover.
- **Final sign-off** — smoke-test **every route on the production domain** at 1440 / 768 / 375:
  no console errors, images/blur/lightbox/links/OG all good; redirects resolve; the new site
  fully replaces the old one and nothing points at the retired repo.
- **Update `MANUAL-TODO.md §5`** — replace the Vercel steps with the Cloudflare Pages + domain
  steps actually taken; check off the deploy items.

# Stage 4 Report
_TBD._
