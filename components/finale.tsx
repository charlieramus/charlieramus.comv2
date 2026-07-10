import Motif from "@/components/motif";
import { finaleQuote } from "@/data/about";

// Finale motif field — 40 marks with a deterministic color pattern. The SHAPE of
// each mark is auto-picked from `activeMotifs` by index (see components/motif.tsx),
// so the field is varied + desynced without any randomness, and swapping
// `activeMotifs` re-skins it.
const PET = ["#FF8FCA", "#0015D4", "#84DEF9", "#F32317", "#FFCB41"];
const COR = ["#ffffff", "#FFCB41", "#0015D4", "#84DEF9", "#FF8FCA", "#F32317"];

const FLOWERS = Array.from({ length: 40 }, (_, i) => {
  const fill = PET[(i * 3 + (i % 2)) % PET.length];
  let accent = COR[(i * 5) % COR.length];
  if (accent === fill) accent = "#ffffff";
  return { fill, accent };
});

export default function Finale() {
  return (
    <section className="finale">
      <div className="grid-flowers" aria-hidden="true">
        {FLOWERS.map((f, i) => (
          <Motif key={i} fill={f.fill} accent={f.accent} index={i} />
        ))}
      </div>
      {/* CUSTOMIZE: closing line lives in data/about.ts (finaleQuote) */}
      <div className="center-text">
        {finaleQuote.split("\n").map((line, i, all) => (
          <span key={i}>
            {line}
            {i < all.length - 1 && <br />}
          </span>
        ))}
      </div>
    </section>
  );
}
