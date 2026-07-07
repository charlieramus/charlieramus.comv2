<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# charlieramus.comv2 — project rules

This is a **clean-slate rebuild** of charlieramus.com. It will **fully replace** the
current site once finished. Standard **Next.js 16 (App Router) + TypeScript +
Tailwind v4** — no forks, no scoped-CSS dumps.

## Read these first (in order)
1. **`DESIGN-BRIEF.md`** — the design north star + architecture + content data map.
2. **`ABOUT-CHARLIE.md`** — who Charlie is; the voice + facts the site must convey.
3. The current **`UPDATELOGVN.md`** for the stage you're working — do that stage,
   then fill its `# Stage N Report`.
4. **`mockups/hellodani-mockup.html`** — the visual source of truth. Self-contained
   (its own `<style>` + JS). We rebuild FROM it, cleanly.

## Hard constraints
- **Verify** with `npm run build`, `npx tsc --noEmit`, `npx eslint .`. You may
  also run the dev server (`npm run dev`) to view locally, and/or push a branch →
  Vercel builds a preview URL (never touches prod).
- **Tailwind v4 is CSS-first**: design tokens live in `app/globals.css` via
  `@theme` — there is no `tailwind.config.js`. Put the mockup's palette / fonts /
  radii there.
- Read `node_modules/next/dist/docs/` before writing Next code (fonts, layouts,
  images, css). Heed deprecations.
- Don't commit or push unless Charlie asks.

## Conventions
- Content lives as typed data in `data/*.ts` and MDX in `content/`, with
  `// CUSTOMIZE` markers so Charlie can edit copy without touching JSX.
- One component per section under `components/`. Shared primitives (`Flower`,
  `Reveal`) are reused everywhere.
- All motion respects `prefers-reduced-motion`.
- Each `UPDATELOGVN.md` stage: implement → fill `# Stage N Report` with `- [x]`
  bullets (files, how data flows) + an `Issues:` line.
