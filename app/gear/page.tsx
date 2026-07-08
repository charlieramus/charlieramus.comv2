import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/reveal";
import { gear, gearSections } from "@/data/gear";
import { snapshot } from "@/data/about";

export const metadata: Metadata = {
  title: `Gear — ${snapshot.name}`,
  description:
    "The camera kit behind the photography — Canon EOS R5, DJI Air 2s, and the lenses, bags and accessories Charlie Ramus travels with.",
};

export default function GearPage() {
  return (
    <main className="inner">
      {/* Minimal back-to-home until Stage 4 wires the shared inner-page nav. */}
      <nav className="inner-nav">
        <Link href="/">← charlie ramus</Link>
      </nav>

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
  );
}
