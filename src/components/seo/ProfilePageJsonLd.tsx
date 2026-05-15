import { siteDescription, siteLanguage, siteName, siteUrl } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export function ProfilePageJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        name: siteName,
        url: siteUrl,
        inLanguage: siteLanguage,
        description: siteDescription,
        mainEntity: {
          "@type": "Person",
          name: "Rafael Prado",
          jobTitle: "Desenvolvedor Front-End",
          url: siteUrl,
        },
      }}
    />
  );
}
