"use client";

import { useState } from "react";
import Image from "next/image";
import { galleryPhotos, tripSections } from "@/data/trips";
import type { Photo } from "@/data/photos";
import { photographyView } from "@/site.config";
import Lightbox from "@/components/lightbox";
import Motif from "@/components/motif";

/**
 * Two-view photo gallery + fullscreen lightbox (V14).
 *
 *  • "All"     — the masonry of every non-hidden photo (`galleryPhotos`),
 *                unchanged from before: captions live in the lightbox.
 *  • "By trip" — every frame grouped into labeled trip sections
 *                (`tripSections`), each tile carrying a corner number badge
 *                (the photo `code`) and NO caption.
 *
 * A segmented toggle (site.config `photographyView.viewLabels`) switches views.
 * The lightbox operates over the ACTIVE view's flattened photo list in render
 * order, so clicking a tile opens the right index and ← / → step the whole
 * active view (same discipline as the /design gallery). Switching views resets
 * the open index. Grid + lightbox a11y/motion are the shared primitives.
 */

// Cycling petal colors for the trip-section flower markers (decorative).
const PETALS: { fill: string; accent: string }[] = [
  { fill: "red", accent: "#F4F3EE" },
  { fill: "blue", accent: "#84DEF9" },
  { fill: "yellow", accent: "#F32317" },
  { fill: "cyan", accent: "#0015D4" },
  { fill: "pink", accent: "#0015D4" },
];

// Flatten the trip sections once (module scope, deterministic) into the active
// list for the By-trip lightbox, and remember each section's start offset so a
// tile's click maps to its global index in that flat list.
const tripFlat: Photo[] = tripSections.flatMap((s) => s.photos);
const tripSectionsWithStart = (() => {
  let start = 0;
  return tripSections.map((section) => {
    const withStart = { section, start };
    start += section.photos.length;
    return withStart;
  });
})();

type View = "all" | "trip";

function Tile({
  photo,
  priority,
  badge,
  onOpen,
}: {
  photo: Photo;
  priority?: boolean;
  badge?: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className="gallery-item"
      style={{ aspectRatio: String(photo.ratio) }}
      onClick={onOpen}
      aria-label={`Open photo: ${photo.alt}`}
    >
      <Image
        src={photo.thumb}
        alt={photo.alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="gallery-img"
        priority={priority}
        {...(photo.blurDataURL
          ? { placeholder: "blur" as const, blurDataURL: photo.blurDataURL }
          : {})}
      />
      {badge && photo.code && (
        <span className="photo-badge" aria-hidden="true">
          {photo.code}
        </span>
      )}
    </button>
  );
}

export default function PhotographyGallery() {
  const [view, setView] = useState<View>("all");
  const [idx, setIdx] = useState<number | null>(null);

  // Switching views invalidates the open index (the lists differ).
  const switchTo = (v: View) => {
    setIdx(null);
    setView(v);
  };

  const labels = photographyView.viewLabels;
  // With no trip folders present the By-trip dataset is empty, so the whole
  // toggle is hidden and /photography is a normal single-view captioned gallery.
  const hasTrips = tripSections.length > 0;
  const activeView: View = hasTrips ? view : "all";
  const activeItems = activeView === "all" ? galleryPhotos : tripFlat;

  return (
    <>
      {hasTrips && (
        <div className="gallery-toggle" role="group" aria-label="Gallery view">
          <button
            type="button"
            className="gallery-toggle-btn"
            aria-pressed={activeView === "all"}
            onClick={() => switchTo("all")}
          >
            {labels.all}
          </button>
          <button
            type="button"
            className="gallery-toggle-btn"
            aria-pressed={activeView === "trip"}
            onClick={() => switchTo("trip")}
          >
            {labels.byTrip}
          </button>
        </div>
      )}

      {activeView === "all" ? (
        <div className="gallery-grid">
          {galleryPhotos.map((p, i) => (
            <Tile key={p.src} photo={p} priority={i < 4} onOpen={() => setIdx(i)} />
          ))}
        </div>
      ) : (
        <div className="trip-views">
          {tripSectionsWithStart.map(({ section, start }, si) => {
            const petal = PETALS[si % PETALS.length];
            const count = section.photos.length;
            return (
              <section className="trip-section" key={section.title}>
                <div className="trip-head">
                  <Motif
                    index={si}
                    fill={petal.fill}
                    accent={petal.accent}
                    className="trip-flower"
                  />
                  <h2>{section.title}</h2>
                  <span className="trip-count">
                    {count} {count === 1 ? "frame" : "frames"}
                  </span>
                </div>
                <div className="gallery-grid">
                  {section.photos.map((p, j) => (
                    <Tile
                      key={p.src}
                      photo={p}
                      badge
                      priority={start + j < 4}
                      onOpen={() => setIdx(start + j)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <Lightbox
        items={activeItems}
        index={idx}
        onClose={() => setIdx(null)}
        onIndex={setIdx}
        showCaptions={activeView === "all"}
      />
    </>
  );
}
