import { ImageResponse } from "next/og";

import { businessInfo } from "@/lib/site-data";

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
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "linear-gradient(135deg, #07142f 0%, #0B1F4B 55%, #152b62 100%)",
          color: "#F8F6F1",
          fontFamily: "sans-serif",
          padding: "64px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "auto -120px -120px auto",
            width: 420,
            height: 420,
            borderRadius: "999px",
            background: "rgba(212, 175, 55, 0.18)",
            filter: "blur(6px)"
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "40px auto auto 48px",
            border: "1px solid rgba(212, 175, 55, 0.35)",
            borderRadius: 999,
            padding: "10px 18px",
            fontSize: 24,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#f8dd89"
          }}
        >
          FIG
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              marginTop: 72
            }}
          >
            <div
              style={{
                fontSize: 74,
                fontWeight: 700,
                lineHeight: 1.02,
                maxWidth: 850
              }}
            >
              Financial Investment Group
            </div>
            <div
              style={{
                fontSize: 32,
                lineHeight: 1.35,
                maxWidth: 920,
                color: "#e5e7eb"
              }}
            >
              Structured investment plans designed for regular income and
              long-term financial growth.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  fontSize: 22,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#f8dd89"
                }}
              >
                Burhar | Shahdol | Madhya Pradesh
              </div>
              <div style={{ fontSize: 28, color: "#e5e7eb" }}>
                {`Udyam Registration: ${businessInfo.registrationNumber}`}
              </div>
            </div>
            <div style={{ fontSize: 26, color: "#e5e7eb" }}>
              MSME Registered Enterprise
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
