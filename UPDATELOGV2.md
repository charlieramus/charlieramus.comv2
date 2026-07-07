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

**`data/experience.ts`** — kept all 3 roles, enriched from the brain-dump:
- [x] **Ostiara** description rewritten with the real substance (SaaS for door-to-door
  home-service sales — pest control/solar/roofing/fencing/security; marketing site +
  admin dashboard + teams/roles on Clerk Organizations + Supabase RLS + custom design
  system; customer-discovery interviews). Tags swapped from generic
  (`JavaScript`/`Auth`/…) to the real stack (`Next.js`, `TypeScript`, `Clerk`,
  `Supabase`, `Design Systems`, `Customer Discovery`).
- [x] **Content Creator & Builder** description reconciled with Stage 1: the "300k"
  work is architecture content **on Roblox (Bloxburg)** — named the platform so the
  bio and timeline agree (was two separate "300k" facts).
- [x] Liberty Puzzles left as-is (already accurate). Verified **newest-first**
  (2026 · 2026 · 2025), string `dates`, numeric `start`/`end` (Ostiara 2026/null,
  Liberty 2026/null, Content 2025/null) intact.

**`data/projects-web.ts`** — went from 1 Ostiara stub → **6 real projects**:
- [x] Added a `spotlight?: boolean` field to the `WebProject` type (supports the
  "highlights" surface Charlie wants — see decision below) and screenshots stay `image`
  (empty; V4).
- [x] Entries, each with `title` / `date` / what-it-is + **the hard part** / `href` /
  `tags`: **Ostiara** (expanded, `spotlight`), **MyLifeInARepo** (`spotlight`),
  **Querryn**, **VaultDNA**, **charlieramus.com** (this site), **Browser-automation
  experiments**.
- [x] **Order** reflects Charlie's call: flagship **Ostiara** → spotlight
  **MyLifeInARepo** → long tail (Querryn → VaultDNA → portfolio → browser-automation,
  most-shipped-first, experiment last).
- [x] `href`s: real where public (Ostiara repo, `charlieramus.com`), `""` for the
  unpublished/unlinked ones (MyLifeInARepo, VaultDNA, Querryn, browser-automation).

**Data flow (for V3):** `webProjects.filter(p => p.spotlight)` → the featured
"highlights" tier; the rest → "Tiny fraction of my work" bands. `experience.entries`
(newest-first, `start`/`end`) → the timeline/bento.

**DECISION captured → Charlie's "highlights right now" idea:** he wants to rebrand the
featured section into a rotating "what's fresh" surface — recent-trip photos + active
project (Ostiara) + open-source journal (MyLifeInARepo) + latest article. That's a
**V3 homepage-composition** decision (out of this content-only stage). Groundwork laid:
`spotlight` flag on `projects-web`; V3 will also pull from `data/photos.ts` (V4) and the
writing manifest (Stage 4). Noted here so V3 designs that section deliberately.

Issues: **Dates are approximate** for the side projects — VaultDNA/MyLifeInARepo dated
2026 ("alongside Ostiara" per the dump); Querryn/browser-automation guessed **2025**;
portfolio "2025 — Present". Charlie should confirm/correct. Also **Querryn** was
"submitted to the Chrome Web Store" with no confirmed public URL, so `href: ""` — add
the store link once live. The `charlieramus.com` entry's description is design-neutral
on purpose: the dump described the *current* site (Cloudflare Pages, monochrome+orange),
but this v2 rebuild is Vercel + the paper palette, so I didn't bake in either look.

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

Mostly a **verification pass** — the seeded data reads true against `ABOUT-CHARLIE.md`,
so the only code change was finalizing the `Photo` type.

- [x] **`projects-design.ts`** — verified all 3 entries (Notion Brand Pitch 2025 ·
  Spotify IMC 2025 · Photography Presentation UI 2024) read true and match the §4
  Design seed. `images` left empty (V4). No newer design work in the brain-dump →
  surfaced as a question below; no change made.
- [x] **`gear.ts`** — confirmed the core kit against §6: **Canon EOS R5** ✓,
  **DJI Air 2s** ✓, **RF 24-105 f/4** ✓, **Sigma 150-600** ✓. **Cervelo Aspero
  correctly absent** — it's a bike, and it already lives in the bio/interests
  (`about.ts`, Stage 1), not here. Bags/accessories (Kiboko, Thule, tripod, Deity
  mic) are seeded from the current site and **beyond §6's scope** → flagged for
  Charlie to confirm; kept as-is.
