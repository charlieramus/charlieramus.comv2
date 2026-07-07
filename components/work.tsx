import Flower from "@/components/flower";
import Reveal from "@/components/reveal";
import { webProjects, type WebProject } from "@/data/projects-web";

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

// Compact caption under each band's (placeholder) device visual: title + date +
// the top tags. Full descriptions live on /web-projects (V4) and the flagship's
// blurb is in the .touch bar — the visual panels can't hold a paragraph each.
function Caption({ p }: { p: WebProject }) {
  return (
    <div className="label">
      <b>{p.title}</b>
      <span>
        {p.date} · {p.tags.slice(0, 2).join(", ").toLowerCase()}
      </span>
    </div>
  );
}

// Homepage work = the top 4 curated projects (Charlie's V3 call: the two
// spotlight builds, then charlieramus.com + VaultDNA — Querryn dropped to the
// /web-projects long tail). The four bespoke panels keep their placeholder
// visuals until V4 screenshots; only the captions + case-study bar are wired.
const BAND_TITLES = ["Ostiara", "MyLifeInARepo", "charlieramus.com", "VaultDNA"];
const bands = BAND_TITLES.map(
  (t) => webProjects.find((p) => p.title === t) as WebProject,
);
const [flagship] = bands; // Ostiara

export default function Work() {
  return (
    <section id="work">
      <div className="wrap">
        <Reveal className="head">
          <h2>Tiny fraction of my work</h2>
          {/* CUSTOMIZE: work subline */}
          <p>
            A few things I&apos;ve built solo, end to end — from the backend and
            data model to the design system and the copy.
          </p>
        </Reveal>

        <div className="proj">
          {/* Band 1 — detailed UI panel LEFT + stack RIGHT (flagship: Ostiara) */}
          <Reveal className="band">
            <div className="panel">
              <div className="stage">
                <div className="card ui">
                  <span className="pill">◍ Door-to-door, streamlined</span>
                  <span className="thumb" />
                  <div className="big">{flagship.title}</div>
                  <div className="srch">⌕</div>
                  <div className="statrow">
                    <span className="av" />
                    <span className="plus">+</span>
                    <b>5</b>
                    <small>home-service verticals</small>
                  </div>
                  <div className="wave">▷</div>
                </div>
                <div
                  className="card photo"
                  style={{ background: "linear-gradient(160deg,#ffcf8a,#e8743b)" }}
                />
                <Caption p={bands[0]} />
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
                <Caption p={bands[1]} />
              </div>
            </div>
            <Stack bg="var(--color-pink)" petal="blue" core="#0015D4" index={11} />
          </Reveal>

          {/* Full-width case-study bar → the flagship (Ostiara) blurb */}
          <Reveal className="touch">
            <p>{flagship.description}</p>
            <a
              className="btn"
              href={flagship.href || "/web-projects"}
              {...(flagship.href
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              View {flagship.title} ↗
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
                <Caption p={bands[2]} />
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
                <Caption p={bands[3]} />
              </div>
            </div>
            <Stack bg="var(--color-blue)" petal="yellow" core="#FFCB41" index={13} />
          </Reveal>

          {/* Curation continues on the inner route (dead until V4) */}
          <Reveal as="a" className="proj-all" href="/web-projects">
            See all my work ↗
          </Reveal>
        </div>
      </div>
    </section>
  );
}
