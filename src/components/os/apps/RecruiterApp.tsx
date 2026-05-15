import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { socialLinks } from "@/content/socialLinks";

const diagnosticChecks = [
  "Front-end moderno",
  "Arquitetura limpa",
  "Design system e Atomic Design",
  "Acessibilidade / WCAG",
  "Projetos reais com produto",
];

const primarySkills = skillGroups.slice(0, 4).map((skill) => skill.title);

export function RecruiterApp() {
  const githubLink = socialLinks.find((link) => link.kind === "github");
  const resumeLink = socialLinks.find((link) => link.kind === "resume");

  return (
    <div className="app-screen recruiter-app">
      <p className="app-kicker">/recrutador.exe</p>
      <h2>Diagnóstico de Perfil</h2>

      <div className="recruiter-app__panel">
        <div className="recruiter-app__status">
          <strong>Resultado</strong>
          <span>Compatível com Front-End, Produto e UI Engineering</span>
        </div>

        <section aria-labelledby="recruiter-checks-title">
          <h3 id="recruiter-checks-title">Verificação rápida</h3>
          <ul className="recruiter-app__checks">
            {diagnosticChecks.map((check) => (
              <li key={check}>
                <span aria-hidden="true">OK</span>
                {check}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="recruiter-summary-title">
          <h3 id="recruiter-summary-title">Resumo operacional</h3>
          <p>{profile.headline}</p>
          <div className="recruiter-app__chips">
            {primarySkills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </section>

        <section aria-labelledby="recruiter-projects-title">
          <h3 id="recruiter-projects-title">Projetos-chave</h3>
          <div className="recruiter-app__projects">
            {projects.slice(0, 4).map((project) => (
              <span key={project.name}>{project.name}</span>
            ))}
          </div>
        </section>

        <div className="recruiter-app__actions">
          {githubLink ? (
            <a
              href={githubLink.href}
              rel="noreferrer noopener"
              target="_blank"
              title={githubLink.href}
            >
              GitHub
            </a>
          ) : null}
          {resumeLink ? (
            <a
              href={resumeLink.href}
              rel="noreferrer noopener"
              target="_blank"
              title={resumeLink.href}
            >
              Currículo
            </a>
          ) : null}
          <a href={`mailto:${profile.email}`} title={profile.email}>
            E-mail
          </a>
        </div>
      </div>
    </div>
  );
}
