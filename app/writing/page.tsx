import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/reveal";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import SpiralText from "@/components/spiral-text";
import { writing } from "@/data/writing";
import { sections, writingSpirals } from "@/site.config";

export const metadata: Metadata = {
  title: "Writing",
  alternates: { canonical: "/writing" },
  description: sections.pages.writing.metaDescription,
};

// Newest first (order 1 = newest). Sorted here so the manifest can stay authored
// in any order without changing the page.
const essays = [...writing].sort((a, b) => a.order - b.order);

export default function WritingIndex() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="writing">

      {/* Decorative spiral quotes in the outer margins — desktop-only, removed
          under prefers-reduced-motion (see .writing-spirals in globals.css).
          CUSTOMIZE the quotes via `writingSpirals` in site.config.ts. */}
      {writingSpirals.length > 0 && (
        <div className="writing-spirals" aria-hidden="true">
          {writingSpirals.map((s, i) => (
            <div
              key={i}
              className={`writing-spiral spiral-${s.side} place-${s.place ?? "gutter"}`}
              style={{ top: s.top ?? `${6 + i * 18}%` }}
            >
              <SpiralText text={s.text} size={s.size} />
            </div>
          ))}
        </div>
      )}

      <div className="wrap writing-wrap">
        <Reveal as="header" className="writing-head">
          <p className="writing-kicker">{sections.pages.writing.kicker}</p>
          {/* CUSTOMIZE: kicker + heading + lede in site.config.ts (sections.pages.writing) */}
          <h1>{sections.pages.writing.heading}</h1>
          <p className="writing-lede">{sections.pages.writing.lede}</p>
        </Reveal>

        <ol className="writing-list">
          {essays.map((essay) => (
            <li key={essay.slug}>
              <Reveal>
                <Link
                  href={`/writing/${essay.slug}`}
                  prefetch={false}
                  className="writing-item"
                >
                  <span className="writing-item-title">{essay.title}</span>
                  <span className="writing-item-date">{essay.date}</span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      </main>

      <SiteFooter />
    </>
  );
}
