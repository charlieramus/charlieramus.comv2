import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/reveal";
import Motif from "@/components/motif";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { webProjects } from "@/data/projects-web";
import { webProjectBySlug, nextWebProject } from "@/data/previews";
import { SITE_URL } from "@/data/site";

// Prerender exactly the projects in the manifest; anything else 404s. Same
// static-params pattern as /writing/[slug], so `output: export` stays fully
// static and unknown slugs never render.
export function generateStaticParams() {
  return webProjects.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

// Petal fills cycled through the process markers (the flower shape itself
// rotates via `activeMotifs`, keyed off the entry index) — same pattern as the
// /web-projects list placeholders.
const PETALS = ["red", "blue", "yellow", "pink", "cyan"];

// Friendly label for the external link (mirrors the /web-projects list page).
function linkLabel(href: string): string {
  if (href.includes("github.com")) return "View on GitHub";
  return href.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = webProjectBySlug(slug);
  if (!project) return {};
  // Prefer the case-study hero screenshot for the social card, then the list
  // thumbnail, then the site OG fallback.
  const ogImage = project.heroShot ?? project.image;
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/web-projects/${slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.description,
      images: ogImage
        ? [{ url: ogImage, alt: `${project.title} screenshot` }]
        : ["/opengraph-image"],
    },
  };
}

