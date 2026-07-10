import Reveal from "@/components/reveal";
import { carouselShots } from "@/data/previews";

// "Step into my digital home" — a horizontally-scrolling tour of the projects.
// Which projects tour, in what order, and each browser-window skin are chosen in
// data/previews.ts (`digitalHomeCarousel`). Each .shot is a browser-window
// placeholder (real screenshots = V4); the caption is the real project title.
const SHOTS = carouselShots();

export default function DigitalHome() {
  return (
    <>
      <Reveal className="step">
        <span className="bm">🔖</span>
        <span className="t">Step into my digital home</span>
      </Reveal>

      <Reveal
        className="carousel"
        role="group"
        aria-label="Project previews — scroll horizontally"
        tabIndex={0}
      >
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
