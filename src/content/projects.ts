import type { Project } from "@/types/portfolio";

export const projects: Project[] = [
  {
    name: "Arcadium / GCDP",
    type: "SaaS gamificado corporativo",
    status: "Privado",
    description:
      "Plataforma de desenvolvimento corporativo com treinamentos, onboarding, gamificação e painel administrativo.",
    stack: ["Next.js", "TypeScript", "Firebase", "Tailwind CSS", "Zustand"],
    highlights: [
      "Dashboard gamificado com XP, níveis e conquistas.",
      "Controle de acesso por perfis como colaborador, RH e admin.",
      "Extensão Chrome para acompanhar progresso real em cursos externos."
    ]
  },
  {
    name: "Luna — Your AI Companion",
    type: "Assistente local com IA",
    status: "Em evolução",
    description:
      "Assistente com IA e voz voltado à produtividade, automações e contexto local no Windows.",
    stack: ["TypeScript", "IA", "STT/TTS", "Automação", "Windows"],
    highlights: [
      "Arquitetura local-first com fallback de IA.",
      "Fluxos pensados para reduzir atrito em tarefas recorrentes.",
      "Experiência conversacional com voz e contexto como núcleo do produto."
    ]
  },
  {
    name: "Bordo Hub",
    type: "Hub de comunidade",
    status: "Em evolução",
    description:
      "Plataforma para comunidade com eventos, anúncios, integração com Discord e consumo de dados externos.",
    stack: ["React", "TypeScript", "APIs", "Discord", "UI/UX"],
    highlights: [
      "Centralização de comunicação e eventos em uma única interface.",
      "Experiência orientada à recorrência de uso e clareza visual.",
      "Base preparada para integrações e evolução incremental."
    ]
  },
  {
    name: "RDNS — Rafa DNS",
    type: "Infra local e privacidade",
    status: "Experimental",
    description:
      "Projeto de DNS local com foco em privacidade, controle, segurança e performance.",
    stack: ["Docker", "AdGuard Home", "Unbound", "DNS", "Infra"],
    highlights: [
      "Resolver local com controle do tráfego DNS.",
      "Ambiente previsível com containers.",
      "Foco em privacidade e desempenho de rede."
    ]
  }
];
