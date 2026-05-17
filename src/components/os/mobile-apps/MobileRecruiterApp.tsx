import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { recruiterDiagnostic } from "@/content/recruiter";
import { skillGroups } from "@/content/skills";
import { socialLinks } from "@/content/socialLinks";

type MobileRecruiterAppProps = {
  onOpenContact: () => void;
  onOpenProjects: () => void;
};

export function MobileRecruiterApp({
  onOpenContact,
  onOpenProjects,
}: MobileRecruiterAppProps) {
  const resumeLink = socialLinks.find((link) => link.kind === "resume");
  const primarySkills = skillGroups.slice(0, 4).map((skill) => skill.title);

  return (
    <div className="mobile-app mobile-recruiter-app">
      <header className="mobile-app__hero">
        <p className="mobile-app__kicker">Diagnóstico pronto</p>
        <h2>Diagnóstico de perfil</h2>
        <strong>RESULTADO</strong>
        <p>{recruiterDiagnostic.result}</p>
      </header>

      <section
        className="mobile-app__section"
        aria-labelledby="recruiter-checks"
      >
        <h3 id="recruiter-checks">Verificação rápida</h3>
        <ul className="mobile-app__checks">
          {recruiterDiagnostic.checks.map((check) => (
            <li key={check}>
              <span aria-hidden="true">OK</span>
              {check}
            </li>
          ))}
        </ul>
      </section>

      <section
        className="mobile-app__section"
        aria-labelledby="recruiter-summary"
      >
        <h3 id="recruiter-summary">Resumo operacional</h3>
        <p>{profile.headline}</p>
        <div className="mobile-app__chips">
          {primarySkills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section
        className="mobile-app__section"
        aria-labelledby="recruiter-projects"
      >
        <h3 id="recruiter-projects">Projetos-chave</h3>
        <div className="mobile-app__chips">
          {projects.slice(0, 4).map((project) => (
            <span key={project.name}>{project.name}</span>
          ))}
        </div>
      </section>

      <div className="mobile-app__actions">
        <button type="button" onClick={onOpenProjects}>
          projetos
        </button>
        {resumeLink ? (
          <a href={resumeLink.href} rel="noreferrer noopener" target="_blank">
            Currículo
          </a>
        ) : null}
        <button type="button" onClick={onOpenContact}>
          Contato
        </button>
      </div>
    </div>
  );
}
