import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/reveal";
import Motif from "@/components/motif";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { webProjects } from "@/data/projects-web";
import { sections } from "@/site.config";

export const metadata: Metadata = {
  title: "Web Projects",
  alternates: { canonical: "/web-projects" },
  description:
    "Software Charlie Ramus has designed and shipped solo — Ostiara, MyLifeInARepo, Querryn, VaultDNA and more. Next.js, TypeScript, Tailwind.",
};

// Fill colors cycled through the imageless-project placeholders (the motif shape
// itself rotates via `activeMotifs`, keyed off the row index).
const PETALS = ["red", "blue", "yellow", "pink", "cyan"];

// Friendly label for the external link.
function linkLabel(href: string): string {
  if (href.includes("github.com")) return "View on GitHub";
  return href.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export default function WebProjectsPage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="inner">

      <div className="wrap">
        <Reveal as="header" className="inner-head">
          <p className="writing-kicker">{sections.pages.webProjects.kicker}</p>
          {/* CUSTOMIZE: kicker + heading + lede in site.config.ts (sections.pages.webProjects) */}
          <h1>{sections.pages.webProjects.heading}</h1>
          <p className="inner-lede">{sections.pages.webProjects.lede}</p>
        </Reveal>

        <div className="proj-list">
          {webProjects.map((p, i) => (
            <Reveal className="proj-row" key={p.title}>
              <div className="proj-body">
                {p.spotlight && (
                  <span className="proj-kick">
                    <span
                      className="fdot"
                      style={{ background: "var(--color-red)" }}
                    />{" "}
                    Featured
                  </span>
                )}
                <h2>
                  {p.icon && (
                    <span className="proj-icon" aria-hidden>
                      <Image
                        src={p.icon}
                        alt=""
                        fill
                        sizes="40px"
                        className="proj-icon-img"
                      />
                    </span>
                  )}
                  <Link
                    href={`/web-projects/${p.slug}`}
                    prefetch={false}
                    className="proj-title-link"
                  >
                    {p.title}
                  </Link>
                </h2>
                <p className="proj-meta">{p.date}</p>
                <p className="proj-desc">{p.description}</p>
                <div className="proj-tags">
                  {p.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                {p.href && (
                  <a
                    className="proj-link"
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {linkLabel(p.href)} ↗
                  </a>
                )}
              </div>

              <div className="proj-visual">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={`${p.title} screenshot`}
                    fill
                    sizes="(max-width: 880px) 100vw, 440px"
                    className="proj-img"
                  />
                ) : p.icon ? (
                  <div className="proj-placeholder">
                    <span className="proj-placeholder-icon">
                      <Image
                        src={p.icon}
                        alt={`${p.title} icon`}
                        fill
                        sizes="200px"
                        className="proj-icon-img"
                      />
                    </span>
                  </div>
                ) : (
                  <div className="proj-placeholder">
                    <Motif fill={PETALS[i % PETALS.length]} index={i} />
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      </main>

      <SiteFooter />
    </>
  );
}
