# charlieramus.comv2

A clean-slate rebuild of [charlieramus.com](https://charlieramus.com) — standard
**Next.js 16 (App Router) + TypeScript + Tailwind v4**. Design north star:
`mockups/hellodani-mockup.html`. When finished, this repo **fully replaces** the
current site.

## Start here (docs)
- **`DESIGN-BRIEF.md`** — design system, architecture, content data map, motion.
- **`ABOUT-CHARLIE.md`** — the person + voice the site conveys (Charlie fills the
  brain-dump sections).
- **`ROADMAP.md`** — the V1–V5 build arc.
- **`UPDATELOGV1.md`** — the current build stage.
- **`AGENTS.md`** — rules for AI coding sessions.

## Dev
This machine can't run a dev server or browser automation (both crash it). Verify
statically and preview via Vercel:

```bash
npm run build      # production build
npx tsc --noEmit   # typecheck
npx eslint .       # lint
```

Push a branch → Vercel builds a preview URL. The homepage arrives in V1; content in
V2–V3; inner pages in V4.
