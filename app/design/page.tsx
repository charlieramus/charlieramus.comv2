import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import DesignGallery from "@/components/design-gallery";
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
      <SiteHeader />

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

        <DesignGallery projects={designProjects} />
      </div>

      <SiteFooter />
    </main>
  );
}
