import Flower from "@/components/flower";
import Reveal from "@/components/reveal";

// Placeholder home — Stage 3 replaces this with the real section components.
// For now it exercises the Stage 1 tokens + Stage 2 motion primitives.
const PALETTE = ["red", "blue", "yellow", "pink", "cyan"] as const;

export default function Home() {
  return (
    <Reveal
      as="main"
      className="flex flex-1 flex-col items-center justify-center gap-4 bg-paper px-6 text-center text-ink"
    >
      <span className="font-script text-4xl text-ink">Charlie Ramus</span>
      <h1 className="font-serif text-3xl tracking-tight text-ink sm:text-5xl">
        Design system online.
      </h1>
      <p className="max-w-md font-sans text-ink-soft">
        Foundation stage — palette, fonts, and motion primitives wired up. The
        homepage lands in Stage 3.
      </p>
      <div className="mt-4 flex items-end gap-4">
        {PALETTE.map((petal, i) => (
          <Flower
            key={petal}
            petal={petal}
            core="#ffffff"
            petals={5 + (i % 4)}
            index={i}
            className="w-12"
          />
        ))}
      </div>
    </Reveal>
  );
}
