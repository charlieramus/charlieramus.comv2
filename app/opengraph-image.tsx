import { ImageResponse } from "next/og";
import { activeMotifs, motifDataUri, type MotifColors } from "@/data/motifs";
import { snapshot, tagline } from "@/data/about";

// Default site share card (1200×630) — used for every route that doesn't set its
// own openGraph.images (essays use their headerImage, /photography a featured
// photo). Built from the first three active brand motifs + wordmark; swapping
// activeMotifs (data/motifs.ts) re-skins it. CUSTOMIZE: drop a real
// opengraph-image.png here to replace it.
export const alt = `${snapshot.name} — ${snapshot.roles.join(", ")}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The three header marks: first three active motifs, each with a brand color pair.
const OG_MARKS: MotifColors[] = [
  { fill: "#F32317", accent: "#FFFFFF" },
  { fill: "#0015D4", accent: "#FFCB41" },
  { fill: "#84DEF9", accent: "#0015D4" },
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f3ee",
          color: "#14140f",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", gap: 22 }}>
          {OG_MARKS.map((c, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              width={96}
              height={96}
              src={motifDataUri(activeMotifs[i % activeMotifs.length], c)}
              alt=""
            />
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 700, letterSpacing: -2 }}>
            {snapshot.name}
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#55554d", marginTop: 14 }}>
            {snapshot.roles.join("   ·   ")}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, lineHeight: 1.4, color: "#55554d", maxWidth: 940 }}>
          {tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
