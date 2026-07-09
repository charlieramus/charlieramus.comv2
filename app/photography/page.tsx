import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PhotographyGallery from "@/components/photography-gallery";
import { photos } from "@/data/photos";
import { snapshot } from "@/data/about";

export const metadata: Metadata = {
  title: `Photography — ${snapshot.name}`,
  description:
    "Travel, landscape and wildlife photography by Charlie Ramus — Iceland, the Colorado Rockies, the British Virgin Islands and more. Shot on a Canon EOS R5.",
};

export default function PhotographyPage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="gallery-page">

      <div className="wrap">
        <Reveal as="header" className="gallery-head">
          <p className="writing-kicker">Photography</p>
          {/* CUSTOMIZE: gallery heading + lede */}
          <h1>Through the lens</h1>
          <p className="gallery-lede">
            {`${photos.length} frames from the road — Iceland, the Colorado Rockies, the British Virgin Islands and wherever the light's good. Tap any photo to open it.`}
          </p>
        </Reveal>

        <PhotographyGallery />
      </div>

      </main>

      <SiteFooter />
    </>
  );
}
