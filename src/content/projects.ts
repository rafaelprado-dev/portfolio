import type { Project, ProjectFilter, ProjectFilterId } from "@/types/portfolio";

export const projectFilters: ProjectFilter[] = [
  { id: "all", label: "Todos", shortLabel: "Todos" },
  {
    id: "produto-web",
    label: "Produto Web",
    shortLabel: "Produto",
  },
  {
    id: "ia-local",
    label: "IA Local",
    shortLabel: "IA Local",
  },
  { id: "mobile", label: "Mobile", shortLabel: "Mobile" },
  {
    id: "ferramentas",
    label: "Ferramentas",
    shortLabel: "Ferramentas",
  },
];

export const getFilteredProjectEntries = (filterId: ProjectFilterId) => {
  const activeFilter = projectFilters.find((filter) => filter.id === filterId);

  return projects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) =>
      activeFilter?.id === "all" || project.category === activeFilter?.id,
    );
};

export const projects: Project[] = [
  {
    name: "Arcadium / GCDP",
    type: "SaaS gamificado corporativo",
    status: ["Privado"],
    category: "produto-web",
    featured: true,
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
    name: "ASUM — All-in-one System for Unified Management",
    type: "SaaS corporativo multi-tenant",
    status: ["Privado", "Em evolução"],
    category: "produto-web",
    featured: true,
    description:
      "Plataforma web de gestão empresarial para centralizar dashboards, relatórios, módulos corporativos e tomada de decisão em um único ambiente.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "RBAC", "IA"],
    highlights: [
      "Dashboards dinâmicos, relatórios inteligentes e módulos configuráveis para áreas como financeiro, RH, operações e vendas.",
      "Arquitetura multi-tenant com controle de acesso por perfis e foco em escalabilidade.",
      "Hub central pensado para integrar módulos especializados, como desenvolvimento corporativo e gamificação."
    ]
  },
  {
    name: "Luna — Your AI Companion",
    type: "Assistente local com IA",
    status: ["Privado", "Em evolução"],
    category: "ia-local",
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
    name: "ROM Translation Studio",
    type: "Ferramenta desktop para tradução de jogos",
    status: ["Privado", "Em evolução", "Experimental"],
    category: "ferramentas",
    featured: true,
    description:
      "Toolkit local para apoiar a tradução de jogos entre diferentes idiomas, com extração, tradução assistida por IA local, revisão manual, validação estrutural e reconstrução de arquivos.",
    stack: ["Python", "PySide6", "Ollama/Qwen", "JSONL", "Dolphin", "PyInstaller"],
    highlights: [
      "Pipeline local para extração, conversão, tradução, revisão e reconstrução de textos.",
      "Validações para preservar tokens internos, placeholders e estruturas sensíveis do jogo.",
      "Interface desktop com revisão manual, filtros de status e memória de tradução."
    ]
  },
  {
    name: "Market Seeker",
    type: "Dashboard analítico para mercado do ESO",
    status: ["Privado"],
    category: "produto-web",
    description:
      "Ferramenta local para análise de mercado e planejamento de compras no Elder Scrolls Online, cruzando dados de preços, itens e builds.",
    stack: ["Next.js", "TypeScript", "SQLite", "Drizzle", "Tailwind CSS"],
    highlights: [
      "Organização de dados locais de mercado para consulta e comparação de preços.",
      "Planejamento de builds com custo estimado, orçamento e itens necessários.",
      "Mapeamento de nomes e aliases em português e inglês para facilitar buscas."
    ]
  },
  {
    name: "Bordo Hub",
    type: "Aplicativo mobile de comunidade",
    status: ["Descontinuado"],
    category: "mobile",
    description:
      "Aplicativo mobile para centralizar comunicação, anúncios e organização de atividades da guilda Bordo no MapleStory.",
    stack: ["React Native", "Expo", "TypeScript", "Firebase", "Cloud Run"],
    highlights: [
      "Home com painel rápido para anúncios oficiais, avisos e atualizações da comunidade.",
      "Persistência no Firestore com cache local e atualização inteligente quando há mudanças.",
      "Integração com automação via Cloud Run para sincronização e controle de dados."
    ]
  },
  {
    name: "RDNS — Rafa DNS",
    type: "Infra local e privacidade",
    status: ["Experimental"],
    category: "ferramentas",
    description:
      "Projeto de DNS local com foco em privacidade, controle, segurança e performance.",
    stack: ["Docker", "AdGuard Home", "Unbound", "DNS", "Infra"],
    highlights: [
      "Resolver local com controle do tráfego DNS.",
      "Ambiente previsível com containers.",
      "Foco em privacidade e desempenho de rede."
    ]
  },
  {
    name: "EVA Agent",
    type: "Agente local de pesquisa e automação",
    status: ["Privado", "Em evolução", "Experimental"],
    category: "ia-local",
    description:
      "Agente local criado para experimentar ciclos autônomos de busca, leitura, tomada de decisão e memória usando IA local e automação de navegador.",
    stack: ["Node.js", "TypeScript", "Ollama/Qwen", "Playwright", "JSON"],
    highlights: [
      "Ciclo automatizado de decisão, pesquisa, leitura e registro de aprendizado.",
      "Integração com modelo local via Ollama para reduzir dependência de APIs externas.",
      "Memória local em JSON para armazenar interesses, histórico e anotações do agente."
    ]
  }
];

export const featuredProjects = projects.filter((project) => project.featured);
