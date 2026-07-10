import { ImageResponse } from "next/og";
import { activeMotifs, motifDataUri } from "@/data/motifs";

// Generated Apple touch icon: the active brand motif (activeMotifs[0]) on paper.
// CUSTOMIZE: drop a real apple-icon.png to replace this.
// Render at build time so the PNG exports as a static file under `output: export`.
export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f3ee",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={150}
          height={150}
          src={motifDataUri(activeMotifs[0], { fill: "#F32317", accent: "#FFCB41" })}
          alt=""
        />
      </div>
    ),
    { ...size },
  );
}
