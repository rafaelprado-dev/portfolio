import { education } from "@/content/education";
import { experiences } from "@/content/experience";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { socialLinks } from "@/content/socialLinks";
import { professionalTitle, profileIntro } from "@/lib/seo";

export function SeoContent() {
  return (
    <section className="seo-content" aria-label="Resumo profissional de Rafael Prado">
      <h1>{professionalTitle}</h1>
      <p>
        {profileIntro} Desenvolvedor em Uberlândia, MG, Brasil, com foco em
        aplicações web modernas, projetos front-end, APIs REST, UI/UX,
        componentização, design system, Git e GitHub.
      </p>

      <section aria-labelledby="seo-sobre">
        <h2 id="seo-sobre">Sobre mim</h2>
        <p>{profile.about}</p>
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
            <p>Tecnologias: {project.stack.join(", ")}.</p>
          </article>
        ))}
      </section>

      <section aria-labelledby="seo-habilidades">
        <h2 id="seo-habilidades">Habilidades Técnicas</h2>
        {skillGroups.map((group) => (
          <article key={group.title}>
            <h3>{group.title}</h3>
            <p>{group.description}</p>
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
          E-mail: <a href={`mailto:${profile.email}`}>{profile.email}</a>.
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
