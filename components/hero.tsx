import Motif from "@/components/motif";
import Reveal from "@/components/reveal";
import { snapshot } from "@/data/about";
import { sections } from "@/site.config";

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
        {/* CUSTOMIZE: edit nav labels + hrefs in site.config.ts (sections.nav).
            Rendered as fixed siblings (not a .map) so the three anchors keep the
            same keyless markup they had before V9 — add/remove an item here + in
            the config together. */}
        <a href={sections.nav[0].href}>{sections.nav[0].label}</a>
        <a href={sections.nav[1].href}>{sections.nav[1].label}</a>
        <a href={sections.nav[2].href}>{sections.nav[2].label}</a>
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
