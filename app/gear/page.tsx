import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { gear, gearSections } from "@/data/gear";
import { sections } from "@/site.config";

export const metadata: Metadata = {
  title: "Gear",
  alternates: { canonical: "/gear" },
  description:
    "The camera kit behind the photography — Canon EOS R5, DJI Air 2s, and the lenses, bags and accessories Charlie Ramus travels with.",
};

export default function GearPage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="inner">

      <div className="wrap">
        <Reveal as="header" className="inner-head">
          <p className="writing-kicker">{sections.pages.gear.kicker}</p>
          {/* CUSTOMIZE: kicker + heading + lede in site.config.ts (sections.pages.gear) */}
          <h1>{sections.pages.gear.heading}</h1>
          <p className="inner-lede">{sections.pages.gear.lede}</p>
        </Reveal>

        <div className="gear-sections">
          {gearSections.map((section) => (
            <Reveal className="gear-section" key={section.key}>
              <h2>{section.label}</h2>
              <ul className="gear-list">
                {gear[section.key].map((item) => (
                  <li className="gear-item" key={item.name}>
                    <span className="gear-name">
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer">
                          {item.name}
                        </a>
                      ) : (
                        item.name
                      )}
                    </span>
                    {item.note && <span className="gear-note">{item.note}</span>}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>

      </main>

      <SiteFooter />
    </>
  );
}
