import { ImageResponse } from "next/og";
import { flowerDataUri } from "@/lib/flower-svg";
import { snapshot, tagline } from "@/data/about";

// Default site share card (1200×630) — used for every route that doesn't set its
// own openGraph.images (essays use their headerImage, /photography a featured
// photo). Built from the brand daisies + wordmark. CUSTOMIZE: drop a real
// opengraph-image.png here to replace it.
export const alt = `${snapshot.name} — ${snapshot.roles.join(", ")}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img width={96} height={96} src={flowerDataUri("#F32317", "#FFFFFF", 8)} alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img width={96} height={96} src={flowerDataUri("#0015D4", "#FFCB41", 7)} alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img width={96} height={96} src={flowerDataUri("#84DEF9", "#0015D4", 6)} alt="" />
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
