import Flower from "@/components/flower";
import Reveal from "@/components/reveal";

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
        {/* CUSTOMIZE: nav labels */}
        <a href="#work">works</a>
        <span className="logo">studio</span>
        <a href="#garden">garden</a>
      </nav>

      <Reveal className="inner">
        <svg className="rainbow" viewBox="0 0 100 55">
          <g fill="none" strokeWidth="6" strokeLinecap="round">
            <path d="M8 52 A42 42 0 0 1 92 52" stroke="#F32317" />
            <path d="M18 52 A32 32 0 0 1 82 52" stroke="#FFCB41" />
            <path d="M28 52 A22 22 0 0 1 72 52" stroke="#0015D4" />
          </g>
        </svg>
        {/* CUSTOMIZE: hero copy (placeholder from mockup) */}
        <div className="hi">Hi, I&apos;m [ your name ]</div>
        <h1>Visual and Product designer you can count on</h1>
        <p className="lede">
          Placeholder tagline goes here — one or two lines on how you simplify
          complex ideas into products people love. Swap this copy for your own.
        </p>
        <div className="rule" />
        <a className="btn" href="#">
          Chat with me
        </a>
      </Reveal>
    </header>
  );
}
