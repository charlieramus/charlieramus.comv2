"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { photos } from "@/data/photos";

/**
 * Masonry photo grid + fullscreen lightbox.
 *
 * Grid: CSS columns (2/3/4 by width), each tile sized by its intrinsic `ratio`
 * so nothing is cropped in layout; thumbnails carry a blur placeholder.
 *
 * Lightbox (a11y): `role="dialog"` + `aria-modal`, Escape to close, ← / → to
 * step, a Tab focus-trap inside the dialog, body-scroll lock while open, and
 * focus returned to the thumbnail that opened it. All transitions are disabled
 * under `prefers-reduced-motion` (see .lightbox / .gallery-item in globals.css).
 */
export default function PhotographyGallery() {
  const [idx, setIdx] = useState<number | null>(null);
  const open = idx !== null;

  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastIdxRef = useRef<number | null>(null);

  const close = useCallback(() => setIdx(null), []);
  const prev = useCallback(
    () => setIdx((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [],
  );
  const next = useCallback(
    () => setIdx((i) => (i === null ? i : (i + 1) % photos.length)),
    [],
  );

  // Keyboard: Escape / arrows / Tab focus-trap. Bound only while the box is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Tab") {
        const nodes = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, prev, next]);

  // Lock body scroll + move focus into the dialog while open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Return focus to the triggering thumbnail when the box closes.
  useEffect(() => {
    if (idx === null && lastIdxRef.current !== null) {
      triggerRefs.current[lastIdxRef.current]?.focus();
    }
    lastIdxRef.current = idx;
  }, [idx]);

  const photo = idx !== null ? photos[idx] : null;

  return (
    <>
      <div className="gallery-grid">
        {photos.map((p, i) => (
          <button
            key={p.src}
            ref={(el) => {
              triggerRefs.current[i] = el;
            }}
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

      {photo && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={photo.caption || photo.alt}
          onClick={close}
        >
          <div
            ref={dialogRef}
            className="lightbox-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              className="lightbox-btn lightbox-close"
              onClick={close}
              aria-label="Close"
            >
              ✕
            </button>

            <button
              type="button"
              className="lightbox-btn lightbox-prev"
              onClick={prev}
              aria-label="Previous photo"
            >
              ‹
            </button>

            <figure className="lightbox-figure">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={1600}
                height={Math.round(1600 / photo.ratio)}
                className="lightbox-img"
                sizes="92vw"
                priority
                {...(photo.blurDataURL
                  ? { placeholder: "blur" as const, blurDataURL: photo.blurDataURL }
                  : {})}
              />
              {(photo.caption || photo.code) && (
                <figcaption className="lightbox-cap">
                  {photo.code && <span className="lightbox-code">#{photo.code}</span>}
                  {photo.caption && <span>{photo.caption}</span>}
                </figcaption>
              )}
            </figure>

            <button
              type="button"
              className="lightbox-btn lightbox-next"
              onClick={next}
              aria-label="Next photo"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </>
  );
}
