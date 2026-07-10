import { ImageResponse } from "next/og";
import { activeMotifs, motifDataUri } from "@/data/motifs";

// Generated favicon: the active brand motif (activeMotifs[0]) on paper. Overrides
// favicon.ico in modern browsers. Reordering activeMotifs (data/motifs.ts) swaps
// this. CUSTOMIZE: drop a real icon.png / favicon.ico to replace it entirely.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          width={30}
          height={30}
          src={motifDataUri(activeMotifs[0], { fill: "#F32317", accent: "#FFCB41" })}
          alt=""
        />
      </div>
    ),
    { ...size },
  );
}
