import Motif from "@/components/motif";
import Reveal from "@/components/reveal";
import { snapshot } from "@/data/about";

// Nav sits at the top of the hero; nothing is sticky (it scrolls away).
export default function Hero() {
  return (
    <header className="hero">
      <div className="bloom left" aria-hidden="true">
        <Motif fill="#84DEF9" accent="#0015D4" index={1} />
      </div>
      <div className="bloom right" aria-hidden="true">
        <Motif fill="#F32317" accent="#F4F3EE" index={2} />
      </div>

      <nav aria-label="Primary">
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
