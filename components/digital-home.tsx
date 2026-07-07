import Reveal from "@/components/reveal";

// "Step into my digital home" + the horizontally-scrolling project carousel.
// CUSTOMIZE: swap these placeholder previews for real project shots.
const SHOTS: { variant: string; body: string }[] = [
  { variant: "s-acie", body: "Project preview one" },
  { variant: "s-dark", body: "✳" },
  { variant: "s-warm", body: "Project preview two" },
  { variant: "s-lav", body: "Placeholder headline" },
  { variant: "s-mint", body: "Project preview three" },
  { variant: "s-dark", body: "Preview four" },
];

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
            <div className="body">{shot.body}</div>
          </div>
        ))}
      </Reveal>
    </>
  );
}
