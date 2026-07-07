import Flower from "@/components/flower";
import { finaleQuote } from "@/data/about";

// Finale flower field — the mockup builds 40 flowers with a deterministic
// color/petal pattern. Reproduced exactly (indices seed the wind-spin, so the
// field stays desynced without any randomness).
const PET = ["#FF8FCA", "#0015D4", "#84DEF9", "#F32317", "#FFCB41"];
const COR = ["#ffffff", "#FFCB41", "#0015D4", "#84DEF9", "#FF8FCA", "#F32317"];

const FLOWERS = Array.from({ length: 40 }, (_, i) => {
  const petal = PET[(i * 3 + (i % 2)) % PET.length];
  let core = COR[(i * 5) % COR.length];
  if (core === petal) core = "#ffffff";
  return { petal, core, petals: 5 + (i % 4) };
});

export default function Finale() {
  return (
    <section className="finale">
      <div className="grid-flowers" aria-hidden="true">
        {FLOWERS.map((f, i) => (
          <Flower
            key={i}
            petal={f.petal}
            core={f.core}
            petals={f.petals}
            index={i}
          />
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
