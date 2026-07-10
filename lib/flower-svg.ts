// The mockup daisy as a standalone SVG string / data URI, for contexts that
// can't render the React <Flower> — Satori/ImageResponse (icons + OG images).
// Geometry mirrors components/flower.tsx verbatim (same petal loop + core).

/** Petal palette (mirrors the NAMED map in components/flower.tsx). */
export const PETAL = {
  red: "#F32317",
  blue: "#0015D4",
  yellow: "#FFCB41",
  pink: "#FF8FCA",
  cyan: "#84DEF9",
} as const;

/** Raw `<svg>…</svg>` string for a daisy with `n` petals. */
export function flowerSvg(petal: string, core: string, n: number): string {
  const count = Math.max(1, n);
  const petals = Array.from({ length: count }, (_, i) => {
    const a = (360 / count) * i;
    const rx = 12 + (i % 2 ? 1.2 : -0.8);
    const ry = 19 + (i % 3 ? 0 : 1.2);
    return `<ellipse cx="50" cy="28" rx="${rx}" ry="${ry}" fill="${petal}" transform="rotate(${a} 50 50)"/>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${petals}<circle cx="50" cy="50" r="11" fill="${core}"/></svg>`;
}

/** Same daisy as a `data:image/svg+xml` URI (utf-8, runtime-agnostic — no Buffer),
 *  usable as an `<img src>` inside ImageResponse. */
export function flowerDataUri(petal: string, core: string, n: number): string {
  return `data:image/svg+xml,${encodeURIComponent(flowerSvg(petal, core, n))}`;
}
