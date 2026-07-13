import Image from "next/image";
import Motif from "@/components/motif";
import Reveal from "@/components/reveal";
import PetalSimon from "@/components/petal-simon";
import { entries } from "@/data/experience";
import { writing } from "@/data/writing";
import { bentoPhotoTiles, bentoDesignTiles } from "@/data/previews";
import { sections } from "@/site.config";

// --- Writing (folds the mockup's separate "blog" into one body of essays) -----
// Newest-first by `order`. Latest two headline the writing card; the next two
// fill the "more essays" list below (V2 addendum: there is no separate blog).
const essays = [...writing].sort((a, b) => a.order - b.order);
const latestEssays = essays.slice(0, 2);
const moreEssays = essays.slice(2, 4);
const yearOf = (date: string) => date.match(/\d{4}/)?.[0] ?? "";

// Essay-card thumbnails stay decorative gradients (the newest essay is headerless
// by design, so a real-thumbnail row would be uneven). Counts mirror the data.
const ESSAY_THUMBS = [
  "linear-gradient(135deg,#2b3d55,#84def9)",
  "linear-gradient(135deg,#3a2a5a,#c7b3f0)",
];

// Photography + graphic-design bento tiles are chosen in data/previews.ts (the
// curation layer), not here — edit that one file to change what's previewed.
// Both are decorative inside their described "→ View the gallery / See the work"
// links, so alt is empty.
const BENTO_PHOTOS = bentoPhotoTiles();
const GRAPHIC_THUMBS = bentoDesignTiles();

export default function PersonalBento() {
  return (
    <section id="personal" className="mtc">
      <div className="wrap">
        <Reveal className="head">
          {/* CUSTOMIZE: section title + subline in site.config.ts (sections.personalBento) */}
          <h2>{sections.personalBento.title}</h2>
          <p>{sections.personalBento.subline}</p>
        </Reveal>

        {/* Career journey — a readable, flowing vertical timeline (V6 rework:
            replaces the old fixed-pixel, absolutely-positioned axis). ← experience */}
        <Reveal as="article" className="cj">
          <div className="cj-head">
            <span className="cj-title">Career journey</span>
            {/* CUSTOMIZE: timeline caption in site.config.ts (sections.personalBento.careerNote) */}
            <span className="cj-note">{sections.personalBento.careerNote}</span>
          </div>
          <ol className="tl">
            {entries.map((role) => (
              <li className="tl-row" key={role.title}>
                <div className="tl-rail">
                  <span
                    className="tl-chip"
                    style={{ background: role.logoBg, color: role.logoFg }}
                  >
                    {role.logo ?? role.title[0]}
                  </span>
                </div>
                <div className="tl-content">
                  <span className="tl-when">{role.dates}</span>
                  <h3 className="tl-role">
                    {role.title}
                    {role.org && <span className="tl-org"> · {role.org}</span>}
                  </h3>
                  <p className="tl-desc">{role.description}</p>
                  <div className="tl-tags">
                    {role.tags.slice(0, 4).map((t) => (
                      <span className="tl-tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* Motif accents between blocks (decorative) */}
        <div className="mtc-accents" aria-hidden="true">
          <Motif fill="pink" accent="#0015D4" index={20} />
          <Motif fill="yellow" accent="#F32317" index={21} />
          <Motif fill="cyan" accent="#0015D4" index={22} />
        </div>

        {/* Explore bento — fewer, bigger cards; two per row so they breathe. */}
        <div className="mtc-cards">
          {/* Photography ← photos */}
          <Reveal as="a" href="/photography" className="pcard p-photo">
            <span className="kick">
              <span className="fdot" style={{ background: "var(--color-cyan)" }} />{" "}
              Photography
            </span>
            <h3>Through the viewfinder</h3>
            <div className="pgrid">
              {BENTO_PHOTOS.map((t) => (
                <span key={t.key} className="ptile-img">
                  <Image
                    src={t.src}
                    alt=""
                    fill
                    sizes="(max-width: 880px) 44vw, 220px"
                    className="pgrid-img"
                    {...(t.blurDataURL
                      ? { placeholder: "blur" as const, blurDataURL: t.blurDataURL }
                      : {})}
                  />
                </span>
              ))}
            </div>
            <span className="go">View the gallery ↗</span>
          </Reveal>

          {/* Graphic design ← designProjects */}
          <Reveal as="a" href="/design" className="pcard p-graphic">
            <span className="kick">
              <span className="fdot" style={{ background: "var(--color-red)" }} />{" "}
              Graphic design
            </span>
            {/* CUSTOMIZE: graphic-design card title in site.config.ts (sections.personalBento.graphicTitle) */}
            <h3>{sections.personalBento.graphicTitle}</h3>
            <div className="pgrid">
              {GRAPHIC_THUMBS.map((t) => (
                <span key={t.key} className="ptile-img">
                  <Image
                    src={t.src}
                    alt=""
                    fill
                    sizes="(max-width: 880px) 30vw, 150px"
                    className="pgrid-img"
                  />
                </span>
              ))}
            </div>
            <span className="go">See the work ↗</span>
          </Reveal>

          {/* Writing ← writing (latest two headline; next two as "more essays") */}
          <Reveal as="a" href="/writing" className="pcard p-writing">
            <span className="kick">
              <span
                className="fdot"
                style={{ background: "var(--color-yellow)" }}
              />{" "}
              Writing
            </span>
            <ul className="wlist">
              {latestEssays.map((w, i) => (
                <li key={w.slug}>
                  <span
                    className="thumb"
                    style={{ background: ESSAY_THUMBS[i % ESSAY_THUMBS.length] }}
                  />
                  <div>
                    <div className="yr">{yearOf(w.date)}</div>
                    <div className="wt">{w.title}</div>
                  </div>
                </li>
              ))}
            </ul>
            <ul className="blist">
              {moreEssays.map((w) => (
                <li key={w.slug}>
                  <span className="bt">{w.title}</span> <span>{w.date}</span>
                </li>
              ))}
            </ul>
            <span className="go">Read all essays ↗</span>
          </Reveal>

          {/* Playground → Petal Simon memory game (replaces the old "Side
              experiments" link card; V8 Stage 2). Leaf client component. */}
          <PetalSimon />
        </div>
      </div>
    </section>
  );
}
