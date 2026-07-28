import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const routes = [
  { path: "/", priority: 1 },
  { path: "/projetos", priority: 0.9 },
  { path: "/habilidades", priority: 0.8 },
  { path: "/experiencia", priority: 0.8 },
  { path: "/contato", priority: 0.7 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}
