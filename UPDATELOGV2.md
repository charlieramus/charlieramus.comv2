# UPDATELOG V2 — CONTENT MODEL

**First read `DESIGN-BRIEF.md`** (the Data map) + `ABOUT-CHARLIE.md` (voice +
facts) + `ROADMAP.md`. Goal of V2: turn the **seeded stubs** in `data/*.ts` and
`content/writing/*.mdx` into Charlie's **real, typed content**, derived from
`ABOUT-CHARLIE.md` and the current charlieramus.com — in one coherent voice.

**Scope guard — this is content only.** Do **not** wire data into the homepage
(that's **V3**), do not build the photo gallery pipeline or MDX routing (that's
**V4**), and leave `app/page.tsx` on its placeholder. Keep every `// CUSTOMIZE`
marker so Charlie can still edit copy without touching types. Where a real
decision is Charlie's (voice, spotlight picks), **surface it in the stage report
as a question — do not invent a persona or fabricate facts.**

Verify with `npx tsc --noEmit` + `npx eslint .` (these type-check the data even
though no page imports it yet) + `npm run build`. The data is authored to be
**import-ready for V3**, not yet imported.

---

## Stage 1 — Voice & bio (`data/about.ts`)

- `ABOUT-CHARLIE.md` holds **two framings**: the current site's (HS junior in
  Boulder · self-taught dev · architecture content → 300k impressions ·
  e-commerce · "tools for academics") and the newer "About Charlie" brain-dump
  (solo full-product builder · Ostiara SaaS · Next.js/TS/Tailwind + Claude Code ·
  VaultDNA / MyLifeInARepo / Querryn · Boulder, climbing/skiing/biking, Cervelo
  Aspero · Solar Sands · Boulder Reporting Lab photo credit · Bloxburg 300k).
  **Reconcile them into one bio** — don't just concatenate.
- Rewrite `aboutParagraphs` (source for the "Behind the pixels" section) and
  `tagline` (hero one-liner + `<meta>` description) in that reconciled voice.
  Consider adding a small typed `snapshot` (name / location / roles) if V3's
  hero+about will want structured fields rather than prose.
