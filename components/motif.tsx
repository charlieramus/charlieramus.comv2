import type { CSSProperties } from "react";
import { getMotif, motifForIndex, renderMotif } from "@/data/motifs";

type MotifProps = {
  /** Registry key (data/motifs.ts). Omit to auto-pick from `activeMotifs` by
   *  `index` — that's what keeps a field varied and lets one edit to
   *  `activeMotifs` re-skin every render site at once. */
  motif?: string;
  /** Color slot 1 — a NAMED key ("red", "blue", …) or a raw hex string. */
  fill?: string;
  /** Color slot 2 (center / accent). Ignored by 1-slot designs. */
  accent?: string;
  /**
   * Position in its field. Seeds the wind-spin timing deterministically (and,
   * when `motif` is omitted, which motif) so server and client render
   * identically — no Math.random, no hydration drift.
   */
  index?: number;
  className?: string;
};

/**
 * Renders a registry motif as a decorative, `aria-hidden` mark. The shape comes
 * from data/motifs.ts (shared verbatim with the OG/favicon generators); this
 * component adds the deterministic CSS wind-spin (see `.motif` / `@keyframes
 * windspin` in globals.css) and color tinting. Motifs flagged `spin: false`
 * render static.
 */
export default function Motif({
  motif,
  fill = "red",
  accent = "#ffffff",
  index = 0,
  className = "",
}: MotifProps) {
  const def = motif ? getMotif(motif) : motifForIndex(index);
  const inner = renderMotif(def.key, { fill, accent });
  const spins = def.spin !== false;

  // Deterministic per-mark spin timing derived from `index` (Knuth
  // multiplicative hash). Duration ~6–11s; a negative delay desyncs the field
  // so no two marks gust in lockstep.
  const h = (Math.imul(index + 1, 2654435761) >>> 0) || 1;
  const spinDur = 6 + (h % 500) / 100; // 6.00–10.99s
  const spinDelay = -((h >>> 3) % 900) / 100; // 0 to −8.99s

  const style = spins
    ? ({
        "--spin-dur": `${spinDur.toFixed(2)}s`,
        "--spin-delay": `${spinDelay.toFixed(2)}s`,
      } as CSSProperties)
    : undefined;

  return (
    <span
      className={`motif${spins ? "" : " no-spin"} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" dangerouslySetInnerHTML={{ __html: inner }} />
    </span>
  );
}
