export type MissionId =
  | "about"
  | "project"
  | "allProjects"
  | "skills"
  | "timeline"
  | "contact"
  | "recruiter"
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
    title: "Abrir perfil",
    description: "Conheça o sistema operacional instalado no Rafael.",
  },
  {
    id: "project",
    title: "Inspecionar um projeto",
    description: "Abra um case principal para ver stack, decisões técnicas e contexto.",
  },
  {
    id: "allProjects",
    title: "Auditar todos os projetos",
    description: "Passe pelos cases GCDP, Luna, Bordo e RDNS.",
  },
  {
    id: "skills",
    title: "Ver árvore de habilidades",
    description: "Confira tecnologias, competências e níveis de foco.",
  },
  {
    id: "timeline",
    title: "Ler histórico profissional",
    description: "Abra o registro de experiência e formação.",
  },
  {
    id: "contact",
    title: "Abrir canal de contato",
    description: "Veja GitHub, LinkedIn, currículo e dados de contato.",
  },
  {
    id: "recruiter",
    title: "Executar recrutador.exe",
    description: "Gere o diagnóstico rápido para leitura profissional.",
  },
  {
    id: "virus",
    title: "Rodar virus-scan.exe",
    description: "Valide que layout bagunçado continua em quarentena.",
  },
  {
    id: "doom",
    title: "Confirmar que roda DOOM",
    description: "Porque todo sistema sério precisa rodar DOOM.",
  },
];
