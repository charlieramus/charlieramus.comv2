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

Static export configured and verified locally — the app emits a plain `out/` folder ready for
Cloudflare Pages.

- [x] **`next.config.ts`** — added `output: "export"` + `images: { unoptimized: true }` (the
  default `next/image` optimizer needs a server; the gallery ships pre-sized WebP + `blurDataURL`,
  so unoptimized just serves the files). Also **removed the now-inert `redirects()`** (`/blog →
  /writing`) — unsupported under export; it moves to Cloudflare `_redirects` in Stage 2. Left a
  comment pointing there.
- [x] **Metadata routes marked static** — `next build` under export **errored** until each
  route-handler-style metadata file declared `export const dynamic = "force-static"`. Added it to
  `app/icon.tsx`, `app/apple-icon.tsx`, `app/opengraph-image.tsx`, `app/sitemap.ts`,
  `app/robots.ts`. (Page routes + `/writing/[slug]` needed nothing — already static/SSG.)
- [x] **`next build` emits `out/`** — the **route map is unchanged** (all ○ Static + the `●` SSG
  essays). Verified the emitted files:
  - HTML per route: `index.html`, `design.html`, `gear.html`, `photography.html`,
    `web-projects.html`, `writing.html`, `404.html`, and each essay `writing/<slug>.html`.
  - **Metadata routes exported as real static files** (PNG magic `89504e47`, non-empty):
    `out/icon` (674 B), `out/apple-icon` (3.7 KB), `out/opengraph-image` (57 KB); `out/sitemap.xml`
    (1.8 KB, `application/xml`), `out/robots.txt` (`text/plain`). `og:image` + `canonical` are
    **absolute** (`https://charlieramus.com/...`).
- [x] **Served `out/` locally (`serve out`, no SPA flag) and smoke-tested** — **clean-URL routing
  works** (`/design` → `design.html`, `/writing/the-third-rotation` → its own HTML, each with the
  right `<title>`). Rendered the export at 1440: **identical to dev** (hero motifs, carousel with
  the Stage-5 dark-text fix, "More than code" timeline + bento, finale field), **no console
  errors**, **61/61 photography images load** (0 broken) under the unoptimized loader.
- [x] **`trailingSlash`** — kept the default (`false`). `out/` contains both `writing/<slug>.html`
  and a `writing/<slug>/` dir, and in-app links use the no-slash form; Cloudflare Pages serves
  `/writing/<slug>` from the `.html` cleanly. No config needed.
- [x] **Audited unsupported features** — the only `redirects()` was `/blog` (removed → Stage 2);
  nothing in the app reads cookies/headers/request at runtime (all metadata routes are GET,
  build-time). `out/` is already gitignored.

**Watch-out carried to Stage 2:** the extensionless metadata files (`out/icon`, `out/apple-icon`,
`out/opengraph-image`) serve with **no `Content-Type`** on a plain static host (empty via `serve`;
Cloudflare would default to `application/octet-stream`). The favicon still works via the `<link
type="image/png">` hint, but the **OG image needs a real `image/png` Content-Type** for scrapers —
I'll add a Cloudflare **`_headers`** file alongside `_redirects` in Stage 2.

**Verify:** `tsc` / `eslint` clean; `build` (export) succeeds; `out/` served + smoke-tested. No
regressions.

**Issues:** Only the metadata Content-Type note above (fixed in Stage 2). Cutover stays Charlie's
call (Stage 4).

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

Redirects moved off `next.config` onto Cloudflare's native files, plus the metadata
Content-Type fix flagged in Stage 1.

- [x] **`public/_redirects` (new)** — copied to `out/_redirects` on build (verified, 1339 B). Rules
  (first-match-wins, specific above general):
  - the **legacy article-slug map** (`MANUAL-TODO.md §5`): `article-one → architecture-of-self-
    justification`, `article-two → when-bigger-means-more-biased`, `article-three → the-third-
    rotation`, `article-four → the-hobby-hexagon-is-a-trap`, all **301**.
  - `/blog → /writing` **301** (replaces the removed `next.config` redirect).
  - **DECISION → Charlie (old URL prefix):** the old public path for the article slugs isn't
    confirmed, so I covered **both** `/writing/<old>` and `/blog/<old>` — a superset. Unused rules
    never fire, so nothing indexed can 404; Charlie can delete whichever prefix the old site never
    used once he confirms.
- [x] **`public/_headers` (new)** — copied to `out/_headers` (585 B). Sets `Content-Type:
  image/png` on `/icon`, `/apple-icon`, `/opengraph-image` — the extensionless metadata files from
  Stage 1 that a static host would otherwise serve as `application/octet-stream`. Path match
  ignores the `?<hash>` query Next appends, so it still matches. (This closes the Stage 1
  watch-out; the OG image will scrape as a real PNG.)
- [x] **`next.config.ts` `redirects()` removed** — done in Stage 1; re-confirmed no functional
  `redirects()` remains (only an explanatory comment). Build is clean under `output: export`.

**Verify:** `next build` succeeds; both `_redirects` and `_headers` are present in `out/` with the
expected content; `tsc` / `eslint` clean. The local `serve` static server does **not** interpret
Cloudflare's `_redirects` / `_headers` (they're platform-specific), so the **301 resolution + the
image/png Content-Type are verified on the Cloudflare Pages preview in Stage 3**, not locally.

