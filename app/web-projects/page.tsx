import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/reveal";
import Flower from "@/components/flower";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { webProjects } from "@/data/projects-web";

export const metadata: Metadata = {
  title: "Web Projects",
  alternates: { canonical: "/web-projects" },
  description:
    "Software Charlie Ramus has designed and shipped solo — Ostiara, MyLifeInARepo, Querryn, VaultDNA and more. Next.js, TypeScript, Tailwind.",
};

// Petal colors cycled through the imageless-project placeholders.
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
          <p className="writing-kicker">Web Projects</p>
          {/* CUSTOMIZE: heading + lede */}
          <h1>Things I&apos;ve built</h1>
          <p className="inner-lede">
            Sites, apps and extensions — designed and shipped solo, from the
            backend to the last pixel.
          </p>
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
                <h2>{p.title}</h2>
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
                ) : (
                  <div className="proj-placeholder">
                    <Flower petal={PETALS[i % PETALS.length]} index={i} />
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
