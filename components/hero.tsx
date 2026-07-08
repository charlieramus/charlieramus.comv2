import Flower from "@/components/flower";
import Reveal from "@/components/reveal";
import { snapshot } from "@/data/about";

// Nav sits at the top of the hero; nothing is sticky (it scrolls away).
export default function Hero() {
  return (
    <header className="hero">
      <div className="bloom left" aria-hidden="true">
        <Flower petal="#84DEF9" core="#0015D4" petals={7} index={1} />
      </div>
      <div className="bloom right" aria-hidden="true">
        <Flower petal="#F32317" core="#F4F3EE" petals={8} index={2} />
      </div>

      <nav>
        {/* CUSTOMIZE: nav labels + hrefs (homepage anchors; V4 adds inner routes) */}
        <a href="#work">work</a>
        <a href="/photography">photography</a>
        <a href="#about">about</a>
      </nav>

      <Reveal className="inner">
        {/* Hero: the name IS the headline — big, bold, stacked one word per
            line. Charlie's V2 call (name over tagline); `tagline` is <meta>-only. */}
        {/* CUSTOMIZE: headline is snapshot.name (data/about.ts) */}
        <h1>
          {snapshot.name.split(" ").map((word) => (
            <span key={word} className="name-line">
              {word}
            </span>
          ))}
        </h1>
      </Reveal>
    </header>
  );
}