export default async function WebProjectDetail({ params }: Params) {
  const { slug } = await params;
  // dynamicParams = false guarantees this resolves for every prerendered slug.
  const project = webProjectBySlug(slug)!;
  // Next case study, derived from webProjects order (wraps last → first).
  const next = nextWebProject(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    author: { "@type": "Person", name: "Charlie Ramus", url: SITE_URL },
    ...(project.heroShot || project.image
      ? { image: `${SITE_URL}${project.heroShot ?? project.image}` }
      : {}),
    url: `${SITE_URL}/web-projects/${slug}`,
    mainEntityOfPage: `${SITE_URL}/web-projects/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="inner">

      <div className="wrap">
        {/* SLIM HEADER — the screenshots carry the page; keep this quiet.
            Tags + link move into the Overview facts card (Stage 3). */}
        <Reveal as="header" className="inner-head case-head">
          <Link href="/web-projects" prefetch={false} className="case-back">
            ← All projects
          </Link>
          <h1>{project.title}</h1>
          <p className="proj-meta">{project.date}</p>
        </Reveal>

        {/* HERO SHOT — full-width rounded main screenshot, no caption. */}
        {project.heroShot && (
          <Reveal className="case-hero">
            <Image
              src={project.heroShot}
              alt={`${project.title} screenshot`}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="case-hero-img"
              priority
            />
          </Reveal>
        )}

        {/* CARDS — Overview facts · What I worked on · The Challenge. Each card
            renders only when it has content; the row is hidden if none do. The
            Overview card is gated on `project.overview` (an authored intent) —
            NOT on the always-derivable date/tags — so unauthored projects show
            no card row (see Stage 5's empty-state). Once shown, its rows fall
            back: timeline→date, stack→tags, link→href. */}
        {(project.overview || project.worked || project.challenge) && (
          <Reveal className="case-cards">
            {project.overview && (
              <section className="case-card">
                <h2 className="case-card-title">Project Overview</h2>
                <dl className="case-card-facts">
                  {project.overview.role && (
                    <div className="fact">
                      <dt>Role</dt>
                      <dd>{project.overview.role}</dd>
                    </div>
                  )}
                  <div className="fact">
                    <dt>Timeline</dt>
                    <dd>{project.overview.timeline ?? project.date}</dd>
                  </div>
                  {(project.overview.stack ?? project.tags).length > 0 && (
                    <div className="fact">
                      <dt>Stack</dt>
                      <dd className="fact-tags">
                        {(project.overview.stack ?? project.tags).map((t) => (
                          <span className="tag" key={t}>
                            {t}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                  {project.overview.status && (
                    <div className="fact">
                      <dt>Status</dt>
                      <dd>{project.overview.status}</dd>
                    </div>
                  )}
                  {(project.overview.link ?? project.href) && (
                    <div className="fact">
                      <dt>Link</dt>
                      <dd>
                        <a
                          className="proj-link fact-link"
                          href={project.overview.link ?? project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {linkLabel(project.overview.link ?? project.href)} ↗
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </section>
            )}
            {project.worked && (
              <section className="case-card">
                <h2 className="case-card-title">What I worked on</h2>
                <p className="case-card-text">{project.worked}</p>
              </section>
            )}
            {project.challenge && (
              <section className="case-card">
                <h2 className="case-card-title">The Challenge</h2>
                <p className="case-card-text">{project.challenge}</p>
              </section>
            )}
          </Reveal>
        )}

        {/* PROCESS — the flower-bulleted build timeline. Renders only when
            `project.process` has entries. Each row: a spinning-flower marker
            (deterministic per-index wind-spin, frozen under reduced motion via
            the shared .motif rule), a bold stage title, and an optional detail. */}
        {project.process && project.process.length > 0 && (
          <Reveal as="section" className="case-process">
            <h2 className="case-process-title">The process</h2>
            <ol className="process-list">
              {project.process.map((step, i) => (
                <li className="process-step" key={`${step.title}-${i}`}>
                  <span className="process-marker">
                    <Motif fill={PETALS[i % PETALS.length]} index={i} />
                  </span>
                  <div className="process-copy">
                    <p className="process-step-title">{step.title}</p>
                    {step.detail && (
                      <p className="process-detail">{step.detail}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        )}

        {/* SQUARES — two side-by-side square screenshots, the deliberate change
            of rhythm after the full-width hero. Renders only when
            `project.squares` (a 2-tuple of /public paths) is set; stacks to one
            column under the site's mobile breakpoint. Rounded, no caption. */}
        {project.squares && (
          <Reveal as="section" className="case-squares">
            {project.squares.map((src, i) => (
              <div className="case-square" key={`${src}-${i}`}>
                <Image
                  src={src}
                  alt={`${project.title} — image ${i + 1}`}
                  fill
                  sizes="(max-width: 880px) 100vw, 600px"
                  className="case-square-img"
                />
              </div>
            ))}
          </Reveal>
        )}

        {/* MID SHOT — a full-content-width rounded screenshot between the two
            square rows (same frame as the hero/wide shot, NOT edge-to-edge).
            Renders only when `project.midShot` is set. No caption. */}
        {project.midShot && (
          <Reveal className="case-hero case-wide">
            <Image
              src={project.midShot}
              alt={`${project.title} — screenshot`}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="case-hero-img"
            />
          </Reveal>
        )}

        {/* SQUARES (second row) — another pair of side-by-side squares after the
            full-bleed, still before the article. Renders only when
            `project.squares2` is set. Same treatment as the first row. */}
        {project.squares2 && (
          <Reveal as="section" className="case-squares">
            {project.squares2.map((src, i) => (
              <div className="case-square" key={`${src}-${i}`}>
                <Image
                  src={src}
                  alt={`${project.title} — image ${i + 3}`}
                  fill
                  sizes="(max-width: 880px) 100vw, 600px"
                  className="case-square-img"
                />
              </div>
            ))}
          </Reveal>
        )}

        {/* ARTICLE — the NYT-clean editorial reading beat: a centered serif
            column, a drop-cap on the first paragraph, and an optional large
            pull-quote dropped in after the first paragraph. Renders only when
            `article.paragraphs` has entries; the drop-cap comes from the CSS
            `::first-letter` on the first <p>. */}
        {project.article?.paragraphs?.length ? (
          <Reveal as="section" className="case-article">
            {project.article.paragraphs.map((para, i) => (
              <Fragment key={i}>
                <p>{para}</p>
                {i === 0 && project.article?.pullQuote && (
                  <blockquote className="case-pullquote">
                    {project.article.pullQuote}
                  </blockquote>
                )}
              </Fragment>
            ))}
          </Reveal>
        ) : null}

        {/* WIDE SHOT — a second full-content-width rounded screenshot, same
            frame treatment as the hero (shared .case-hero styling). Renders
            only when `project.wideShot` is set. No caption. */}
        {project.wideShot && (
          <Reveal className="case-hero case-wide">
            <Image
              src={project.wideShot}
              alt={`${project.title} — wide screenshot`}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="case-hero-img"
            />
          </Reveal>
        )}

        {/* BANNER — a customizable closing band: an optional background image
            and/or an optional overlaid line of text, both // CUSTOMIZE. A
            subtle scrim is added only when text sits over an image. Rounded to
            match the page (not full-bleed). Renders only when `banner` has an
            image or text. No caption. */}
        {project.banner && (project.banner.image || project.banner.text) && (
          <Reveal
            as="section"
            className={`case-banner${project.banner.image ? " has-image" : ""}${
              project.banner.text ? " has-text" : ""
            }`}
          >
            {project.banner.image && (
              <Image
                src={project.banner.image}
                alt={`${project.title} — banner`}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="case-banner-img"
              />
            )}
            {project.banner.text && (
              <p className="case-banner-text">{project.banner.text}</p>
            )}
          </Reveal>
        )}

        {/* NEXT PROJECT — the quiet foot link handing the visitor to the next
            case study, derived from `webProjects` order (wraps last → first).
            No config field. With ≥1 project it always resolves a target. */}
        {next && (
          <Reveal as="nav" className="case-next" aria-label="Project navigation">
            <Link
              href={`/web-projects/${next.slug}`}
              prefetch={false}
              className="case-next-link"
            >
              <span className="case-next-label">Next project</span>
              <span className="case-next-title">{next.title} →</span>
            </Link>
          </Reveal>
        )}
      </div>

      </main>

      <SiteFooter />
    </>
  );
}
