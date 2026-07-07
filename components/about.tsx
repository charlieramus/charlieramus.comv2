import Reveal from "@/components/reveal";

// Collage photo positions (classes p1–p4 carry the rotation/placement).
const COLLAGE = [
  { cls: "p1", bg: "linear-gradient(135deg,#f6c26b,#c9743a)" },
  { cls: "p2", bg: "linear-gradient(135deg,#7fb2e5,#2a5b9c)" },
  { cls: "p3", bg: "linear-gradient(135deg,#f2a35e,#d94f3d)" },
  { cls: "p4", bg: "linear-gradient(135deg,#9fd7a0,#4f9c6b)" },
];

export default function About() {
  return (
    <section>
      <div className="wrap">
        <Reveal className="head">
          <h2>Behind the pixels</h2>
          <p>
            Finally, a quick peek behind the work — swap this for a short,
            friendly intro.
          </p>
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
          {/* CUSTOMIZE: about copy (placeholder from mockup) */}
          <div className="bio">
            <p>
              This is placeholder copy for the about section. A couple of short
              sentences go here — where you&apos;re based, what you care about,
              how you like to work.
            </p>
            <p>
              Keep it warm and human, but this is just filler text for the
              layout. Replace it whenever you&apos;re ready.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
