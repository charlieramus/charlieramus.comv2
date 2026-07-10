# MANUAL TODO — everything Charlie supplies by hand

This is the single running checklist of things **only Charlie can provide** to finish
charlieramus.comv2 — real assets, real links, decisions, credentials, and the deploy
steps an agent can't do in a headless session. It spans the **whole project**, not just
one stage. Items are grouped by the V5 stage that consumes them.

**How to use it:** drop files where each item says (or paste them into chat and I'll
place them), fill the tables, then tell me and I wire them into the typed data +
frontmatter. Check items off as they land.

Legend: 🔴 blocks shipping · 🟡 polish / nice-to-have · ✅ decided, no action needed

---

## 1 · Web-project screenshots  (V5 Stage 1)  🔴

4 of 6 web projects render a `<Flower>` placeholder because no screenshot exists.
**Decision (Charlie):** *"I'll supply screenshots."* So these are waiting on image files.

Give me a screenshot for each project below. **Format:** landscape, roughly **16:10**
(e.g. 1600×1000), any of PNG/JPG/WebP — I'll convert to optimized **WebP** and wire it
into `data/projects-web.ts` → `webProjects[].image`. Drop them in chat, or into
`public/images/web/` yourself using the target filename listed.

| Project | Status | Target file | You provide |
|---|---|---|---|
| **Querryn** | placeholder | `/images/web/querryn.webp` | ☐ screenshot |
| **VaultDNA** | placeholder | `/images/web/vaultdna.webp` | ☐ screenshot |
| **Browser-automation experiments** | placeholder | `/images/web/browser-automation.webp` | ☐ screenshot |
| **Ostiara** | ✅ stays placeholder | — | stealth — no shot, keeps the Flower by design |
| MyLifeInARepo | ✅ done | `/images/web/mylifeinarepo.webp` | already wired |
| charlieramus.com | ✅ done | `/images/web/charlieramus-com.webp` | already wired |

> Any project you'd rather keep as a decorative Flower is fine too — just say so and I
> leave it. Also add `href` links if any of these now have a live URL / public repo
> (Querryn, VaultDNA, Browser-automation all have `href: ""` → the link is hidden).

---

## 2 · Gear links & notes  (V5 Stage 1)  🟡

Every item in `data/gear.ts` has an empty `href` (no link) and some have empty `note`.
**Decision (Charlie):** *"I'll add them later."* Fill any rows you want and I'll wire them
(a set `href` turns the name into a link; a set `note` shows the small grey label).

| Section | Item | `note` (short label) | `href` (product/retailer URL) |
|---|---|---|---|
| Bodies | Canon EOS R5 | Primary body *(set)* | ☐ |
| Bodies | DJI Air 2s Combo | Primary drone *(set)* | ☐ |
| Lenses | Canon RF 24-105mm f/4 | ☐ | ☐ |
| Lenses | Sigma 150-600mm f/5.6-6.3 | ☐ | ☐ |
| Bags | Kiboko V1 30L+ | Long travel / high capacity *(set)* | ☐ |
| Bags | Thule Aspect V2 | Everyday carry *(set)* | ☐ |
| Accessories | Carbon-fiber tripod | ☐ *(exact model?)* | ☐ |
| Accessories | Deity V-Mic D4 Mini | ☐ | ☐ |

> Leaving them all blank is a valid ship state — gear reads fine as a plain name→note
> list. This is polish, not a blocker.

---

## 3 · Writing & content confirmations  (V5 Stage 1)  🟡 / ✅

- ✅ **Hobby-Hexagon essay header** — **Decision (Charlie): ship headerless.** No action.
  The other 3 essays have their header images; this one intentionally has none.
- ☐ **Essay external links** (🟡) — all 4 essays have `externalLink: ""`. If any was
  published somewhere (Substack, Medium, a Google Doc) and you want a "Read on …" button,
  give me the URL + label per slug.
- ☐ **Web-project dates** (🟡) — `projects-web.ts` notes some dates are approximate
  ("confirm"). Skim and correct any that are wrong.
