import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { gear, gearSections } from "@/data/gear";
import { snapshot } from "@/data/about";

export const metadata: Metadata = {
  title: `Gear — ${snapshot.name}`,
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
          <p className="writing-kicker">Gear</p>
          {/* CUSTOMIZE: heading + lede */}
          <h1>What&apos;s in the bag</h1>
          <p className="inner-lede">
            The kit behind the photography — a Canon EOS R5 body, a DJI Air 2s in
            the air, and the glass and bags that travel with them.
          </p>
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
