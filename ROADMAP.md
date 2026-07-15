# ROADMAP — charlieramus.comv2

The build runs in staged `UPDATELOGVN.md` logs, each in its own fresh session.
Design-first: get the look right on a static page before wiring real content.

- **V1 — Foundation & design system** _(design-first)_
  Translate the mockup into a Tailwind v4 theme (palette, the 3 fonts via
  next/font, radii, spacing) in `app/globals.css`. Build shared primitives
  `Flower` (wind-spin, deterministic per-index variance, reduced-motion) and
  `Reveal`. Render the mockup as **one pixel-right static homepage** with
  placeholder copy — this is where "execution" gets fixed. → `UPDATELOGV1.md`

- **V2 — Content model**
  Flesh out `data/*.ts` + `content/` from the current site's text +
  `ABOUT-CHARLIE.md` brain-dump. Real experience, projects, gear, socials, photos,
  writing.

- **V3 — Homepage wired**
  Replace placeholders with the real sections in order: hero → digital-home →
  personal → work → services → about → contact → finale. Done right.

- **V4 — Inner pages**
  /photography (gallery + loading/blur pipeline), /writing/[slug], /blog, /design,
  /gear, /web-projects — all reskinned to the system.
  _Web-project detail pages (`/web-projects/<slug>`) rebuilt as screenshot-forward
  editorial case studies (V11 + V12): hero → cards → process → squares → article →
  wide → full-bleed → banner → next-project, every section optional + config-driven,
  with a reduced-motion-gated hover-grow. **Done.** Remaining: real screenshots for
  the placeholder image slots + authoring the other projects' copy (see MANUAL-TODO)._

- **V5 — Polish, responsive, a11y, deploy → cutover**
  Full pass at 1440/768/375; a11y sweep; deploy. Then point charlieramus.com at
  this repo and retire the old one — **only when Charlie explicitly says so.**
