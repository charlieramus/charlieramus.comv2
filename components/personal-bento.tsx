import type { CSSProperties } from "react";
import Flower from "@/components/flower";
import Reveal from "@/components/reveal";
import { entries } from "@/data/experience";
import { writing } from "@/data/writing";
import { designProjects } from "@/data/projects-design";

// --- Career-journey timeline -------------------------------------------------
// Driven by experience.entries (newest-first). The mockup's 8-year 2020→2027 axis
// was a fake résumé; Charlie's real range is 2025–2026 and every role is ongoing
// ("Present"), so two roles share 2026. A strict year→pixel map would collide, so
// cards are placed ordinally (newest at top, featured = .big) while the year ticks
// (2026 top → 2025 bottom) act as the real, honest axis behind them — same visual
// intent as the mockup, which also placed its cards for rhythm, not on exact ticks.
const startYears = entries
  .map((e) => e.start)
  .filter((y): y is number => typeof y === "number");
const maxYear = Math.max(...startYears);
const minYear = Math.min(...startYears);
const AXIS_BOTTOM = 264; // px; top tick sits at 0
const axisYears: number[] = [];
for (let y = maxYear; y >= minYear; y--) axisYears.push(y);
const yearTop = (y: number) =>
  maxYear === minYear ? 0 : ((maxYear - y) / (maxYear - minYear)) * AXIS_BOTTOM;

// Ordinal vertical placement: featured (index 0) is the tall .big card up top.
const BIG_H = 92;
const roleTop = (i: number) => (i === 0 ? 8 : 8 + BIG_H + 16 + (i - 1) * 90);

// --- Writing (folds the mockup's separate "blog" into one body of essays) -----
// Newest-first by `order`. Latest two headline the .p-writing card; the rest fill
// the old .p-blog slot as "more essays" (V2 addendum: there is no separate blog).
const essays = [...writing].sort((a, b) => a.order - b.order);
const latestEssays = essays.slice(0, 2);
const moreEssays = essays.slice(2, 4);
const yearOf = (date: string) => date.match(/\d{4}/)?.[0] ?? "";

// Decorative placeholder thumbnails (real essay header images + photo/design
// galleries arrive in V4). Counts mirror the data so the grids stay honest.
const ESSAY_THUMBS = [
  "linear-gradient(135deg,#2b3d55,#84def9)",
  "linear-gradient(135deg,#3a2a5a,#c7b3f0)",
];
const PHOTO_TILES = [
  "linear-gradient(150deg,#2f5c86,#c98a3a)",
  "linear-gradient(150deg,#c9a24a,#7a5a1e)",
  "linear-gradient(150deg,#2b5c7a,#173445)",
  "linear-gradient(150deg,#5a6b52,#2c3a28)",
];
const GRAPHIC_TILES = [
  "linear-gradient(150deg,#F32317,#FFCB41)",
  "linear-gradient(150deg,#0015D4,#84DEF9)",
  "linear-gradient(150deg,#14140f,#5a5a5a)",
];

