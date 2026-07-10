import { ImageResponse } from "next/og";
import { flowerDataUri } from "@/lib/flower-svg";

// Generated favicon: the brand daisy on paper. Overrides favicon.ico in modern
// browsers. CUSTOMIZE: drop a real icon.png / favicon.ico to replace this.
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
        <img width={30} height={30} src={flowerDataUri("#F32317", "#FFCB41", 7)} alt="" />
      </div>
    ),
    { ...size },
  );
}
