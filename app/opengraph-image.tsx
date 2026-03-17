import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background:
            "radial-gradient(circle at top left, rgba(35,192,255,0.28), transparent 32%), radial-gradient(circle at top right, rgba(255,186,92,0.18), transparent 24%), linear-gradient(180deg, #050c17 0%, #091325 100%)",
          color: "white"
        }}
      >
        <div
          style={{
            display: "flex",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.15)",
            padding: "12px 20px",
            fontSize: 24,
            alignSelf: "flex-start"
          }}
        >
          Lead.ai
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
            Find your next best clients with AI
          </div>
          <div style={{ fontSize: 28, color: "rgba(230,236,247,0.78)" }}>
            Public-source B2B lead discovery, scoring, and export workflows for agencies and sales teams.
          </div>
        </div>
      </div>
    ),
    size
  );
}
