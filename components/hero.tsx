import Flower from "@/components/flower";
import Reveal from "@/components/reveal";
import { snapshot } from "@/data/about";
import { contactEmail } from "@/data/socials";

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
        <span className="logo">charlie ramus</span>
        <a href="#about">about</a>
      </nav>

      <Reveal className="inner">
        <svg className="rainbow" viewBox="0 0 100 55">
          <g fill="none" strokeWidth="6" strokeLinecap="round">
            <path d="M8 52 A42 42 0 0 1 92 52" stroke="#F32317" />
            <path d="M18 52 A32 32 0 0 1 82 52" stroke="#FFCB41" />
            <path d="M28 52 A22 22 0 0 1 72 52" stroke="#0015D4" />
          </g>
        </svg>
        {/* Hero: greeting + name as headline. Charlie's V2 call — the name is
            the hero, `tagline` is <meta>-only, and no lede line under it. */}
        <div className="hi">Hi, I&apos;m</div>
        {/* CUSTOMIZE: headline is snapshot.name (data/about.ts) */}
        <h1>{snapshot.name}</h1>
        <div className="rule" />
        <a className="btn" href={`mailto:${contactEmail}`}>
          Chat with me
        </a>
      </Reveal>
    </header>
  );
}
