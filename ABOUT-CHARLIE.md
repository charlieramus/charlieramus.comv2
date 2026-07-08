# ABOUT CHARLIE

The human source of truth for the site's content + voice. Two kinds of text below:

- **[SEEDED]** — pulled from the current charlieramus.com. Accurate but terse; keep,
  cut, or rewrite.
- **[BRAIN-DUMP → Charlie]** — empty prompts. Charlie fills these in his own words
  (bullet fragments are fine — messy is fine). This is the "ton of info about me"
  the site is built from. The build sessions turn it into copy + `data/*.ts`.

> How to use: Charlie writes freely under each **[BRAIN-DUMP]** heading (or pastes a
> dump anywhere and we sort it). Nothing here needs to be polished — voice and
> polish are the build's job.

---

## 1. The one-liner

**[SEEDED]** High school junior in Boulder who builds software, creates content,
and plenty more.

**[BRAIN-DUMP → Charlie]** _If someone lands on the site and reads one sentence,
what should it say? A few attempts:_

---

## 2. Who I am / the story

**[SEEDED]**
- Self-taught web development and Python; ships projects on GitHub.
- Launched a few e-commerce stores — none took off, but they taught business as
  much as coding.
- Creates architecture content that grew into a global community of builders —
  **300,000+ impressions** across the work. Started as genuine enjoyment; became an
  exercise in showing up consistently and building something real with people
  online.
- Currently focused on **tools for academics**; plans to keep building projects for
  years. Lots of ideas to bring to life; wants to keep sharing the journey.

**[BRAIN-DUMP → Charlie]** _The fuller story — how you got into this, what actually
drives you, what you're proud of, what you're bad at, what's next. Don't
self-edit._

---

## 3. Voice / tone

_How should the site sound? The mockup's copy is playful ("Think we vibe?",
"Great design is always hidden in the plain sight"). Is that you, or drier, or
sharper?_

**[BRAIN-DUMP → Charlie]** _Words/phrases you'd use. Sites whose writing you like.
Anything that should NEVER appear (buzzwords, "passionate", etc.)._

---

## 4. Work — the projects

### Software / web  **[SEEDED, needs detail]**
- **Ostiara** (stealth) — app for door-to-door salespeople to optimize their work;
  built for salespeople / enterprises. `github.com/charlieramus/ostiara`.
- Older: personal site (charlieramus.com), a landscaping site (WELandscape), a
  personal journal app, e-commerce stores.

**[BRAIN-DUMP → Charlie]** _For each: what it is, why you built it, the hard part,
the outcome, links/screens. Which ones deserve the spotlight?_

### Design  **[SEEDED]**
- **Notion Brand Pitch** (2025) — 10-slide brand strategy pitch; full brand audit →
  new visual identity. Figma.
- **Spotify IMC Campaign** (2025) — 6-panel integrated marketing poster board.
- **Photography Presentation UI** (2024) — editorial, typography-forward slide UI
  around travel photography.

**[BRAIN-DUMP → Charlie]** _Anything newer? What each says about you as a designer?_

### Content / community  **[SEEDED]**
- Architecture-building community, 300k+ interactions; tutorials + original builds;
  Figma + 3D modeling.

**[BRAIN-DUMP → Charlie]** _Platform(s), handles, numbers you're proud of, what the
community is._

---

## 5. Experience / roles  **[SEEDED — from data/experience.ts]**
- **Stealth Startup** (2026–present) — building Ostiara.
- **Liberty Puzzles** — TA & Media Manager, seasonal (2026–present): puzzle
  assembly, customer tours, social/content.
- **Content Creator & Builder** (2025–present) — the architecture community.

**[BRAIN-DUMP → Charlie]** _Anything missing, dates to fix, or roles to add._

---

## 6. Photography  **[SEEDED]**
- Shoots on a **Canon EOS R5**; drone work on a **DJI Air 2s**. Lenses incl. RF
  24-105 f/4 and Sigma 150-600. Travel photography (Florida, British Virgin
  Islands…).

**[BRAIN-DUMP → Charlie]** _What you shoot, favorite work, where the galleries
should point (Instagram @chahramii), what photography means to you._

---