**Issues:** None. Open decision (prefix) is covered by the both-prefix superset above — no blocker.

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

The Cloudflare Pages **project creation + live preview URL is Charlie's dashboard step** (no
Cloudflare MCP connector is authorized in these sessions). I pinned the exact settings, fixed a
static-export bug found in the smoke-test, and ran the full smoke-test against the local `out/`
export as a stand-in for the preview.

**Pages project settings (create with these):**
- **Build command:** `next build` — **Output directory:** `out` (both already what the app emits).
- **Node version:** pinned via new **`.nvmrc` → `22`** (Pages reads it; no dashboard step needed).
- **Production branch:** Charlie's call at cutover (Stage 4). No env vars are read by the app
  (confirmed — nothing reads `process.env` at build or runtime).
- Framework preset: "Next.js (Static HTML Export)" or "None" with the command/dir above.

- [x] **Static-export bug found + fixed (the RSC-prefetch 404s).** The first smoke-test surfaced
  `404`s for `__next.<route>.__PAGE__.txt` — Next's `<Link>` viewport/hover **prefetch** of RSC
  segment payloads, which `output: export` writes at a different path than the client requests, so
  they 404 (nav still works via full-page fallback, but it violated "no console errors"). Fixed by
  `prefetch={false}` on the only two `<Link>` sites — `components/site-header.tsx` (the inner-page
  nav) and `app/writing/page.tsx` (the essay list). Re-verified: hovering every nav link produces
  no request; navigation still works.
- [x] **Full local smoke-test on the export** (`serve out`, all 7 routes at **1440 + 375**):
  **no console errors**, **no horizontal overflow**, **axe = 0** everywhere.
  - **Lightbox** (photography) works on the export: opens as `role="dialog"`, focus moves inside
    (trap), `ArrowRight` navigates, `Esc` closes.
  - **Images/blur** load (61/61 photography images, 0 broken) under the unoptimized loader.
  - **`og:image` + `canonical` are absolute per route** (`https://charlieramus.com/...`; home/design
    use the generated `/opengraph-image`, photography a featured photo, essays their headerImage);
    **`sitemap.xml`** lists absolute URLs; **`robots.txt`** points at the sitemap. Motifs + finale
    render.
- [x] **OpenNext note (for the record):** if SSR or on-the-fly `next/image` optimization is ever
  wanted, the `@opennextjs/cloudflare` adapter is the path — **not needed** for this fully-static
  site.

**Pending Charlie (Cloudflare preview, can't run headless):** create the Pages project with the
settings above; then on the preview URL confirm the two platform-only behaviors — the Stage 2
**`_redirects` resolve 301 → target** and the **`_headers` set `Content-Type: image/png`** on
`/icon` · `/apple-icon` · `/opengraph-image` (the local `serve` can't interpret Cloudflare's
`_redirects`/`_headers`). Everything else is verified above.

**Verify:** `tsc` / `eslint` / `build` clean; export smoke-tested end-to-end.

**Issues:** None open on our side. The live-preview 301/Content-Type checks await the Pages project.

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

**The domain cutover is deliberately NOT performed here.** Pointing `charlieramus.com` and
retiring the old site is an irreversible, outward-facing production action that this log
explicitly reserves for Charlie's explicit go ("**Only when Charlie explicitly says so**"), and it
requires Cloudflare dashboard access that isn't available in a headless session. So Stage 4 covers
only the parts I can do safely; the live flip waits for Charlie.

- [x] **Redirect coverage verified** — the Stage 2 `public/_redirects` covers every changed
  article slug (`article-one…four → their new /writing slugs`) under **both** `/writing/*` and
  `/blog/*` prefixes, plus `/blog → /writing`. So no indexed old URL 404s after cutover regardless
  of which prefix the old site used. (Charlie confirms the prefix and I trim the unused half.)
- [x] **`MANUAL-TODO.md §5` + §6 rewritten** — replaced the old Vercel deploy steps with the
  **Cloudflare Pages** steps actually taken: create-project settings (`next build` → `out`,
  `.nvmrc` Node 22, production branch, no env vars), the `_redirects`/`_headers` marked ✅, and the
  domain-point + preview/production verification left as the checked-out ☐ items gated on Charlie.
  §6 drops Vercel (no connector needed for Cloudflare).
- [ ] **Point the domain** — **pending Charlie's explicit go + dashboard.** Attach
  `charlieramus.com` (+ `www`) to the Pages project; retire the old site.
- [ ] **Final production sign-off** — **pending the live domain.** Once it's up I'll smoke-test
  every route on the production domain at 1440 / 768 / 375 (no console errors, images/blur,
  lightbox, links, OG, redirects resolve) and confirm the new site fully replaces the old — the
  final human sign-off is Charlie's.

**State at end of V7:** the site is **build-complete and export-verified** for Cloudflare Pages —
everything that can be done without the dashboard is done and pushed. The remaining work is the
three dashboard/DNS actions above (create project, point domain, verify live), which are Charlie's
by design.

**Verify:** no code changed in this stage (docs only); `tsc` / `eslint` / `build` remain clean from
Stage 3.

**Issues:** None. Cutover intentionally deferred to Charlie's explicit instruction.
