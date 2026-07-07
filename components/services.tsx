import Reveal from "@/components/reveal";

// Fanned card stack colors + the services list (CUSTOMIZE for real services).
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

const SERVICES = [
  "Product Design",
  "Animation",
  "Framer",
  "Websites / Apps",
  "Midjourney",
  "Marketing",
  "Design systems",
  "Visual identity",
  "Iconography",
];

export default function Services() {
  return (
    <section id="garden">
      <div className="wrap">
        <Reveal className="head">
          <h2>I&apos;ve got your back with…</h2>
          <p>
            Digital aesthetics that engage and emotionally connect with your
            users
          </p>
        </Reveal>

        <Reveal className="fan">
          {FAN_COLORS.map((color, i) => {
            const angle = (i - FAN_COLORS.length / 2) * 7;
            return (
              <div
                key={i}
                className="fc"
                style={{
                  left: `${i * 44}px`,
                  transform: `rotate(${angle}deg)`,
                  zIndex: i,
                  background: color,
                }}
              />
            );
          })}
        </Reveal>

        <Reveal className="svc-grid">
          {SERVICES.map((service) => (
            <div key={service}>{service}</div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
