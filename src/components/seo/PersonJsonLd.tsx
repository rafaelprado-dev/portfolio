import { profile } from "@/content/profile";
import { githubUrl, knowsAbout, linkedInUrl, siteUrl } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export function PersonJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: profile.name,
        alternateName: ["Rafael Prado Dev"],
        jobTitle: profile.role,
        url: siteUrl,
        image: profile.avatarUrl,
        description: profile.summary,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Uberlândia",
          addressRegion: "MG",
          addressCountry: "BR",
        },
        knowsAbout,
        sameAs: [linkedInUrl, githubUrl],
      }}
    />
  );
}
