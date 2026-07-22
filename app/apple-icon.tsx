import { ImageResponse } from "next/og";

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
          background: "#0c1929",
          borderRadius: 40,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              width: 72,
              height: 18,
              background: "#0a66c2",
              borderRadius: 5,
              marginBottom: -18,
            }}
          />
          <div
            style={{
              width: 18,
              height: 72,
              background: "#ffffff",
              borderRadius: 5,
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
