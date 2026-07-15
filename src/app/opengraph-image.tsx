import { ImageResponse } from "next/og";

export const alt =
  "Rafael Prado, Desenvolvedor Front-End React.js, Next.js, TypeScript e Tailwind CSS.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "radial-gradient(circle at 84% 18%, rgba(97, 242, 194, 0.26), transparent 260px), linear-gradient(135deg, #05010f 0%, #170927 48%, #05010f 100%)",
        color: "#fffbd1",
        padding: "72px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          color: "#61f2c2",
          fontSize: "28px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        <span
          style={{
            width: "22px",
            height: "22px",
            background: "#61f2c2",
            boxShadow: "8px 8px 0 #7c3aed",
          }}
        />
        rafaelprado.dev
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
        <h1
          style={{
            margin: 0,
            color: "#ffffff",
            fontSize: "92px",
            lineHeight: 0.94,
            letterSpacing: "-0.03em",
            textShadow: "0 0 28px rgba(255, 255, 255, 0.24)",
          }}
        >
          Rafael Prado
        </h1>
        <p
          style={{
            margin: 0,
            maxWidth: "860px",
            color: "#fffbd1",
            fontSize: "42px",
            lineHeight: 1.12,
          }}
        >
          Desenvolvedor Front-End
        </p>
        <p
          style={{
            margin: 0,
            color: "#61f2c2",
            fontSize: "30px",
            lineHeight: 1.2,
          }}
        >
          React.js • Next.js • TypeScript • Tailwind CSS
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "2px solid rgba(255, 255, 255, 0.22)",
          paddingTop: "24px",
          color: "#d9ccff",
          fontSize: "25px",
        }}
      >
        <span>Interfaces modernas, acessíveis e performáticas</span>
        <span>Uberlândia, MG</span>
      </div>
    </div>,
    size,
  );
}
