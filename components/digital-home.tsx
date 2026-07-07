import Reveal from "@/components/reveal";
import { webProjects } from "@/data/projects-web";

// "Step into my digital home" — a horizontally-scrolling tour of the projects.
// Each .shot is a browser-window placeholder (real screenshots = V4); the caption
// is wired to the real project title so the tour reads honestly today.
const VARIANTS = ["s-acie", "s-dark", "s-warm", "s-lav", "s-mint", "s-dark"];
const SHOTS = webProjects.map((p, i) => ({
  variant: VARIANTS[i % VARIANTS.length],
  title: p.title,
}));

export default function DigitalHome() {
  return (
    <>
      <Reveal className="step">
        <span className="bm">🔖</span>
        <span className="t">Step into my digital home</span>
      </Reveal>

      <Reveal className="carousel">
        {SHOTS.map((shot, i) => (
          <div key={i} className={`shot ${shot.variant}`}>
            <div className="bbar">
              <i />
              <i />
              <i />
            </div>
            <div className="body">{shot.title}</div>
          </div>
        ))}
      </Reveal>
    </>
  );
}
