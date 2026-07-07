import Flower from "@/components/flower";
import Reveal from "@/components/reveal";

// Reusable [colored flower tile + white tile] stack that flanks each band.
function Stack({
  bg,
  petal,
  core,
  index,
}: {
  bg: string;
  petal: string;
  core: string;
  index: number;
}) {
  return (
    <div className="stack">
      <div className="tile" style={{ background: bg }}>
        <Flower petal={petal} core={core} petals={6} index={index} />
      </div>
      <div className="tile white" />
    </div>
  );
}

// The mockup's "Tiny fraction of my work" — alternating panel/stack bands.
// CUSTOMIZE: real projects + case studies land in later stages.
export default function Work() {
  return (
    <section id="work">
      <div className="wrap">
        <Reveal className="head">
          <h2>Tiny fraction of my work</h2>
          <p>
            Placeholder subline — teaming with founders on their next product
            breakthrough, design that&apos;s both functional and great looking.
          </p>
        </Reveal>

        <div className="proj">
          {/* Band 1 — detailed UI panel LEFT + stack RIGHT */}
          <Reveal className="band">
            <div className="panel">
              <div className="stage">
                <div className="card ui">
                  <span className="pill">◍ Powering safer, faster care</span>
                  <span className="thumb" />
                  <div className="big">
                    Placeholder product
                    <br />
                    headline here
                  </div>
                  <div className="srch">⌕</div>
                  <div className="statrow">
                    <span className="av" />
                    <span className="plus">+</span>
                    <b>250K</b>
                    <small>placeholder metric caption</small>
                  </div>
                  <div className="wave">▷</div>
                </div>
                <div
                  className="card photo"
                  style={{ background: "linear-gradient(160deg,#ffcf8a,#e8743b)" }}
                />
                <div className="label">
                  <b>Project One</b>
                  <span>medtech, ai</span>
                </div>
              </div>
            </div>
            <Stack bg="var(--color-blue)" petal="yellow" core="#FFCB41" index={10} />
          </Reveal>

          {/* Band 2 — stack LEFT + gallery panel RIGHT */}
          <Reveal className="band flip">
            <div className="panel">
              <div className="stage">
                <div
                  className="card mini"
                  style={{ left: 0, top: "6%", height: "170px", transform: "rotate(-3deg)" }}
                >
                  <div className="cap">
                    <i />
                    <i />
                  </div>
                  <div className="scr" style={{ background: "#3a2a5a" }}>
                    <div
                      className="boxrow"
                      style={{ height: "100%", flexWrap: "wrap", gap: "6px" }}
                    >
                      <div className="b" style={{ background: "#ffcb41" }} />
                      <div className="b" style={{ background: "#84def9" }} />
                      <div className="b" style={{ background: "#7a4fd0" }} />
                      <div className="b" style={{ background: "#2fae6b" }} />
                      <div className="b" style={{ background: "#e8743b" }} />
                      <div className="b" style={{ background: "#84def9" }} />
                    </div>
                  </div>
                </div>
                <div
                  className="card"
                  style={{
                    width: "30%",
                    right: "4%",
                    bottom: "6%",
                    height: "150px",
                    transform: "rotate(6deg)",
                    background: "linear-gradient(160deg,#c9a06a,#7a5a34)",
                  }}
                />
                <div className="label">
                  <b>Project Two</b>
                  <span>b2b, saas</span>
                </div>
              </div>
            </div>
            <Stack bg="var(--color-pink)" petal="blue" core="#0015D4" index={11} />
          </Reveal>

          {/* Full-width get-in-touch bar */}
          <Reveal className="touch">
            <p>
              There&apos;s a product case study as well. Feel free to get in touch
              to check it out.
            </p>
            <a className="btn" href="#">
              Case study
            </a>
          </Reveal>

          {/* Band 3 — panel LEFT + stack RIGHT */}
          <Reveal className="band">
            <div className="panel">
              <div className="stage">
                <div
                  className="card photo"
                  style={{
                    left: "2%",
                    top: "12%",
                    width: "34%",
                    height: "150px",
                    transform: "rotate(-5deg)",
                    background: "linear-gradient(160deg,#f0603a,#c23a20)",
                  }}
                />
                <div
                  className="card mini"
                  style={{ left: "22%", top: "6%", width: "64%", height: "180px", transform: "rotate(3deg)" }}
                >
                  <div className="cap">
                    <i />
                    <i />
                  </div>
                  <div
                    className="scr"
                    style={{
                      background: "#c9cbd0",
                      padding: "8px",
                      display: "grid",
                      gridTemplateColumns: "1.4fr 1fr",
                      gap: "6px",
                    }}
                  >
                    <div style={{ background: "#fff", borderRadius: "6px" }} />
                    <div
                      style={{
                        display: "grid",
                        gridTemplateRows: "1fr 1fr",
                        gap: "6px",
                      }}
                    >
                      <div style={{ background: "#111", borderRadius: "6px" }} />
                      <div style={{ background: "#f0603a", borderRadius: "6px" }} />
                    </div>
                  </div>
                </div>
                <div className="label">
                  <b>Project Three</b>
                  <span>fintech</span>
                </div>
              </div>
            </div>
            <Stack bg="var(--color-yellow)" petal="red" core="#F32317" index={12} />
          </Reveal>

          {/* Band 4 — stack LEFT + dark panel RIGHT */}
          <Reveal className="band flip">
            <div className="panel">
              <div className="stage">
                <div
                  className="card"
                  style={{
                    left: "6%",
                    top: "12%",
                    width: "82%",
                    height: "150px",
                    transform: "rotate(-2deg)",
                    background: "radial-gradient(circle at 60% 40%,#2b6bff,#0a0a1a)",
                  }}
                />
                <div className="label">
                  <b>Project Four</b>
                  <span>saas</span>
                </div>
              </div>
            </div>
            <Stack bg="var(--color-blue)" petal="yellow" core="#FFCB41" index={13} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
