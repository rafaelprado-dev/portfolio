import { profile, profileSpecialties } from "@/content/profile";

export function HomeApp() {
  return (
    <section
      className="app-screen home-app"
      aria-labelledby="home-profile-title"
    >
      <p className="app-kicker">PERFIL CARREGADO</p>
      <h1 className="home-app__name" id="home-profile-title">
        {profile.name}
      </h1>
      <p className="home-app__role">{profile.role}</p>
      <p>{profile.headline}</p>
      <section
        className="home-app__notice"
        aria-labelledby="home-specialties-title"
      >
        <h2 id="home-specialties-title">Especialidades</h2>
        <ul>
          {profileSpecialties.map((specialty) => (
            <li key={specialty}>{specialty}</li>
          ))}
        </ul>
      </section>
    </section>
  );
}
