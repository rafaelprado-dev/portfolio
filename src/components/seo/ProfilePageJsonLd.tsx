import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import {
  githubUrl,
  knowsAbout,
  linkedInUrl,
  siteDescription,
  siteLanguage,
  siteName,
  siteUrl,
} from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export function ProfilePageJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profile`,
        name: siteName,
        url: siteUrl,
        inLanguage: siteLanguage,
        description: siteDescription,
        mainEntity: {
          "@type": "Person",
          "@id": `${siteUrl}/#person`,
          name: profile.name,
          alternateName: ["Rafael Prado Dev"],
          jobTitle: profile.role,
          url: siteUrl,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Uberlândia",
            addressRegion: "MG",
            addressCountry: "BR",
          },
          knowsAbout,
          sameAs: [linkedInUrl, githubUrl],
        },
        hasPart: projects.map((project) => ({
          "@type": "CreativeWork",
          name: project.name,
          description: project.description,
          keywords: project.stack.join(", "),
        })),
      }}
    />
  );
}
