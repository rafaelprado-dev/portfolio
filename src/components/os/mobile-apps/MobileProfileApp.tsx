import { profile, profileStrengths } from "@/content/profile";
import { skillGroups } from "@/content/skills";
import { socialLinks } from "@/content/socialLinks";

type MobileProfileAppProps = {
  onOpenContact: () => void;
  onOpenProjects: () => void;
};

export function MobileProfileApp({
  onOpenContact,
  onOpenProjects,
}: MobileProfileAppProps) {
  const resumeLink = socialLinks.find((link) => link.kind === "resume");
  const primarySkillGroups = skillGroups.slice(0, 4);

  return (
    <div className="mobile-app mobile-profile-app">
      <header className="mobile-app__hero">
        <p className="mobile-app__kicker">PERFIL CARREGADO</p>
        <h2>{profile.name}</h2>
        <strong>{profile.role}</strong>
        <p>{profile.headline}</p>
      </header>

      <section className="mobile-app__section" aria-labelledby="profile-actions">
        <h3 id="profile-actions">Ações rápidas</h3>
        <div className="mobile-app__actions">
          <button type="button" onClick={onOpenProjects}>
            Projetos
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
      </section>

      <section className="mobile-app__section" aria-labelledby="profile-strengths">
        <h3 id="profile-strengths">Pontos fortes</h3>
        <div className="mobile-app__chips">
          {profileStrengths.map((strength) => (
            <span key={strength}>{strength}</span>
          ))}
        </div>
      </section>

      <section className="mobile-app__section" aria-labelledby="profile-stack">
        <h3 id="profile-stack">Stack principal</h3>
        <div className="mobile-app__chips">
          {primarySkillGroups.map((group) => (
            <span key={group.title}>{group.title}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
