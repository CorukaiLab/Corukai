import { ImageResponse } from "next/og";

export const alt = "CoruKai · Leer debería sentirse bien";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "stretch",
        color: "#F6F0E8",
        background: "#17182B",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ display: "flex", width: 86, background: "#F56B50" }} />
      <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "space-between", padding: "68px 76px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, fontSize: 34 }}>
          <div style={{ display: "flex", width: 58, height: 72, alignItems: "center", justifyContent: "center", border: "2px solid #F6F0E8", borderRadius: "50%" }}>C</div>
          <b>CoruKai</b>
        </div>
        <div style={{ display: "flex", maxWidth: 880, flexDirection: "column", gap: 20 }}>
          <span style={{ color: "#F1D56A", fontFamily: "Arial, sans-serif", fontSize: 22, fontWeight: 700, textTransform: "uppercase" }}>Una librería para elegir sin presión</span>
          <span style={{ fontSize: 78, lineHeight: 0.96 }}>Leer debería sentirse bien.</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {["#A7D8B0", "#F1D56A", "#F56B50", "#5B3C67"].map((color) => <span key={color} style={{ display: "flex", width: 54, height: 10, background: color }} />)}
        </div>
      </div>
    </div>,
    size,
  );
}
