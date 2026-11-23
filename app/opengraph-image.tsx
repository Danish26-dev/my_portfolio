import { ImageResponse } from "next/og";

export const alt = "Md Danish Ali | Software Engineer, Agentic AI, Web3";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Rendered on demand: @vercel/og fails to prerender on Windows paths containing spaces.
export const dynamic = "force-dynamic";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          color: "#111827",
          background:
            "radial-gradient(circle at 84% 24%, rgba(21,70,217,0.28), transparent 46%), radial-gradient(circle at 96% 92%, rgba(249,179,24,0.5), transparent 40%), #EDECE6",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 8, color: "#1546D9", display: "flex" }}>
          SOFTWARE ENGINEER · AGENTIC AI · WEB3
        </div>
        <div style={{ fontSize: 120, fontWeight: 800, lineHeight: 1, marginTop: 28, display: "flex" }}>
          MD DANISH ALI
        </div>
        <div style={{ width: 120, height: 8, background: "#F9B318", marginTop: 28, display: "flex" }} />
        <div style={{ fontSize: 32, color: "#111827", marginTop: 28, maxWidth: 900, display: "flex" }}>
          I build systems where intelligent agents, decentralized infrastructure and software engineering meet.
        </div>
      </div>
    ),
    size
  );
}
