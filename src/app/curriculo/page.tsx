import type { Metadata } from "next";
import { SeoRoutePage } from "@/components/seo/SeoRoutePage";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Currículo",
  description:
    "Currículo de Rafael Prado, Desenvolvedor Front-End especializado em React.js, Next.js, TypeScript, Tailwind CSS, Firebase, acessibilidade e performance.",
  alternates: {
    canonical: `${siteUrl}/curriculo`,
  },
  openGraph: {
    title: "Currículo | Rafael Prado",
    url: `${siteUrl}/curriculo`,
  },
};

export default function CurriculoPage() {
  return (
    <SeoRoutePage
      kicker="/curriculo.pdf"
      title="Currículo"
      description="Versão pública do currículo profissional de Rafael Prado para recrutadores, ATS e avaliadores técnicos."
    >
      <section className="seo-route-page__panel">
        <h2>Rafael Prado — Desenvolvedor Front-End</h2>
        <p>
          Especializado em React.js, Next.js, TypeScript, Tailwind CSS,
          Firebase, APIs REST, acessibilidade, performance front-end, UI/UX,
          componentização e design systems.
        </p>
        <p>
          Localização: Uberlândia, MG, Brasil. E-mail:{" "}
          <a href={`mailto:${profile.email}`}>{profile.email}</a>.
        </p>
        <a href={profile.resumeUrl}>Abrir currículo em PDF</a>
      </section>
    </SeoRoutePage>
  );
}
