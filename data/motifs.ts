// Pluggable motif registry — the swappable "flowers."
//
// Each motif is a pure function of up to two colors that returns the INNER
// markup of a `0 0 100 100` SVG. Because it's just a string, the exact same
// shape + tint renders in the DOM (via <Motif>, components/motif.tsx) AND in
// Satori / ImageResponse (the generated OG card + favicon, app/*.tsx) with zero
// divergence — one definition, both worlds.
//
// ── CUSTOMIZE: add your own motif ──────────────────────────────────────────
//   1. Add an entry to `motifs` below. Its `render(c)` must return SVG markup
//      (ellipses, paths, polygons…) sized to the `0 0 100 100` viewBox, using
//      `c.fill` for the main color and — for 2-slot designs — `c.accent`.
//      Pasting a hand-authored SVG? Drop its inner elements in and swap the hard
//      colors for `${fill}` / `${accent}` so it tints with the site.
//   2. Add the entry's `key` to `activeMotifs` to put it in rotation.
//   That's it — no component edits. See MANUAL-TODO.md §7.
// ---------------------------------------------------------------------------

export type MotifColors = { fill: string; accent: string };

export type Motif = {
  /** Stable registry key (used by <Motif motif="…"> and activeMotifs). */
  key: string;
  /** Human label (docs / a future picker UI). */
  label: string;
  /** How many color slots the design actually paints (1 = fill only). */
  slots: 1 | 2;
  /** Wind-spin? Defaults to true. Set false for rotationally-symmetric shapes
   *  (a plain ring) where spinning is invisible and just wastes a compositor
   *  layer. */
  spin?: boolean;
  /** Returns the inner markup of a `0 0 100 100` SVG, tinted with `c`. */
  render: (c: MotifColors) => string;
};

// ── Named palette (mirrors the mockup's `NAMED` map). Call sites may pass a key
//    here or a raw hex; resolveColor() normalizes either. ────────────────────
export const NAMED: Record<string, string> = {
  red: "#F32317",
  blue: "#0015D4",
  yellow: "#FFCB41",
  pink: "#FF8FCA",
  cyan: "#84DEF9",
};

export function resolveColor(c: string): string {
  return NAMED[c] ?? c;
}

// ── Small geometry helpers (deterministic → SSR-safe, no Math.random) ───────
function petalRing(
  n: number,
  color: string,
  shape: (rx: number, ry: number) => string,
  rx: number,
  ry: number,
): string {
  return Array.from({ length: n }, (_, i) => {
    const a = (360 / n) * i;
    return `<g transform="rotate(${a} 50 50)">${shape(rx, ry)}</g>`;
  }).join("");
}

function starPoints(
  cx: number,
  cy: number,
  ro: number,
  ri: number,
  points: number,
): string {
  const out: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? ro : ri;
    const a = (Math.PI / points) * i - Math.PI / 2; // first point straight up
    out.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return out.join(" ");
}

// ── The designs ─────────────────────────────────────────────────────────────
// The mockup daisy — shipped as the default so nothing regresses on day one.
function daisy({ fill, accent }: MotifColors, n = 7): string {
  const petals = Array.from({ length: n }, (_, i) => {
    const a = (360 / n) * i;
    const rx = 12 + (i % 2 ? 1.2 : -0.8);
    const ry = 19 + (i % 3 ? 0 : 1.2);
    return `<ellipse cx="50" cy="28" rx="${rx}" ry="${ry}" fill="${fill}" transform="rotate(${a} 50 50)"/>`;
  }).join("");
  return `${petals}<circle cx="50" cy="50" r="11" fill="${accent}"/>`;
}

// Full, rounded five-petal bloom.
function bloom5({ fill, accent }: MotifColors): string {
  const petals = petalRing(
    5,
    fill,
    () => `<circle cx="50" cy="26" r="17" fill="${fill}"/>`,
    0,
    0,
  );
  return `${petals}<circle cx="50" cy="50" r="12" fill="${accent}"/>`;
}

