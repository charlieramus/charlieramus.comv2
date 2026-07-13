import { marquees, type Marquee } from "@/site.config";

/**
 * A vertical color rail for the /photography gutter — each segment is bold Inter
 * (`--font-sans`) in one of the site's turquoise / red / yellow, looping upward.
 *
 * Seamless loop: the segment list is duplicated and the track translates a clean
 * `-50%` (each segment carries an equal trailing margin, so one copy is exactly
 * half the track — no visible seam). Purely decorative: `aria-hidden`, and via
 * CSS `pointer-events: none` + frozen under prefers-reduced-motion. No client JS.
 */

const COLOR: Record<Marquee["color"], string> = {
  cyan: "var(--color-cyan)",
  red: "var(--color-red)",
  yellow: "var(--color-yellow)",
};

export default function VerticalMarquee() {
  if (marquees.length === 0) return null;
  const loop = [...marquees, ...marquees];
  return (
    <div className="photo-marquee" aria-hidden="true">
      <div className="photo-marquee-track">
        {loop.map((m, i) => (
          <span key={i} className="pm-seg" style={{ color: COLOR[m.color] }}>
            {m.text}
          </span>
        ))}
      </div>
    </div>
  );
}
