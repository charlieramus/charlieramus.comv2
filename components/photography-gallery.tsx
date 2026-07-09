"use client";

import { useState } from "react";
import Image from "next/image";
import { photos } from "@/data/photos";
import Lightbox from "@/components/lightbox";

/**
 * Masonry photo grid + fullscreen lightbox.
 *
 * Grid: CSS columns (2/3/4 by width), each tile sized by its intrinsic `ratio`
 * so nothing is cropped in layout; thumbnails carry a blur placeholder. The
 * lightbox (keyboard, focus-trap, scroll-lock, focus-return) is the shared
 * `<Lightbox>` primitive — `photos` already matches its `LightboxItem` shape.
 */
export default function PhotographyGallery() {
  const [idx, setIdx] = useState<number | null>(null);

  return (
    <>
      <div className="gallery-grid">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            className="gallery-item"
            style={{ aspectRatio: String(p.ratio) }}
            onClick={() => setIdx(i)}
            aria-label={`Open photo: ${p.alt}`}
          >
            <Image
              src={p.thumb}
              alt={p.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="gallery-img"
              priority={i < 4}
              {...(p.blurDataURL
                ? { placeholder: "blur" as const, blurDataURL: p.blurDataURL }
                : {})}
            />
          </button>
        ))}
      </div>

      <Lightbox
        items={photos}
        index={idx}
        onClose={() => setIdx(null)}
        onIndex={setIdx}
      />
    </>
  );
}
