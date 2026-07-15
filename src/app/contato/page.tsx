import type { Metadata } from "next";
import { SeoRoutePage } from "@/components/seo/SeoRoutePage";
import { socialLinks } from "@/content/socialLinks";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Canais profissionais de Rafael Prado, Desenvolvedor Front-End em Uberlândia, MG. GitHub e LinkedIn.",
  alternates: {
    canonical: `${siteUrl}/contato`,
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  openGraph: {
    title: "Contato | Rafael Prado",
    url: `${siteUrl}/contato`,
  },
};

export default function ContatoPage() {
  return (
    <SeoRoutePage
      initialApp="contact"
      kicker="/contato.terminal"
      title="Contato"
      description="Vamos conversar sobre interfaces modernas, produtos digitais, acessibilidade, performance e oportunidades front-end."
    >
      <section className="seo-route-page__panel">
        <h2>Canais profissionais</h2>
        <p>Rafael Prado, Desenvolvedor Front-End em Uberlândia, MG, Brasil.</p>
        <ul>
          {socialLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </SeoRoutePage>
  );
}
