import type { CSSProperties } from "react";

// Named flower petal palette (mockup's `NAMED` map). `petal` accepts either a
// key here or a raw hex string.
const NAMED: Record<string, string> = {
  red: "#F32317",
  blue: "#0015D4",
  yellow: "#FFCB41",
  pink: "#FF8FCA",
  cyan: "#84DEF9",
};

type FlowerProps = {
  /** Petal color: a NAMED key ("red", "blue", …) or a raw hex string. */
  petal?: string;
  /** Center color. */
  core?: string;
  /** Petal count (mockup's `n`). */
  petals?: number;
  /**
   * Position in its field. Seeds the wind-spin timing deterministically so the
   * server and client render identically (no Math.random → no hydration drift).
   */
  index?: number;
  className?: string;
};

/**
 * The mockup's daisy SVG (`flowerSVG(petal, core, n)`), ported to a server
 * component. Decorative → `aria-hidden`. Wind-spin is CSS (see `.flower` /
 * `@keyframes windspin` in globals.css); this only feeds it per-flower timing.
 */
export default function Flower({
  petal = "red",
  core = "#ffffff",
  petals = 7,
  index = 0,
  className = "",
}: FlowerProps) {
  const fill = NAMED[petal] ?? petal;
  const n = Math.max(1, petals);

  // Petal geometry, verbatim from the mockup's generator loop.
  const petalEls = Array.from({ length: n }, (_, i) => {
    const a = (360 / n) * i;
    const rx = 12 + (i % 2 ? 1.2 : -0.8);
    const ry = 19 + (i % 3 ? 0 : 1.2);
    return (
      <ellipse
        key={i}
        cx="50"
        cy="28"
        rx={rx}
        ry={ry}
        fill={fill}
        transform={`rotate(${a} 50 50)`}
      />
    );
  });

  // Deterministic per-flower spin timing derived from `index` (Knuth
  // multiplicative hash). Duration ~6–11s; a negative delay desyncs the field
  // so no two flowers gust in lockstep.
  const h = (Math.imul(index + 1, 2654435761) >>> 0) || 1;
  const spinDur = 6 + (h % 500) / 100; // 6.00–10.99s
  const spinDelay = -((h >>> 3) % 900) / 100; // 0 to −8.99s

  const style = {
    "--spin-dur": `${spinDur.toFixed(2)}s`,
    "--spin-delay": `${spinDelay.toFixed(2)}s`,
  } as CSSProperties;

  return (
    <span
      className={`flower ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100">
        {petalEls}
        <circle cx="50" cy="50" r="11" fill={core} />
      </svg>
    </span>
  );
}
