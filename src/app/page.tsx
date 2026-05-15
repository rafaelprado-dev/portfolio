import { RafaelOS } from "@/components/os/RafaelOS";
import { PersonJsonLd } from "@/components/seo/PersonJsonLd";
import { ProfilePageJsonLd } from "@/components/seo/ProfilePageJsonLd";
import { SeoContent } from "@/components/seo/SeoContent";
import { WebSiteJsonLd } from "@/components/seo/WebSiteJsonLd";

export default function Home() {
  return (
    <>
      <PersonJsonLd />
      <WebSiteJsonLd />
      <ProfilePageJsonLd />
      <SeoContent />
      <RafaelOS />
    </>
  );
}
