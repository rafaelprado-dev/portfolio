export type MissionId =
  | "about"
  | "project"
  | "skills"
  | "timeline"
  | "contact"
  | "recruiter"
  | "allProjects"
  | "virus"
  | "doom";

export type PortfolioMission = {
  id: MissionId;
  title: string;
  description: string;
};

export const missions: PortfolioMission[] = [
  {
    id: "about",
    title: "Visualizar perfil",
    description: "Entenda quem é Rafael Prado, cargo, resumo profissional e pontos fortes.",
  },
  {
    id: "project",
    title: "Analisar projetos",
    description: "Veja projetos principais, stack, contexto e decisões técnicas.",
  },
  {
    id: "skills",
    title: "Conferir habilidades",
    description: "Confira tecnologias, competências e áreas de foco.",
  },
  {
    id: "timeline",
    title: "Ler experiência",
    description: "Revise experiência profissional, formação e trajetória.",
  },
  {
    id: "contact",
    title: "Consultar contato",
    description: "Localize canais profissionais, currículo e informações de contato.",
  },
  {
    id: "recruiter",
    title: "Executar diagnóstico",
    description: "Abra o resumo rápido para avaliar aderência ao perfil front-end.",
  },
];

const coreMissionIds = new Set(missions.map((mission) => mission.id));

export const getMissionCompletion = (completedMissionIds: Set<MissionId>) => {
  const completedCount = missions.filter((mission) =>
    completedMissionIds.has(mission.id),
  ).length;
  const total = missions.length;
  const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return {
    completedCount,
    percent,
    total,
  };
};

export const isCoreMissionComplete = (
  completedMissionIds: Set<MissionId>,
  missionId: MissionId,
) => coreMissionIds.has(missionId) && completedMissionIds.has(missionId);
