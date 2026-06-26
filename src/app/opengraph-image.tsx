import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Strum — aprenda violão e baixo do jeito divertido";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#f3e8cc",
          fontFamily: "sans-serif",
        }}
      >
        {/* logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "#18542a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f3e8cc",
              fontSize: 44,
              fontWeight: 800,
            }}
          >
            S
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#18542a" }}>
            Strum
          </div>
        </div>

        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            color: "#18542a",
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          Aprenda a tocar, uma{" "}
          <span style={{ color: "#f96015" }}>nota</span> de cada vez
          <span style={{ color: "#ffc926" }}>.</span>
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            color: "#18542a",
            opacity: 0.7,
            maxWidth: 820,
          }}
        >
          Violão e baixo no estilo Duolingo — lições que te escutam tocar,
          afinador, metrônomo, músicas e muito mais.
        </div>

        {/* accent dots */}
        <div style={{ display: "flex", gap: 14, marginTop: 44 }}>
          {["#18542a", "#9abc05", "#ffc926", "#f96015", "#d52518"].map((c) => (
            <div
              key={c}
              style={{ width: 26, height: 26, borderRadius: 99, background: c }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
