import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const routes = [
  { path: "/", priority: 1 },
  { path: "/projetos", priority: 0.85 },
  { path: "/experiencia", priority: 0.82 },
  { path: "/habilidades", priority: 0.82 },
  { path: "/contato", priority: 0.75 },
  { path: "/curriculo", priority: 0.62 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}