- **DECISION → Charlie:** (a) voice/tone — playful like the mockup ("Think we
  vibe?") vs drier/sharper (`ABOUT-CHARLIE.md` §3 is blank); (b) the single hero
  one-liner (§1's attempts are blank). Draft 2–3 options each and ask; keep the
  seeded copy until he picks.

# Stage 1 Report

- [x] Reconciled the two framings in `ABOUT-CHARLIE.md` into **one bio** (not a
  concatenation): led with the newer "solo full-product builder" identity, folded
  the current-site arc (e-commerce → architecture content → now) in behind it, and
  merged the two "300k" facts — the seeded "architecture content / 300k
  impressions" and the dump's "Roblox Bloxburg creator / 300k+ views" are the same
  thing, so they're now a single sentence ("architecture content on Roblox … passed
  300,000+ views").
- [x] Rewrote `data/about.ts` `aboutParagraphs` (4 paras, source for "Behind the
  pixels") and `tagline` in the voice Charlie picked: **dry + precise**, specifics
  carrying it (Ostiara: Clerk Organizations + Supabase RLS, the menu-price vs
  measure-on-site discovery split; Canon R5 + Boulder Reporting Lab credit; Cervelo
  Aspero; Solar Sands). No fabricated facts — every claim traces to `ABOUT-CHARLIE.md`.
- [x] Added a typed `snapshot` (`Snapshot` interface: `name` / `location` /
  `roles[]`) so V3's hero+about can read structured fields instead of parsing prose.
- [x] **Hero decision:** Charlie chose his **name** as the hero headline, not a
  one-liner. So V3's hero renders `snapshot.name` ("Charlie Ramus"); `tagline` was
  repurposed to serve **only** as the `<meta>`/SEO description (commented as such),
  keeping the seeded copy's dual role from silently forcing a tagline into the hero.
- [x] Kept every `// CUSTOMIZE` marker; scope respected — no homepage wiring, no
  imports added, `app/page.tsx` untouched.
- [x] Verified: `npx tsc --noEmit` clean · `npx eslint .` clean · `npm run build`
  exit 0 (data type-checks even though no page imports it yet).

**Data flow (for V3):** `snapshot.name` → hero headline; `snapshot.location`/`roles`
→ hero/about chips; `aboutParagraphs` → "Behind the pixels" collage; `tagline` →
root layout `metadata.description`.

Issues: None blocking. Open for later stages — (1) `roles` is a 4-item default
(Developer/Designer/Photographer/Writer); V3 should confirm it wants chips vs prose.
(2) Both hero+about now key off `name`+`snapshot`, so V3 must not re-introduce
`tagline` as a visible hero line.

---

## Stage 2 — Experience & web projects (`data/experience.ts`, `data/projects-web.ts`)

- `experience.ts`: keep the 3 roles (Stealth/Ostiara, Liberty Puzzles, Content
  Creator & Builder) but **enrich the descriptions** from the brain-dump (e.g.
  Ostiara = SaaS for door-to-door home-service sales across pest control / solar
  / roofing / fencing / security; Clerk Organizations + Supabase RLS; customer
  discovery interviews). Verify newest-first order, the 2025–26 `dates`, and the
  numeric `start`/`end` used for timeline placement.
- `projects-web.ts`: today it's **only an Ostiara stub**. Add the real projects
  from `ABOUT-CHARLIE.md` §4 + "Side Projects": **Ostiara** (expand),
  **VaultDNA**, **MyLifeInARepo**, **Querryn**, the **browser-automation
  experiments**, and **this portfolio site**. Each: `title`, `date`,
  `description` (what it is + the hard part), `href` (repo/live or `""`), `tags`.
  Leave `image` empty (screenshots are V4).
- **DECISION → Charlie:** which projects get the spotlight vs the long tail
  (§4 asks). Order the array accordingly and note the call.

# Stage 2 Report
_TBD._

---

## Stage 3 — Design, gear, socials, photos (`data/projects-design.ts`, `data/gear.ts`, `data/socials.ts`, `data/photos.ts`)

- `projects-design.ts`: verify the 3 entries (Notion Brand Pitch 2025 · Spotify
  IMC 2025 · Photography Presentation UI 2024) read true; add anything newer
  (§Design brain-dump asks). Leave `images` for V4.
- `gear.ts`: confirm the kit against §6 (Canon EOS R5, DJI Air 2s, RF 24-105 f/4,
  Sigma 150-600). Note: the **Cervelo Aspero is a bike, not camera gear** — it
  belongs in bio/interests, not `gear.ts`.
- `socials.ts`: already complete — sanity-check the 5 links + handles and the
  `contactEmail`; confirm the preferred "Get in touch" contact.
- `photos.ts`: **keep the empty stub** (gallery is authored in V4 via the
  downscale/thumb/blur sync step) but finalize the `Photo` type so V3 can
  reference it without churn.

# Stage 3 Report
_TBD._

---

## Stage 4 — Writing (`content/writing/*.mdx`)

- Verify the **4 essays** are Charlie's real pieces (§7: LLM bias & scale · "The
  Third Rotation" · self-justification & pride · +1) — not placeholder text.
  Check each file's frontmatter: `title`, `date`, `author`, `headerImage`
  (fix the `artical-1-header` typo / confirm the asset exists or blank it),
  `externalLink`/`externalLinkLabel`. The **filename is the `/writing/[slug]`
  slug** — make slugs clean and stable.
- Lock the frontmatter **contract** (the fields V4's route + V3's "Latest
  writing" list will read). If the homepage's writing list needs ordering,
  add a small typed `data/writing.ts` manifest (`slug`, `title`, `date`,
  `order`) rather than parsing MDX at render time here.
- **DECISION → Charlie:** add the "currently writing" six-hobbies-hexagon essay
  now, or defer until it's drafted?

# Stage 4 Report
_TBD._

---

## Stage 5 — Verify + consistency

- `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean.
- Consistency sweep across `data/`: newest-first ordering holds; `date`/`dates`
  are strings; every `href` is a real URL or `""`; no entry points at a missing
  `/public` asset (or it's explicitly a V4 TODO); tag casing is consistent;
  theme tokens (`var(--color-*)`) used for any colors.
- Confirm the model is **import-ready for V3** — types exported, no page imports
  added yet, `app/page.tsx` still the placeholder. Note anything V3 will need to
  decide (e.g. how the bento maps to `experience`/`projects`).

# Stage 5 Report
_TBD._
