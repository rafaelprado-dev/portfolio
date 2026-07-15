import Link from "next/link";
import { education } from "@/content/education";
import { experiences } from "@/content/experience";
import { profile, profileSpecialties } from "@/content/profile";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { socialLinks } from "@/content/socialLinks";
import { professionalTitle, profileIntro } from "@/lib/seo";

const publicRouteLinks = [
  { href: "/projetos", label: "Ver projetos front-end de Rafael Prado" },
  {
    href: "/habilidades",
    label: "Ver habilidades em React, Next.js e TypeScript",
  },
  { href: "/experiencia", label: "Ver experiência profissional" },
  { href: "/contato", label: "Entrar em contato com Rafael Prado" },
];

export function SeoContent() {
  return (
    <section className="seo-content" aria-hidden="true" inert>
      <h1>{professionalTitle}</h1>
      <p>
        {profileIntro} Desenvolvedor em Uberlândia, MG, Brasil, com foco em
        aplicações web modernas, projetos front-end, APIs REST, UI/UX,
        componentização, design system, Git e GitHub.
      </p>

      <nav aria-label="Páginas públicas do portfólio">
        <ul>
          {publicRouteLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <section aria-labelledby="seo-sobre">
        <h2 id="seo-sobre">Sobre mim</h2>
        <p>{profile.summary}</p>
        <p>{profile.about}</p>
        <p>{profile.availability}</p>
        <ul>
          {profileSpecialties.map((specialty) => (
            <li key={specialty}>{specialty}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="seo-experiencia">
        <h2 id="seo-experiencia">Experiência Profissional</h2>
        {experiences.map((experience) => (
          <article key={`${experience.company}-${experience.period}`}>
            <h3>
              {experience.role} em {experience.company}
            </h3>
            <p>{experience.period}</p>
            <p>{experience.description}</p>
            <ul>
              {experience.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <p>Tecnologias: {experience.technologies.join(", ")}.</p>
          </article>
        ))}
      </section>

      <section aria-labelledby="seo-projetos">
        <h2 id="seo-projetos">Projetos</h2>
        {projects.map((project) => (
          <article key={project.name}>
            <h3>{project.name}</h3>
            <p>
              {project.type}. {project.description}
            </p>
            <ul aria-label={`Status de ${project.name}`}>
              {project.status.map((status) => (
                <li key={status}>{status}</li>
              ))}
            </ul>
            <p>Tecnologias: {project.stack.join(", ")}.</p>
            <ul>
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section aria-labelledby="seo-habilidades">
        <h2 id="seo-habilidades">Habilidades Técnicas</h2>
        {skillGroups.map((group) => (
          <article key={group.title}>
            <h3>{group.title}</h3>
            <p>
              {group.levelLabel}. {group.description}
            </p>
            <p>{group.note}</p>
            <p>{group.skills.map((skill) => skill.label).join(", ")}.</p>
          </article>
        ))}
      </section>

      <section aria-labelledby="seo-certificacoes">
        <h2 id="seo-certificacoes">Certificações e Formação</h2>
        {education.map((item) => (
          <article key={`${item.title}-${item.period}`}>
            <h3>{item.title}</h3>
            <p>
              {item.institution}, {item.location}. {item.period}.
            </p>
          </article>
        ))}
      </section>

      <section aria-labelledby="seo-contato">
        <h2 id="seo-contato">Contato</h2>
        <p>
          Rafael Prado, Desenvolvedor Front-End em {profile.location}, Brasil.
        </p>
        <ul>
          {socialLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
