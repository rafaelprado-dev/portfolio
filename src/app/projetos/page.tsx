import type { Metadata } from "next";
import { SeoRoutePage } from "@/components/seo/SeoRoutePage";
import { projects } from "@/content/projects";
import { siteDescription, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Projetos Front-End",
  description:
    "Projetos de Rafael Prado em front-end, React.js, Next.js, TypeScript, Firebase, UI/UX, acessibilidade e aplicações web modernas.",
  alternates: {
    canonical: `${siteUrl}/projetos`,
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
    title: "Projetos Front-End | Rafael Prado",
    description: siteDescription,
    url: `${siteUrl}/projetos`,
  },
};

export default function ProjetosPage() {
  return (
    <SeoRoutePage
      initialApp="projects"
      kicker="/projetos"
      title="Projetos Front-End"
      description="Cases autorais e profissionais com foco em produto, arquitetura, interface, performance e experiência de uso."
    >
      {projects.map((project) => (
        <article key={project.name}>
          <h2>{project.name}</h2>
          <p>
            <strong>{project.type}</strong> · {project.status}
          </p>
          <p>{project.description}</p>
          <h3>Tecnologias</h3>
          <p>{project.stack.join(", ")}</p>
          <h3>Destaques</h3>
          <ul>
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </article>
      ))}
    </SeoRoutePage>
  );
}
