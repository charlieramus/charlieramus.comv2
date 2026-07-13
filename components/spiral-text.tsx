import { useId } from "react";
import type { WritingSpiral } from "@/site.config";

/**
 * One decorative quote laid out along a generated Archimedean spiral
 * (r = a + bθ), rendered as SVG `<text>` on a `<textPath>`. The whole `<svg>`
 * rotates slowly via CSS (`.spiral-svg`); it is purely decorative —
 * `aria-hidden`, non-focusable, and `pointer-events: none` (set in CSS).
 *
 * No client JS: the path is computed deterministically at render, so this stays
 * a server component. `useId` keeps each spiral's `<path>` id unique on a page
 * with several spirals.
 */

type Size = NonNullable<WritingSpiral["size"]>;

// SVG box size (px) and font size (px) per size token.
const DIM: Record<Size, number> = { xs: 150, sm: 230, md: 320, lg: 410 };
const FONT: Record<Size, number> = { xs: 9, sm: 11, md: 12, lg: 14 };

// Build an Archimedean-spiral path string, sampled finely enough that a
// `<textPath>` reads as a smooth curve.
function spiralPath(
  cx: number,
  cy: number,
  a: number,
  b: number,
  turns: number,
): string {
  const maxT = turns * 2 * Math.PI;
  const step = 0.12;
  let d = "";
  for (let t = 0; t <= maxT; t += step) {
    const r = a + b * t;
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    d += `${t === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return d.trim();
}

export default function SpiralText({
  text,
  size = "md",
}: {
  text: string;
  size?: Size;
}) {
  const rawId = useId();
  const pathId = `spiral-${rawId.replace(/[:]/g, "")}`;

  const dim = DIM[size];
  const c = dim / 2;
  const a = 12; // inner radius
  const turns = 3;
  const b = (c - a - 6) / (turns * 2 * Math.PI); // spread so the outer turn fits
  const d = spiralPath(c, c, a, b, turns);

  // Repeat the quote (with a dot separator) so it fills the full spiral length.
  const filled = `${text}   ·   `.repeat(4);

  return (
    <svg
      className="spiral-svg"
      viewBox={`0 0 ${dim} ${dim}`}
      width={dim}
      height={dim}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <path id={pathId} d={d} fill="none" />
      </defs>
      <text className="spiral-text-el" fontSize={FONT[size]}>
        <textPath href={`#${pathId}`} startOffset="0">
          {filled}
        </textPath>
      </text>
    </svg>
  );
}
