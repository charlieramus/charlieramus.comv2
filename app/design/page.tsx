import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import DesignGallery from "@/components/design-gallery";
import { designProjects } from "@/data/projects-design";
import { sections } from "@/site.config";

export const metadata: Metadata = {
  title: "Design",
  alternates: { canonical: "/design" },
  description:
    "Brand, marketing and editorial design by Charlie Ramus — a Notion brand pitch, a Spotify IMC campaign, and a photography presentation UI. Produced in Figma.",
};

export default function DesignPage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="inner">

      <div className="wrap">
        <Reveal as="header" className="inner-head">
          <p className="writing-kicker">{sections.pages.design.kicker}</p>
          {/* CUSTOMIZE: kicker + heading + lede in site.config.ts (sections.pages.design) */}
          <h1>{sections.pages.design.heading}</h1>
          <p className="inner-lede">{sections.pages.design.lede}</p>
        </Reveal>

        <DesignGallery projects={designProjects} />
      </div>

      </main>

      <SiteFooter />
    </>
  );
}