// Dense, spiky aster — many thin petals.
function aster({ fill, accent }: MotifColors): string {
  const petals = petalRing(
    12,
    fill,
    () => `<ellipse cx="50" cy="22" rx="5" ry="21" fill="${fill}"/>`,
    0,
    0,
  );
  return `${petals}<circle cx="50" cy="50" r="9" fill="${accent}"/>`;
}

// Four-lobed clover / quatrefoil.
function clover({ fill, accent }: MotifColors): string {
  const lobes = petalRing(
    4,
    fill,
    () => `<circle cx="50" cy="30" r="20" fill="${fill}"/>`,
    0,
    0,
  );
  return `${lobes}<circle cx="50" cy="50" r="10" fill="${accent}"/>`;
}

// Eight-ray sun / burst.
function burst({ fill, accent }: MotifColors): string {
  const rays = petalRing(
    8,
    fill,
    () => `<polygon points="45,4 55,4 50,30" fill="${fill}"/>`,
    0,
    0,
  );
  return `${rays}<circle cx="50" cy="50" r="21" fill="${accent}"/>`;
}

// Solid five-point star (single color slot).
function star5({ fill }: MotifColors): string {
  return `<polygon points="${starPoints(50, 50, 47, 19, 5)}" fill="${fill}"/>`;
}

// Concentric ring + dot (rotationally symmetric → no spin).
function ring({ fill, accent }: MotifColors): string {
  return `<circle cx="50" cy="50" r="37" fill="none" stroke="${fill}" stroke-width="13"/><circle cx="50" cy="50" r="12" fill="${accent}"/>`;
}

export const motifs: Motif[] = [
  { key: "daisy", label: "Daisy", slots: 2, render: (c) => daisy(c) },
  { key: "bloom5", label: "Five-petal bloom", slots: 2, render: bloom5 },
  { key: "aster", label: "Aster", slots: 2, render: aster },
  { key: "clover", label: "Clover", slots: 2, render: clover },
  { key: "burst", label: "Sunburst", slots: 2, render: burst },
  { key: "star5", label: "Star", slots: 1, render: star5 },
  { key: "ring", label: "Ring", slots: 2, spin: false, render: ring },
];

// ── activeMotifs: which keys are "in rotation." Render sites pick from this by
//    index, so fields stay varied + desynced, and ONE edit here re-skins the
//    whole site (hero, finale field, bento tiles, work stacks, web placeholders)
//    AND the generated OG card + favicon. `activeMotifs[0]` is the brand mark
//    used for the favicon / apple-icon — keep the one you want as the icon first.
//    CUSTOMIZE: reorder / trim / extend this list. ────────────────────────────
export const activeMotifs: string[] = [
  "daisy",
  "bloom5",
  "clover",
  "aster",
  "star5",
  "burst",
  "ring",
];

const byKey = new Map(motifs.map((m) => [m.key, m]));

export function getMotif(key: string): Motif {
  const m = byKey.get(key);
  if (!m) throw new Error(`Unknown motif "${key}" — add it to data/motifs.ts`);
  return m;
}

/** Deterministically pick an active motif by position in a field. */
export function motifForIndex(index: number): Motif {
  const n = activeMotifs.length;
  const key = activeMotifs[(((index % n) + n) % n)];
  return getMotif(key);
}

/** Inner SVG markup for a motif, colors resolved (named or hex). */
export function renderMotif(key: string, colors: MotifColors): string {
  return getMotif(key).render({
    fill: resolveColor(colors.fill),
    accent: resolveColor(colors.accent),
  });
}

/** Standalone `<svg>…</svg>` string (with xmlns) — for Satori / data URIs. */
export function motifSvg(key: string, colors: MotifColors): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${renderMotif(key, colors)}</svg>`;
}

/** `data:image/svg+xml` URI (utf-8, runtime-agnostic — no Buffer), usable as an
 *  `<img src>` inside ImageResponse (OG card + favicons). */
export function motifDataUri(key: string, colors: MotifColors): string {
  return `data:image/svg+xml,${encodeURIComponent(motifSvg(key, colors))}`;
}
