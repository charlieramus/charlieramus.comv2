import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/reveal";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { writing } from "@/data/writing";
import { snapshot } from "@/data/about";

export const metadata: Metadata = {
  title: `Writing — ${snapshot.name}`,
  description:
    "Essays and stories by Charlie Ramus — on optimization, machine learning, morality, and the occasional lighthouse.",
};

// Newest first (order 1 = newest). Sorted here so the manifest can stay authored
// in any order without changing the page.
const essays = [...writing].sort((a, b) => a.order - b.order);

export default function WritingIndex() {
  return (
    <main className="writing">
      <SiteHeader />

      <div className="wrap writing-wrap">
        <Reveal as="header" className="writing-head">
          <p className="writing-kicker">Writing</p>
          <h1>Essays &amp; stories</h1>
          <p className="writing-lede">
            Long-form pieces — arguments I&apos;ve talked myself into, and one I
            made up entirely.
          </p>
        </Reveal>

        <ol className="writing-list">
          {essays.map((essay) => (
            <li key={essay.slug}>
              <Reveal>
                <Link href={`/writing/${essay.slug}`} className="writing-item">
                  <span className="writing-item-title">{essay.title}</span>
                  <span className="writing-item-date">{essay.date}</span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      <SiteFooter />
    </main>
  );
}
