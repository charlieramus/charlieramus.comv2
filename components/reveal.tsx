"use client";

import { useEffect, useRef } from "react";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type RevealOwnProps<T extends ElementType> = {
  /** Element/component to render. Lets `.reveal` land on the right node. */
  as?: T;
  className?: string;
  children?: ReactNode;
};

type RevealProps<T extends ElementType> = RevealOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof RevealOwnProps<T>>;

/**
 * Adds `.in` to its element when it scrolls into view (fade-up defined in
 * globals.css). Observes once, then disconnects. Reduced motion is handled in
 * CSS — the element is shown immediately, so it never depends on JS running.
 */
export default function Reveal<T extends ElementType = "div">({
  as,
  className = "",
  children,
  ...rest
}: RevealProps<T>) {
  const Tag: ElementType = as ?? "div";
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion: CSS already shows the node; skip the observer.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
