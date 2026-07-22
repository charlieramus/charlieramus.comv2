import Image from "next/image";
import Reveal from "@/components/reveal";
import { webProjects } from "@/data/projects-web";
import { writing } from "@/data/writing";
import { rightNowPhoto } from "@/data/previews";
import { sections } from "@/site.config";

// "Right now" — Charlie's V2 "what's fresh" idea. Composed from the spotlight
// builds, the latest essay, and (V5 Stage 2) a recent-trip photo card.
const spotlight = webProjects.filter((p) => p.spotlight);
const [building, journal] = spotlight; // Ostiara, MyLifeInARepo
const latestEssay = [...writing].sort((a, b) => a.order - b.order)[0];

// Recent-trip photo: named in data/previews.ts (`rightNowPhoto`) by its photo
// `code`. Edit that one file to change which shot the card highlights.
const recentTrip = rightNowPhoto();

// First sentence of a description — a compact teaser without re-typing copy.
const firstSentence = (s: string) => s.split(". ")[0].replace(/\.$/, "") + ".";

type NowItem = {
  kick: string;
  dot: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  external: boolean;
};

const items: NowItem[] = [
  {
    kick: "Building",
    dot: "var(--color-blue)",
    title: building.title,
    desc: firstSentence(building.description),
    href: `/web-projects/${building.slug}`,
    cta: "View build ↗",
    external: false,
  },
  {
    kick: "For the Community",
    dot: "var(--color-yellow)",
    title: journal.title,
    desc: firstSentence(journal.description),
    href: journal.href || "/web-projects",
    cta: journal.href ? "View on GitHub ↗" : "About the build ↗",
    external: Boolean(journal.href),
  },
  {
    kick: "Latest essay",
    dot: "var(--color-red)",
    title: latestEssay.title,
    desc: `Published ${latestEssay.date}.`,
    href: "/writing",
    cta: "Read it ↗",
    external: false,
  },
];

export default function RightNow() {
  return (
    <section id="right-now" className="now">
      <div className="wrap">
        <Reveal className="head">
          {/* CUSTOMIZE: section heading + subline in site.config.ts (sections.rightNow) */}
          <h2>{sections.rightNow.title}</h2>
          <p>{sections.rightNow.subline}</p>
        </Reveal>

        <div className="now-grid">
          {items.map((it) => (
            <Reveal
              as="a"
              key={it.title}
              className="now-card"
              href={it.href}
              {...(it.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <span className="kick">
                <span className="fdot" style={{ background: it.dot }} /> {it.kick}
              </span>
              <h3>{it.title}</h3>
              <p className="now-desc">{it.desc}</p>
              <span className="go">{it.cta}</span>
            </Reveal>
          ))}

          {recentTrip && (
            <Reveal
              as="a"
              className="now-card now-photo"
              href="/photography"
            >
              <Image
                src={recentTrip.thumb}
                alt=""
                fill
                sizes="(max-width: 880px) 100vw, 25vw"
                className="now-photo-img"
                {...(recentTrip.blurDataURL
                  ? {
                      placeholder: "blur" as const,
                      blurDataURL: recentTrip.blurDataURL,
                    }
                  : {})}
              />
              <span className="now-photo-body">
                <span className="kick">
                  <span
                    className="fdot"
                    style={{ background: "var(--color-cyan)" }}
                  />{" "}
                  Recent trip
                </span>
                <h3>{recentTrip.location ?? "Latest shot"}</h3>
                <span className="go">See the gallery ↗</span>
              </span>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
