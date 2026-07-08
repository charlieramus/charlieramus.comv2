import Reveal from "@/components/reveal";
import { webProjects } from "@/data/projects-web";
import { writing } from "@/data/writing";

// "Right now" — Charlie's V2 "what's fresh" idea. Composed from the spotlight
// builds + the latest essay. The recent-trip photo highlight is intentionally
// deferred to V4 (photos is empty until the gallery sync), so V3 ships the three
// real, text-backed items and adds the photo slot then.
const spotlight = webProjects.filter((p) => p.spotlight);
const [building, journal] = spotlight; // Ostiara, MyLifeInARepo
const latestEssay = [...writing].sort((a, b) => a.order - b.order)[0];

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
    href: building.href || "/web-projects",
    cta: building.href ? "View on GitHub ↗" : "See the build ↗",
    external: Boolean(building.href),
  },
  {
    kick: "Journaling",
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
    <section className="now">
      <div className="wrap">
        <Reveal className="head">
          {/* CUSTOMIZE: section copy */}
          <h2>Right now</h2>
          <p>
            A quick pulse on what&apos;s fresh, the active build, the open
            journal, and the latest essay.
          </p>
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
        </div>
      </div>
    </section>
  );
}