- ☐ **Experience org links** (🟡) — two roles in `data/experience.ts` have `href: ""`:
  *Stealth Startup (Ostiara)* (expected — stealth) and *Content Creator & Builder* (Roblox
  / Bloxburg). If you want the community linked, give me a URL.
- ☐ **New projects** — **Decision (Charlie): none to add** right now. If that changes,
  give me title / date / description / tags / link / images and I'll add them to
  `projects-web.ts` or `projects-design.ts`.

---

## 4 · SEO, metadata, OG images, icons  (V5 Stage 4)  ✅ built (swappable)

**Stage 4 is done** — all of this now ships, generated from the brand. Swap any of it
whenever you want a custom asset; nothing here blocks shipping.

- ✅ **Canonical production URL** — defaulted to `https://charlieramus.com` in
  `data/site.ts` (drives `metadataBase`, per-route canonicals, sitemap, robots, JSON-LD).
  **Change it in that one file** if the domain ever differs.
- ✅ **Default site OG image** — generated at `app/opengraph-image.tsx` (brand daisies +
  wordmark + roles + tagline). To replace with your own, drop a real `opengraph-image.png`
  (1200×630) in `app/` and delete the `.tsx`.
- ✅ **Favicon / app icons** — generated red daisy at `app/icon.tsx` + `app/apple-icon.tsx`
  (the old `favicon.ico` scaffold still serves as a fallback). To replace, drop a real
  `icon.png` / `apple-icon.png` in `app/` (and a real `favicon.ico`) and delete the `.tsx`.
- 🟡 **Essay share descriptions** (optional) — essay `<meta name="description">` currently
  reads "*<title> — an essay by Charlie Ramus.*" (there's no excerpt field). If you want a
  real one-line summary per essay for search snippets, add an `excerpt:` line to each MDX
  frontmatter and I'll wire it in.

---

## 5 · Deploy + cutover  (V5 Stage 5)  🔴

The agent can't do these in a headless session — they're yours, and the **cutover happens
only when you explicitly say so**.

- ☐ **Authorize the Vercel connector** 🔴 — the Vercel MCP connector is **not authorized**
  in these sessions, so I can't read the preview URL or drive a deploy. Authorize it in
  your claude.ai connector settings (or use the Vercel dashboard directly).
- ☐ **Connect the repo on Vercel** 🔴 — import the repo, set the **production branch** and
  **project settings**.
- ☐ **Environment variables** 🔴 — the app currently reads **none** at build/runtime, so
  there's likely nothing to set; confirm once connected (add any you introduce here).
- ☐ **Point the domain** 🔴 — attach **charlieramus.com** (+ `www`) to the new Vercel
  project and retire the old one. **Only when you say go.**
- ☐ **Legacy article redirects** 🔴 — the old site's article slugs changed. Add these to
  `next.config.ts` `redirects()` if the old URLs are indexed (I can add them on your word —
  confirm the old path prefix was `/writing/…`, `/blog/…`, or both):

  | Old slug | New slug (`/writing/…`) |
  |---|---|
  | `article-one` | `architecture-of-self-justification` |
  | `article-two` | `when-bigger-means-more-biased` |
  | `article-three` | `the-third-rotation` |
  | `article-four` | `the-hobby-hexagon-is-a-trap` |

  (`/blog → /writing` is already redirected in `next.config.ts`.)
- ☐ **Post-deploy smoke test** — after the production URL is live I'll re-verify every
  route at 1440 / 768 / 375 (no console errors, images/blur load, lightbox works, links
  resolve); the final human sign-off that the new site fully replaces the old is yours.

---

## 6 · Connector authorizations  🔴 (as needed)

These MCP connectors are unauthorized in the current sessions and gate specific features:

- ☐ **Vercel** — deploy status + preview URLs (see §5).
- ☐ **Intercom** — only if you want support-chat wired in; not currently in scope.

Authorize via your claude.ai connector settings (or `claude mcp` / `/mcp` in an
interactive session). I can't run the OAuth flow from here.

---

_Ping me when any of the 🔴 items land and I'll wire them in immediately._