export default function PersonalBento() {
  return (
    <section id="personal">
      <div className="wrap">
        <Reveal className="head">
          <h2>A little more personal</h2>
          {/* CUSTOMIZE: bento subline */}
          <p>
            Where I&apos;ve worked, the essays I write, photography, and the
            design work — everything beyond the code.
          </p>
        </Reveal>

        <div className="pbento">
          {/* Career Journey (dark timeline) ← experience.entries */}
          <Reveal as="article" className="cj p-career">
            <div className="cj-title">Career Journey</div>
            <div className="cj-timeline">
              {axisYears.map((year) => {
                const top = `${yearTop(year)}px`;
                return (
                  <div key={year}>
                    <div className="cj-line" style={{ top }} />
                    <div className="cj-year" style={{ top }}>
                      {year}
                    </div>
                  </div>
                );
              })}

              {/* CUSTOMIZE: timeline band label */}
              <div className="cj-band">
                <span>Solo builds &amp; side work</span>
              </div>

              {entries.map((role, i) => {
                const big = i === 0;
                const style: CSSProperties = {
                  top: `${roleTop(i)}px`,
                  left: "92px",
                  right: "12px",
                  ...(big ? { height: `${BIG_H}px` } : {}),
                };
                return (
                  <div
                    key={role.title}
                    className={`role${big ? " big" : ""}`}
                    style={style}
                  >
                    <span
                      className="lg"
                      style={{ background: role.logoBg, color: role.logoFg }}
                    >
                      {role.logo ?? role.title[0]}
                    </span>
                    <span className="rt">
                      {role.title}
                      {role.org && <span> · {role.org}</span>}
                    </span>
                    {role.dates && <span className="dt">{role.dates}</span>}
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* Photography ← photos (empty until V4 → placeholder halftone tiles) */}
          <Reveal as="a" href="/photography" className="pcard p-photo">
            <span className="kick">
              <span className="fdot" style={{ background: "var(--color-cyan)" }} />{" "}
              Photography
            </span>
            <h3>Through the viewfinder</h3>
            <div className="pgrid">
              {PHOTO_TILES.map((bg, i) => (
                <i key={i} style={{ background: bg }} />
              ))}
            </div>
            <span className="go">View the gallery ↗</span>
          </Reveal>

          {/* Graphic design ← designProjects (count-driven; real images = V4) */}
          <Reveal as="a" href="/design" className="pcard p-graphic">
            <span className="kick">
              <span className="fdot" style={{ background: "var(--color-red)" }} />{" "}
              Graphic design
            </span>
            {/* CUSTOMIZE: graphic-design card title */}
            <h3>Brand &amp; layout</h3>
            <div className="pgrid">
              {designProjects.map((p, i) => (
                <i key={p.title} style={{ background: GRAPHIC_TILES[i % GRAPHIC_TILES.length] }} />
              ))}
            </div>
            <span className="go">See the work ↗</span>
          </Reveal>

          {/* Latest writing ← writing (top 2 by order) */}
          <Reveal as="a" href="/writing" className="pcard p-writing">
            <span className="kick">
              <span
                className="fdot"
                style={{ background: "var(--color-yellow)" }}
              />{" "}
              Latest writing
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
            <span className="go">Read all essays ↗</span>
          </Reveal>

          {/* More essays ← the rest of writing (the mockup's "blog" folded in) */}
          <Reveal as="a" href="/writing" className="pcard p-blog">
            <span className="kick">
              <span className="fdot" style={{ background: "var(--color-blue)" }} />{" "}
              More essays
            </span>
            <ul className="blist">
              {moreEssays.map((w) => (
                <li key={w.slug}>
                  <span className="bt">{w.title}</span> <span>{w.date}</span>
                </li>
              ))}
            </ul>
            <span className="go">Browse the archive ↗</span>
          </Reveal>

          {/* Accent flower tiles (decorative) */}
          <div className="p-tiles">
            <Reveal className="ptile" style={{ background: "var(--color-pink)" }}>
              <Flower petal="blue" core="#0015D4" petals={6} index={3} />
            </Reveal>
            <Reveal className="ptile white">
              <Flower petal="red" core="#F32317" petals={6} index={4} />
            </Reveal>
          </div>

          {/* Playground (decorative — Charlie's smaller builds live in /web-projects) */}
          <Reveal as="a" href="/web-projects" className="pcard p-play">
            <span className="kick">
              <span
                className="fdot"
                style={{ background: "var(--color-yellow)" }}
              />{" "}
              Playground
            </span>
            <h3>Side experiments</h3>
            {/* CUSTOMIZE: playground blurb */}
            <p className="sub">
              Half-finished ideas, small tools, and things built just to see if
              they&apos;d work.
            </p>
            <span className="go">Poke around ↗</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