## 7. Writing  **[SEEDED — content/writing]**
Essays exist (LLM bias & scale; "The Third Rotation"; self-justification &
pride; + one more). Mix of technical + reflective.

**[BRAIN-DUMP → Charlie]** _What you write about and why; which pieces matter most._

---

## 8. Links  **[SEEDED — data/socials.ts]**
LinkedIn · GitHub (`charlieramus`) · Instagram `@chahramii` (photography) ·
Instagram `@charlieramus_` (personal) · Letterboxd `cwramus`.

**[BRAIN-DUMP → Charlie]** _Anything to add/drop. Preferred contact (email?)._

---

## 9. Anything else
**[BRAIN-DUMP → Charlie]** _Boulder, school, interests outside tech, film taste
(Letterboxd!), what you want people to feel on the site. Dump it all._

# About Charlie

## Snapshot

High school junior based in Boulder, Colorado. Self taught developer who builds full products solo, from backend architecture to design systems to marketing copy, working mostly in Next.js, TypeScript and Tailwind with Claude Code as a daily collaborator.

## Flagship Project: Ostiara

A SaaS platform for door to door sales teams across home service verticals like pest control, solar, roofing, fencing and security.

Built solo end to end:

- Full marketing site with six routes and a full copy audit, correcting language that implied a free trial once the actual model became a free tier of 25 house lookups per session
- Admin dashboard at /dashboard/admin
- Teams and roles system built on Clerk Organizations rather than pure Supabase, with a lightweight teams mirror table synced by webhook and row level security helpers that read org id and role straight from the JWT
- A custom design system: Cabinet Grotesk and Geist typography, a violet accent (#8C43F6), tabular numerals on every price and stat, no gradients and no centered layouts

Ran customer discovery interviews on how reps across different home service verticals actually generate on site price quotes, and found a real split between reps who work off fixed price menus and reps whose quotes depend on measurements taken on site. That distinction changes what the tool needs to do for each group.

## Side Projects

**VaultDNA**
An Obsidian plugin that encodes a personal knowledge base into synthetic DNA sequences, built around real DNA storage constraints like homopolymer run limits and GC content biasing. Scoped as a quick one to two week build running alongside Ostiara.

**MyLifeInARepo**
A personal life tracking system built as a git repo of daily markdown files, parsed into structured data and rendered through a Next.js dashboard. Includes a financial module for net worth, budgeting and cash flow forecasting, a bank statement import pipeline and a transaction categorization engine modeled on how Monarch Money handles rule based categorization.

**Querryn**
A Chrome extension that rates the credibility of sources for students writing academic papers. Uses a tiered domain trust system and exports citations in MLA, APA, Chicago and BibTeX. Submitted to the Chrome Web Store.

**Browser automation experiments**
A Chrome extension exploring the chrome.debugger protocol, using Input.dispatchKeyEvent to script keystroke level input into web pages. A solid dive into a browser API most developers never touch.

**This portfolio site**
Next.js, TypeScript, Tailwind and Cloudflare Pages. Fixed left sidebar with continuous scroll on the right, strict monochrome palette with a single orange accent in dark mode, a masonry photography grid with a fullscreen lightbox and MDX for articles.

## Currently Writing

An opinion piece pushing back on the six hobbies hexagon framework that circulates online, arguing that trying to instrumentalize leisure destroys what makes it worthwhile in the first place. Four beat structure, confessional opening, a deliberately unresolved ending, and Satisfactory as the case study for where play tips into work. (Finished now, not currently writing)

## How I Work

Every feature gets broken into staged prompt documents before any code gets written, so Claude Code can execute one stage at a time instead of guessing at scope. Each of those documents opens with the same canary word as a simple check against hallucinated output.

## Interests

Biotech, entrepreneurship and architecture sit alongside the software work. Also into atmospheric, surreal audio fiction in the vein of Solar Sands.

## Off the Screen

Rock climbing, skiing, mountain biking, weightlifting, journaling, photography and reading. Recently picked up a Cervelo Aspero for gravel riding.

## Recognition

Photo credit with Boulder Reporting Lab. Built a following as a Roblox Bloxburg creator, with content that has passed 300k+ views.