# charlieramus.comv2

A clean-slate rebuild of [charlieramus.com](https://charlieramus.com) — standard
**Next.js 16 (App Router) + TypeScript + Tailwind v4**. Design north star:
`mockups/hellodani-mockup.html`. When finished, this repo **fully replaces** the
current site.

## Make it yours

This site is built to fork. Almost everything a person edits lives in **one file**:

1. **Edit `site.config.ts`** — all the text and data: your name, bio, tagline,
   experience, projects (design + web), gear, writing manifest, social links, and
   the section copy (headings, sublines, nav labels, page ledes). It's plain data
   with `CUSTOMIZE:` notes — no components to touch. Then `npm run build`.
2. **Swap the photos** — drop your images into `public/photos/` and describe them in
   `public/photos/gallery.json`, then run `npm run sync-gallery`. That regenerates
   `data/photos.ts` (pre-sized WebP + blur placeholders) — **don't hand-edit that
   file; it's generated.**
3. **Change the decorative flowers** — the motifs sprinkled across the site are a
   small SVG registry in `data/motifs.ts`. Add your own shapes or retire the starter
   set there (see `MANUAL-TODO.md` §7 for the format).

That's the whole surface: `site.config.ts` + `public/photos/gallery.json` (+ optional
`data/motifs.ts`). You never have to open `components/` to make the site yours.

## Start here (docs)
- **`DESIGN-BRIEF.md`** — design system, architecture, content data map, motion.
- **`ABOUT-CHARLIE.md`** — the person + voice the site conveys (Charlie fills the
  brain-dump sections).
- **`ROADMAP.md`** — the V1–V5 build arc.
- **`UPDATELOGV1.md`** — the current build stage.
- **`AGENTS.md`** — rules for AI coding sessions.

## Dev
Run locally or verify statically, and preview via Vercel:

```bash
npm run dev        # local dev server
npm run build      # production build
npx tsc --noEmit   # typecheck
npx eslint .       # lint
```

Push a branch → Vercel builds a preview URL. The homepage arrives in V1; content in
V2–V3; inner pages in V4.
