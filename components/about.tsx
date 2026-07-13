import Reveal from "@/components/reveal";
import AboutBio from "@/components/about-bio";
import { sections } from "@/site.config";

// Collage photo positions (classes p1–p4 carry the rotation/placement).
const COLLAGE = [
  { cls: "p1", bg: "linear-gradient(135deg,#f6c26b,#c9743a)" },
  { cls: "p2", bg: "linear-gradient(135deg,#7fb2e5,#2a5b9c)" },
  { cls: "p3", bg: "linear-gradient(135deg,#f2a35e,#d94f3d)" },
  { cls: "p4", bg: "linear-gradient(135deg,#9fd7a0,#4f9c6b)" },
];

export default function About() {
  return (
    <section id="about">
      <div className="wrap">
        <Reveal className="head">
          <h2>Behind the pixels</h2>
          {/* CUSTOMIZE: about subline in site.config.ts (sections.about.subline) */}
          <p>{sections.about.subline}</p>
        </Reveal>

        <Reveal className="about-grid">
          <div className="collage">
            {COLLAGE.map((ph) => (
              <div
                key={ph.cls}
                className={`ph ${ph.cls}`}
                style={{ background: ph.bg }}
              />
            ))}
          </div>
          {/* About copy lives in data/about.ts (aboutParagraphs). AboutBio shows
              paragraph 0 as a teaser and folds the rest behind a "read more"
              toggle (V8 Stage 3). CUSTOMIZE the copy in data/about.ts. */}
          <AboutBio />
        </Reveal>
      </div>
    </section>
  );
}
