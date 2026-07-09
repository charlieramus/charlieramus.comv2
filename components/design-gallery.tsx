"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/reveal";
import Lightbox, { type LightboxItem } from "@/components/lightbox";
import type { DesignProject } from "@/data/projects-design";

/**
 * The /design project galleries + a shared fullscreen lightbox (V5 Stage 2 —
 * replaces the previous "open the raw image in a new tab" behavior so design
 * slides get the same focus-trapped lightbox as the photography grid).
 *
 * Slides across all projects share one flat `items` list so ← / → step through
 * the whole board; each slide button carries its global index.
 */
export default function DesignGallery({
  projects,
}: {
  projects: DesignProject[];
}) {
  const [idx, setIdx] = useState<number | null>(null);

  // Flatten every project's slides into one indexed list for the lightbox.
  let counter = 0;
  const grouped = projects.map((p) => ({
    project: p,
    portrait: (p.ratio ?? 1) < 1,
    slides: (p.images ?? []).map((src, i) => ({
      src,
      alt: `${p.title} — slide ${i + 1}`,
      ratio: p.ratio ?? 1.6,
      index: counter++,
    })),
  }));
  const items: LightboxItem[] = grouped.flatMap((g) =>
    g.slides.map(({ src, alt, ratio }) => ({ src, alt, ratio })),
  );

  return (
    <>
      {grouped.map(({ project: p, portrait, slides }) => (
        <Reveal className="design-project" key={p.title}>
          <div className="design-head">
            <h2>{p.title}</h2>
            <p className="proj-meta">{p.date}</p>
            <p className="proj-desc">{p.description}</p>
          </div>

          {slides.length > 0 && (
            <div
              className="design-grid"
              data-shape={portrait ? "portrait" : "landscape"}
            >
              {slides.map((s) => (
                <button
                  key={s.src}
                  type="button"
                  className="design-slide"
                  style={{ aspectRatio: String(p.ratio ?? 1.6) }}
                  onClick={() => setIdx(s.index)}
                  aria-label={`${s.alt} (open full size)`}
                >
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    sizes={
                      portrait
                        ? "(max-width: 640px) 50vw, 260px"
                        : "(max-width: 640px) 100vw, 560px"
                    }
                    className="design-img"
                  />
                </button>
              ))}
            </div>
          )}
        </Reveal>
      ))}

      <Lightbox
        items={items}
        index={idx}
        onClose={() => setIdx(null)}
        onIndex={setIdx}
      />
    </>
  );
}
