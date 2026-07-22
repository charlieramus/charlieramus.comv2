import Image from "next/image";
import Motif from "@/components/motif";
import Reveal from "@/components/reveal";
import { workBandProjects } from "@/data/previews";
import { sections } from "@/site.config";

// Reusable [colored motif tile + white tile] stack that flanks each band.
function Stack({
  bg,
  fill,
  accent,
  index,
}: {
  bg: string;
  fill: string;
  accent: string;
  index: number;
}) {
  return (
    <div className="stack">
      <div className="tile" style={{ background: bg }}>
        <Motif fill={fill} accent={accent} index={index} />
      </div>
      <div className="tile white" />
    </div>
  );
}

// One [colored/white motif stack] palette per band, cycled by index so any
// number of curated bands stays on-brand.
const STACK_THEMES = [
  { bg: "var(--color-blue)", fill: "yellow", accent: "#FFCB41", index: 10 },
  { bg: "var(--color-pink)", fill: "blue", accent: "#0015D4", index: 11 },
  { bg: "var(--color-yellow)", fill: "red", accent: "#F32317", index: 12 },
] as const;

// Homepage work = the projects curated in site.config.ts (`previews.workBands`).
// Each band now shows a small stack of that project's REAL screenshots (was:
// bespoke placeholder UI mockups) and the whole band links to the project's
// case study at /web-projects/<slug>. Editing the curation or the project's
// screenshot paths in site.config.ts is all that's needed — no JSX changes.
const bands = workBandProjects();

export default function Work() {
  return (
    <section id="work">
      <div className="wrap">
        <Reveal className="head">
          <h2>Tiny fraction of my work</h2>
          {/* CUSTOMIZE: work subline in site.config.ts (sections.work.subline) */}
          <p>{sections.work.subline}</p>
        </Reveal>

        <div className="proj">
          {bands.map((p, i) => {
            const theme = STACK_THEMES[i % STACK_THEMES.length];
            return (
              <Reveal
                key={p.slug}
                as="a"
                href={`/web-projects/${p.slug}`}
                className={`band${i % 2 ? " flip" : ""}`}
              >
                <div className="panel">
                  {/* Static grid: hero shot on the left, the two square shots
                      stacked on the right. Plain lazy images — no animation. */}
                  <div className="stage pshots">
                    {p.heroShot ? (
                      <span className="pshot pshot-hero">
                        <Image
                          src={p.heroShot}
                          alt=""
                          fill
                          sizes="(max-width: 880px) 60vw, 360px"
                        />
                      </span>
                    ) : null}
                    {p.squares?.[0] ? (
                      <span className="pshot">
                        <Image
                          src={p.squares[0]}
                          alt=""
                          fill
                          sizes="96px"
                        />
                      </span>
                    ) : null}
                    {p.squares?.[1] ? (
                      <span className="pshot">
                        <Image
                          src={p.squares[1]}
                          alt=""
                          fill
                          sizes="96px"
                        />
                      </span>
                    ) : null}
                    <div className="label">
                      <b>{p.title}</b>
                      <span>
                        {p.date} · {p.tags.slice(0, 2).join(", ").toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <Stack
                  bg={theme.bg}
                  fill={theme.fill}
                  accent={theme.accent}
                  index={theme.index}
                />
              </Reveal>
            );
          })}

          {/* Curation continues on the inner route (/web-projects). */}
          <Reveal as="a" className="proj-all" href="/web-projects">
            See all my work ↗
          </Reveal>
        </div>
      </div>
    </section>
  );
}
