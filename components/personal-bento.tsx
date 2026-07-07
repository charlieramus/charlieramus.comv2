import type { CSSProperties } from "react";
import Flower from "@/components/flower";
import Reveal from "@/components/reveal";

// --- Career-journey timeline data (CUSTOMIZE: real roles land in V2) ---------
const YEARS = [2027, 2026, 2025, 2024, 2023, 2022, 2021, 2020];

type Role = {
  letter: string;
  badge: CSSProperties;
  title: string;
  org: string;
  date?: string;
  className?: string;
  style: CSSProperties;
};

const ROLES: Role[] = [
  {
    letter: "A",
    badge: { background: "#CC785C", color: "#fff" },
    title: "Design Engineer",
    org: "Anthropic",
    style: { top: "51px", left: "92px" },
  },
  {
    letter: "L",
    badge: { background: "#FF2D20", color: "#fff" },
    title: "Product Designer",
    org: "Laravel",
    style: { top: "93px", right: "-20px" },
  },
  {
    letter: "W",
    badge: { background: "#4353FF", color: "#fff" },
    title: "Senior Staff Designer",
    org: "Webflow",
    date: "DEC 21 — DEC 24",
    className: "big",
    style: { top: "134px", left: "92px", right: "12px", height: "90px" },
  },
  {
    letter: "G",
    badge: { background: "#FF90E8", color: "#111" },
    title: "Product Designer",
    org: "Gumroad",
    date: "AUG — DEC 21",
    style: { top: "260px", left: "92px", right: "12px" },
  },
];

// --- Halftone thumbnail grids ------------------------------------------------
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

const WRITING = [
  {
    thumb: "linear-gradient(135deg,#2b3d55,#84def9)",
    year: "2026",
    title: "On the quiet craft of interfaces",
  },
  {
    thumb: "linear-gradient(135deg,#3a2a5a,#c7b3f0)",
    year: "2025",
    title: "Notes on shipping slowly",
  },
];

const BLOG = [
  { title: "Redesigning the portfolio, again", date: "Jun 26" },
  { title: "A week of small experiments", date: "May 26" },
  { title: "What good defaults feel like", date: "Apr 26" },
];

export default function PersonalBento() {
  return (
    <section id="personal">
      <div className="wrap">
        <Reveal className="head">
          <h2>A little more personal</h2>
          <p>
            Placeholder subline — the blog, my career path, a few essays, and
            photos. Everything beyond the client work.
          </p>
        </Reveal>

        <div className="pbento">
          {/* Career Journey (dark timeline) */}
          <Reveal as="article" className="cj p-career">
            <div className="cj-title">Career Journey</div>
            <div className="cj-timeline">
              {YEARS.map((year, i) => {
                const top = `${i * 44}px`;
                return (
                  <div key={year}>
                    <div className="cj-line" style={{ top }} />
                    <div className="cj-year" style={{ top }}>
                      {year}
                    </div>
                  </div>
                );
              })}

              <div className="cj-band">
                <span>Freelance &amp; Side Projects</span>
              </div>

              {ROLES.map((role) => (
                <div
                  key={role.org}
                  className={`role${role.className ? ` ${role.className}` : ""}`}
                  style={role.style}
                >
                  <span className="lg" style={role.badge}>
                    {role.letter}
                  </span>
                  <span className="rt">
                    {role.title} <span>· {role.org}</span>
                  </span>
                  {role.date && <span className="dt">{role.date}</span>}
                </div>
              ))}
            </div>
          </Reveal>

          {/* Photography */}
          <Reveal as="a" href="#" className="pcard p-photo">
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

          {/* Graphic design */}
          <Reveal as="a" href="#" className="pcard p-graphic">
            <span className="kick">
              <span className="fdot" style={{ background: "var(--color-red)" }} />{" "}
              Graphic design
            </span>
            <h3>Posters &amp; type</h3>
            <div className="pgrid">
              {GRAPHIC_TILES.map((bg, i) => (
                <i key={i} style={{ background: bg }} />
              ))}
            </div>
            <span className="go">See the portfolio ↗</span>
          </Reveal>

          {/* Latest writing */}
          <Reveal as="a" href="#" className="pcard p-writing">
            <span className="kick">
              <span
                className="fdot"
                style={{ background: "var(--color-yellow)" }}
              />{" "}
              Latest writing
            </span>
            <ul className="wlist">
              {WRITING.map((w) => (
                <li key={w.title}>
                  <span className="thumb" style={{ background: w.thumb }} />
                  <div>
                    <div className="yr">{w.year}</div>
                    <div className="wt">{w.title}</div>
                  </div>
                </li>
              ))}
            </ul>
            <span className="go">Read all essays ↗</span>
          </Reveal>

          {/* From the blog */}
          <Reveal as="a" href="#" className="pcard p-blog">
            <span className="kick">
              <span className="fdot" style={{ background: "var(--color-blue)" }} />{" "}
              From the blog
            </span>
            <ul className="blist">
              {BLOG.map((b) => (
                <li key={b.title}>
                  {b.title} <span>{b.date}</span>
                </li>
              ))}
            </ul>
            <span className="go">Read the blog ↗</span>
          </Reveal>

          {/* Accent flower tiles */}
          <div className="p-tiles">
            <Reveal className="ptile" style={{ background: "var(--color-pink)" }}>
              <Flower petal="blue" core="#0015D4" petals={6} index={3} />
            </Reveal>
            <Reveal className="ptile white">
              <Flower petal="red" core="#F32317" petals={6} index={4} />
            </Reveal>
          </div>

          {/* Playground */}
          <Reveal as="a" href="#" className="pcard p-play">
            <span className="kick">
              <span
                className="fdot"
                style={{ background: "var(--color-yellow)" }}
              />{" "}
              Playground
            </span>
            <h3>Side experiments</h3>
            <p className="sub">
              Placeholder — half-finished ideas, generative sketches, and things
              made just for fun.
            </p>
            <span className="go">Poke around ↗</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
