import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { writing } from "@/data/writing";
import { snapshot } from "@/data/about";

// Prerender exactly the essays in the manifest; anything else 404s.
export function generateStaticParams() {
  return writing.map((entry) => ({ slug: entry.slug }));
}
export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

// Metadata comes from the MDX frontmatter (single source of truth), falling back
// to the manifest for the title so the two never drift silently.
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { frontmatter } = await import(`@/content/writing/${slug}.mdx`);
  const title = frontmatter.title || writing.find((w) => w.slug === slug)?.title;
  return {
    title: `${title} — ${snapshot.name}`,
    description: `${frontmatter.author} · ${frontmatter.date}`,
  };
}

export default async function WritingArticle({ params }: Params) {
  const { slug } = await params;
  // Dynamic import with a static prefix/suffix so Turbopack can bundle every
  // matching .mdx at build time (the documented @next/mdx dynamic-route pattern).
  const { default: Post, frontmatter } = await import(
    `@/content/writing/${slug}.mdx`
  );

  return (
    <main className="writing">
      <SiteHeader />

      <article className="wrap writing-wrap">
        <header className="writing-article-head">
          <h1>{frontmatter.title}</h1>
          <p className="writing-byline">
            {frontmatter.author}
            {frontmatter.date ? ` · ${frontmatter.date}` : ""}
          </p>

          {/* headerImage is "" for every essay until Stage 4; render nothing
              then, a real next/image once a path is set. Dimensions are unknown
              in the frontmatter, so it fills a 16/9 frame. */}
          {frontmatter.headerImage ? (
            <div className="writing-hero">
              <Image
                src={frontmatter.headerImage}
                alt={frontmatter.title}
                fill
                sizes="(max-width: 760px) 100vw, 760px"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          ) : null}

          {/* External-link button only when a URL is set (all "" for now). */}
          {frontmatter.externalLink ? (
            <a
              className="btn writing-external"
              href={frontmatter.externalLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {frontmatter.externalLinkLabel || "Read the original ↗"}
            </a>
          ) : null}
        </header>

        <div className="writing-prose">
          <Post />
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
