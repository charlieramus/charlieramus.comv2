import Reveal from "@/components/reveal";
import { services, servicesHeading, servicesSub } from "@/data/services";

// Fanned card stack — decorative (colors only; the real list is `services`).
const FAN_COLORS = [
  "#1c1c1c",
  "#f4f3ee",
  "#111",
  "#dff5e1",
  "#111",
  "#e7ecff",
  "#cfe9d6",
  "#0b0b0b",
  "#f7c8e0",
];

export default function Services() {
  return (
    <section id="garden">
      <div className="wrap">
        <Reveal className="head">
          {/* CUSTOMIZE: heading/sub live in data/services.ts */}
          <h2>{servicesHeading}</h2>
          <p>{servicesSub}</p>
        </Reveal>

        <Reveal className="fan">
          {FAN_COLORS.map((color, i) => {
            const angle = (i - (FAN_COLORS.length - 1) / 2) * 7;
            // Centered on the fan's midpoint (was left:i*44 from the edge, which
            // overflowed the viewport on mobile). `.fan { overflow:hidden }` clips
            // the outer cards on narrow screens — decorative, so tucking is fine.
            const offset = (i - (FAN_COLORS.length - 1) / 2) * 44;
            return (
              <div
                key={i}
                className="fc"
                style={{
                  left: "50%",
                  transform: `translateX(calc(-50% + ${offset}px)) rotate(${angle}deg)`,
                  zIndex: i,
                  background: color,
                }}
              />
            );
          })}
        </Reveal>

        <Reveal className="svc-grid">
          {services.map((service) => (
            <div key={service}>{service}</div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
