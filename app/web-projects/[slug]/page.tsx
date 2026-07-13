import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/reveal";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { webProjects } from "@/data/projects-web";
import { webProjectBySlug } from "@/data/previews";
import { SITE_URL } from "@/data/site";

// Prerender exactly the projects in the manifest; anything else 404s. Same
// static-params pattern as /writing/[slug], so `output: export` stays fully
// static and unknown slugs never render.
export function generateStaticParams() {
  return webProjects.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

// Friendly label for the external link (mirrors the /web-projects list page).
function linkLabel(href: string): string {
  if (href.includes("github.com")) return "View on GitHub";
  return href.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = webProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/web-projects/${slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.description,
      images: project.image
        ? [{ url: project.image, alt: `${project.title} screenshot` }]
        : ["/opengraph-image"],
    },
  };
}

export default async function WebProjectDetail({ params }: Params) {
  const { slug } = await params;
  // dynamicParams = false guarantees this resolves for every prerendered slug.
  const project = webProjectBySlug(slug)!;

  // The long-form case-study sections, in order, only those actually authored.
  const body: { label: string; text: string }[] = [
    { label: "The problem", text: project.problem ?? "" },
    { label: "The approach", text: project.approach ?? "" },
    { label: "The outcome", text: project.outcome ?? "" },
  ].filter((s) => s.text);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    author: { "@type": "Person", name: "Charlie Ramus", url: SITE_URL },
    ...(project.image ? { image: `${SITE_URL}${project.image}` } : {}),
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
        <Reveal as="header" className="inner-head">
          <Link href="/web-projects" prefetch={false} className="case-back">
            ← All projects
          </Link>
          <h1>{project.title}</h1>
          <p className="proj-meta">{project.date}</p>
          <div className="proj-tags">
            {project.tags.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
          <p className="inner-lede">{project.description}</p>
          {project.href && (
            <a
              className="proj-link"
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkLabel(project.href)} ↗
            </a>
          )}
        </Reveal>

        {body.length > 0 && (
          <div className="case-body">
            {body.map((s) => (
              <Reveal className="case-section" key={s.label}>
                <h2>{s.label}</h2>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </div>
        )}

        {project.gallery && project.gallery.length > 0 && (
          <div className="case-gallery">
            {project.gallery.map((src, i) => (
              <Reveal className="case-shot" key={src}>
                <Image
                  src={src}
                  alt={`${project.title} — ${i + 1}`}
                  fill
                  sizes="(max-width: 880px) 100vw, 720px"
                  className="case-img"
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>

      </main>

      <SiteFooter />
    </>
  );
}
