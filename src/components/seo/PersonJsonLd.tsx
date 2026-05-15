import { profile } from "@/content/profile";
import {
  githubUrl,
  knowsAbout,
  linkedInUrl,
  siteUrl,
} from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export function PersonJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Rafael Prado",
        alternateName: "Rafael Prado Dev",
        jobTitle: "Desenvolvedor Front-End",
        url: siteUrl,
        email: profile.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Uberlândia",
          addressRegion: "MG",
          addressCountry: "BR",
        },
        knowsAbout,
        sameAs: [linkedInUrl, githubUrl, siteUrl],
      }}
    />
  );
}
