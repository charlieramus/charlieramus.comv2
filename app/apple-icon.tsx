import { ImageResponse } from "next/og";
import { flowerDataUri } from "@/lib/flower-svg";

// Generated Apple touch icon: the brand daisy on paper. CUSTOMIZE: drop a real
// apple-icon.png to replace this.
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
        <img width={150} height={150} src={flowerDataUri("#F32317", "#FFCB41", 8)} alt="" />
      </div>
    ),
    { ...size },
  );
}
