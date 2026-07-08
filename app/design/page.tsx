import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/reveal";
import { designProjects } from "@/data/projects-design";
import { snapshot } from "@/data/about";

export const metadata: Metadata = {
  title: `Design — ${snapshot.name}`,
  description:
    "Brand, marketing and editorial design by Charlie Ramus — a Notion brand pitch, a Spotify IMC campaign, and a photography presentation UI. Produced in Figma.",
};

export default function DesignPage() {
  return (
    <main className="inner">
      {/* Minimal back-to-home until Stage 4 wires the shared inner-page nav. */}
      <nav className="inner-nav">
        <Link href="/">← charlie ramus</Link>
      </nav>

      <div className="wrap">
        <Reveal as="header" className="inner-head">
          <p className="writing-kicker">Design</p>
          {/* CUSTOMIZE: heading + lede */}
          <h1>Brand &amp; layout</h1>
          <p className="inner-lede">
            Pitches, campaigns and editorial UI — where the argument is carried
            as much by type and image as by words. Produced in Figma.
          </p>
        </Reveal>

        {designProjects.map((p) => {
          const portrait = (p.ratio ?? 1) < 1;
          return (
            <Reveal className="design-project" key={p.title}>
              <div className="design-head">
                <h2>{p.title}</h2>
                <p className="proj-meta">{p.date}</p>
                <p className="proj-desc">{p.description}</p>
              </div>

              {p.images && p.images.length > 0 && (
                <div
                  className="design-grid"
                  data-shape={portrait ? "portrait" : "landscape"}
                >
                  {p.images.map((src, idx) => (
                    <a
                      key={src}
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="design-slide"
                      style={{ aspectRatio: String(p.ratio ?? 1.6) }}
                      aria-label={`${p.title} — slide ${idx + 1} (open full size)`}
                    >
                      <Image
                        src={src}
                        alt={`${p.title} — slide ${idx + 1}`}
                        fill
                        sizes={
                          portrait
                            ? "(max-width: 640px) 50vw, 260px"
                            : "(max-width: 640px) 100vw, 560px"
                        }
                        className="design-img"
                      />
                    </a>
                  ))}
                </div>
              )}
            </Reveal>
          );
        })}
      </div>
    </main>
  );
}
