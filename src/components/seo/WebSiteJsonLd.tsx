import { siteDescription, siteLanguage, siteName, siteUrl } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteName,
        url: siteUrl,
        inLanguage: siteLanguage,
        description: siteDescription,
        publisher: {
          "@type": "Person",
          "@id": `${siteUrl}/#person`,
          name: "Rafael Prado",
        },
      }}
    />
  );
}