- [x] **`socials.ts`** — sanity-checked all 5 links + handles (LinkedIn · GitHub
  `charlieramus` · IG `@chahramii` photography · IG `@charlieramus_` personal ·
  Letterboxd `cwramus`) against §8; all well-formed and consistent. `contactEmail`
  = `charlie.ramus12@gmail.com` matches Charlie's address → confirmed as the
  "Get in touch" contact. No change.
- [x] **`photos.ts`** — kept the empty stub (gallery is authored in V4 via the
  downscale/thumb/blur sync). **Finalized the `Photo` type**: clarified `caption`/
  `code` docs and added three optional, V4-populated fields — `featured?` (mirrors
  the `spotlight` flag on projects so V3's "highlights" surface can pull a photo),
  `location?`, and `date?` (so V3 can pick a *recent-trip* photo per Charlie's
  highlights idea). All optional → no churn, V4 fills them incrementally.

**Data flow (for V3):** `designProjects` → the design band; `gear`/`gearSections` →
the gear list (V4 route); `socials` + `contactEmail` → footer/contact card;
`photos.filter(p => p.featured)` → the "highlights" photo slot (empty until V4).

**DECISIONS → Charlie (resolved):**
1. **Newer design work?** — Charlie will add any post-2025 design entries himself.
   The existing 3 stand as-is; no action needed here.
2. **Gear bags/accessories** (Kiboko V1 30L+, Thule Aspect V2, carbon-fiber tripod,
   Deity V-Mic D4 Mini) — **confirmed 100% accurate** by Charlie. The old site is the
   most-current source generally; kept unchanged.

Issues: None. `photos` stays intentionally empty (V4). Verified: `tsc` / `eslint` /
`build` all clean.

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

- [x] **Verified all 4 essays are Charlie's real pieces** (not placeholder text):
  - `architecture-of-self-justification.mdx` — "The Architecture of Self-Justification:
    How Pride Disguises Moral Failure" (Dec 2025) — §7 pride/self-justification.
  - `when-bigger-means-more-biased.mdx` — "When Bigger Means More Biased…" (May 15th,
    2026) — §7 LLM bias & scale; full footnote apparatus + acknowledgments intact.
  - `the-third-rotation.mdx` — "The Third Rotation" (May 3rd 2026) — §7.
  - `the-hobby-hexagon-is-a-trap.mdx` — "The Hobby Hexagon Is a Trap (And I Built One
    Anyway)" (July 2026) — the §"Currently Writing" hexagon essay. **Already fully
    drafted** (confessional open · *Satisfactory* case study · unresolved ending).
- [x] **Renamed files → clean, stable slugs** (was `article-one…four`). Used
  `git mv`, so the filename now equals the `/writing/[slug]` route slug.
- [x] **`headerImage`: blanked all four to `""`.** They pointed at
  `/images/artical-N-header_webp.webp` — the `artical` **typo**, no `/images` assets
  exist yet, and `article-four` wrongly reused article-one's path. `"" ` = "no header
  image" per the frontmatter contract, so the build references no missing asset.
  **Header images are a V4 task** (author real paths via the asset pipeline then).
- [x] **Locked the frontmatter contract** (fields V4's route + V3's list read):
  `title` · `date` · `author` · `headerImage` · `externalLink` · `externalLinkLabel`.
  All 4 files already carry the full set with `// CUSTOMIZE` markers preserved;
  `externalLink`/`externalLinkLabel` are `""` (no external repost) across the board.
- [x] **Added `data/writing.ts` manifest** (`WritingEntry`: `slug` · `title` · `date`
  · `order`) so V3's "Latest writing" list orders without parsing MDX. Newest-first
  `order` 1–4: hexagon → bigger-means-biased → third-rotation → self-justification.
  `slug` matches each file exactly; `title`/`date` mirror the frontmatter (noted in
  the file that they must stay in sync).

**Data flow (for V3/V4):** V3 reads `data/writing.ts` (sorted by `order`) → "Latest
writing" list + links to `/writing/[slug]`. V4's `/writing/[slug]` route reads the
matching MDX's frontmatter + body.

**DECISION → Charlie (resolved):** the hexagon essay is already drafted and reads
finished, so — per Charlie — it's **published**: included as the newest entry (`order:
1`), not held as a draft.

Issues: None blocking. **Header images deferred to V4** (all `headerImage: ""` for now).
One consistency note for V3/V4: `date` strings are human display formats ("December
2025", "May 15th, 2026", "May 3rd 2026", "July 2026") — fine for display + the `order`
field drives sorting, so no date parsing is needed. Verified: `tsc` / `eslint` /
`build` all clean.

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
