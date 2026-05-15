import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rafael Prado Portfolio",
    short_name: "Rafael Prado",
    description:
      "Portfólio de Rafael Prado, Desenvolvedor Front-End especializado em React.js, Next.js, TypeScript, Tailwind CSS e acessibilidade.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#05010f",
    theme_color: "#05010f",
    lang: "pt-BR",
    categories: ["portfolio", "developer", "productivity"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
