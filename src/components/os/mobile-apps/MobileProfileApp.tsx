import { profile, profileSpecialties } from "@/content/profile";
import { skillGroups } from "@/content/skills";

type MobileProfileAppProps = {
  onOpenContact: () => void;
  onOpenProjects: () => void;
};

export function MobileProfileApp({
  onOpenContact,
  onOpenProjects,
}: MobileProfileAppProps) {
  const primarySkillGroups = skillGroups.slice(0, 4);

  return (
    <section
      className="mobile-app mobile-profile-app"
      aria-labelledby="mobile-profile-title"
    >
      <header className="mobile-app__hero">
        <p className="mobile-app__kicker">Perfil carregado</p>
        <h1 id="mobile-profile-title">{profile.name}</h1>
        <p>
          <strong>{profile.role}</strong>
        </p>
        <p>{profile.headline}</p>
      </header>

      <section
        className="mobile-app__section"
        aria-labelledby="profile-actions"
      >
        <h3 id="profile-actions">Ações rápidas</h3>
        <div className="mobile-app__actions">
          <button type="button" onClick={onOpenProjects}>
            Projetos
          </button>
          <button type="button" onClick={onOpenContact}>
            Contato
          </button>
        </div>
      </section>

      <section
        className="mobile-app__section"
        aria-labelledby="profile-specialties"
      >
        <h3 id="profile-specialties">Especialidades</h3>
        <div className="mobile-app__chips">
          {profileSpecialties.map((specialty) => (
            <span key={specialty}>{specialty}</span>
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
    </section>
  );
}
