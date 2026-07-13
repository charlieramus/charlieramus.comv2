import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PhotographyGallery from "@/components/photography-gallery";
import VerticalMarquee from "@/components/vertical-marquee";
import { photos } from "@/data/photos";
import { sections } from "@/site.config";

// Share card = a featured photo (falls back to the site default OG otherwise).
const ogPhoto = photos.find((p) => p.featured) ?? photos[0];

export const metadata: Metadata = {
  title: "Photography",
  description:
    "Travel, landscape and wildlife photography by Charlie Ramus — Iceland, the Colorado Rockies, the British Virgin Islands and more. Shot on a Canon EOS R5.",
  alternates: { canonical: "/photography" },
  openGraph: ogPhoto
    ? { images: [{ url: ogPhoto.src, alt: ogPhoto.alt }] }
    : undefined,
};

export default function PhotographyPage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="gallery-page">

      {/* Decorative vertical marquee in the left gutter — desktop-only, frozen
          under prefers-reduced-motion (see .photo-marquee in globals.css).
          CUSTOMIZE the segments via `marquees` in site.config.ts. */}
      <VerticalMarquee />

      <div className="wrap">
        <Reveal as="header" className="gallery-head">
          <p className="writing-kicker">{sections.pages.photography.kicker}</p>
          {/* CUSTOMIZE: kicker + heading + lede in site.config.ts (sections.pages.photography); {count} = photos.length */}
          <h1>{sections.pages.photography.heading}</h1>
          <p className="gallery-lede">
            {sections.pages.photography.lede.replace("{count}", String(photos.length))}
          </p>
        </Reveal>

        <PhotographyGallery />
      </div>

      </main>

      <SiteFooter />
    </>
  );
}
