"use client";

import { useId, useState } from "react";
import { aboutParagraphs } from "@/data/about";

// "Behind the pixels" bio with a short-by-default teaser + a real "read more"
// disclosure (V8 Stage 3). The split is data-driven: aboutParagraphs[0] is the
// teaser, the rest live behind the toggle. The hidden paragraphs stay in the DOM
// (rendered, export-friendly, crawlable) and are collapsed with CSS — they aren't
// fetched on expand. The toggle is a real <button> with aria-expanded /
// aria-controls; the collapsed region is aria-hidden so assistive tech tracks the
// visual state (the rest is plain text — no focusable elements to trap). Reveal
// animation + reduced-motion handling live in .bio-rest (globals.css).
const [teaser, ...rest] = aboutParagraphs;

export default function AboutBio() {
  const [expanded, setExpanded] = useState(false);
  const restId = useId();

  return (
    <div className="bio">
      <p>{teaser}</p>

      {rest.length > 0 && (
        <>
          <div
            id={restId}
            className={`bio-rest${expanded ? " is-open" : ""}`}
            aria-hidden={!expanded}
          >
            <div className="bio-rest-inner">
              {rest.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="bio-toggle"
            aria-expanded={expanded}
            aria-controls={restId}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Read less" : "Read more about me"}
            <span className="bio-toggle-caret" aria-hidden="true">
              {expanded ? "↑" : "↓"}
            </span>
          </button>
        </>
      )}
    </div>
  );
}
