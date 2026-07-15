import type { Metadata } from "next";
import { SeoRoutePage } from "@/components/seo/SeoRoutePage";
import { education } from "@/content/education";
import { experiences } from "@/content/experience";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Experiência Profissional",
  description:
    "Experiência profissional e formação de Rafael Prado como Desenvolvedor Front-End com React.js, Next.js, TypeScript, JavaScript, UI/UX e performance web.",
  alternates: {
    canonical: `${siteUrl}/experiencia`,
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
    title: "Experiência Profissional | Rafael Prado",
    url: `${siteUrl}/experiencia`,
  },
};

export default function ExperienciaPage() {
  return (
    <SeoRoutePage
      initialApp="timeline"
      kicker="/experiencia.log"
      title="Experiência Profissional"
      description="Histórico profissional, formação e tecnologias aplicadas em interfaces web, mobile e experiências digitais."
    >
      {experiences.map((experience) => (
        <article key={`${experience.company}-${experience.period}`}>
          <h2>{experience.role}</h2>
          <p>
            <strong>{experience.company}</strong> · {experience.period}
          </p>
          <p>{experience.description}</p>
          <h3>Destaques</h3>
          <ul>
            {experience.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <h3>Tecnologias aplicadas</h3>
          <p>{experience.technologies.join(", ")}</p>
        </article>
      ))}

      <section
        className="seo-route-page__panel"
        aria-labelledby="formacao-title"
      >
        <h2 id="formacao-title">Formação</h2>
        {education.map((item) => (
          <article key={`${item.title}-${item.period}`}>
            <h3>{item.title}</h3>
            <p>
              {item.institution} · {item.location} · {item.period}
            </p>
          </article>
        ))}
      </section>
    </SeoRoutePage>
  );
}
