import type { Metadata } from "next";
import { SeoRoutePage } from "@/components/seo/SeoRoutePage";
import { skillGroups } from "@/content/skills";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Habilidades Técnicas",
  description:
    "Habilidades técnicas de Rafael Prado em React.js, Next.js, TypeScript, JavaScript, Tailwind CSS, Firebase, acessibilidade, WCAG/A11Y, performance e UI/UX.",
  alternates: {
    canonical: `${siteUrl}/habilidades`,
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
    title: "Habilidades Técnicas | Rafael Prado",
    url: `${siteUrl}/habilidades`,
  },
};

export default function HabilidadesPage() {
  return (
    <SeoRoutePage
      initialApp="skills"
      kicker="/skills.tree"
      title="Habilidades Técnicas"
      description="Stack, competências e áreas de evolução em front-end moderno, arquitetura de interface, design systems e integrações."
    >
      {skillGroups.map((group) => (
        <article key={group.title}>
          <h2>{group.title}</h2>
          <p>
            <strong>{group.levelLabel}</strong> · {group.description}
          </p>
          <p>{group.note}</p>
          <h3>Tecnologias e competências</h3>
          <p>{group.skills.map((skill) => skill.label).join(", ")}</p>
        </article>
      ))}
    </SeoRoutePage>
  );
}
