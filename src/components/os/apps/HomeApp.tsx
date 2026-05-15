import { profile } from "@/content/profile";

export function HomeApp() {
  return (
    <div className="app-screen home-app">
      <p className="app-kicker">PERFIL CARREGADO</p>
      <p className="home-app__name">{profile.name}</p>
      <p className="home-app__role">{profile.role}</p>
      <p>{profile.headline}</p>
      <div className="home-app__notice">
        <strong>Pontos fortes</strong>
        <span>
          arquitetura limpa · acessibilidade · design systems · visão de produto
          · performance
        </span>
      </div>
    </div>
  );
}
