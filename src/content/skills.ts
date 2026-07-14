import type { SkillGroup } from "@/types/portfolio";

export const skillGroups: SkillGroup[] = [
  {
    title: "Front-end",
    description:
      "Construção de interfaces web para produtos digitais, com foco em clareza, componentização e experiência de uso.",
    level: 5,
    levelLabel: "Foco principal",
    note:
      "Atuação em dashboards, SaaS, painéis administrativos, grids, calendários e Kanban.",
    skills: [
      { label: "React" },
      { label: "Next.js" },
      { label: "TypeScript" },
      { label: "JavaScript ES6+" },
      { label: "HTML5" },
      { label: "CSS3" },
      { label: "Tailwind CSS" },
      { label: "Componentização" },
    ],
  },
  {
    title: "UX/UI e Acessibilidade",
    description:
      "Cuidado visual e de uso para interfaces claras, consistentes e acessíveis.",
    level: 4,
    levelLabel: "Experiência sólida",
    note:
      "Trabalho com atenção a hierarquia visual, responsividade, navegação, acessibilidade e acabamento de interface.",
    skills: [
      { label: "UX/UI" },
      { label: "WCAG" },
      { label: "A11Y" },
      { label: "Design Systems" },
      { label: "Atomic Design" },
      { label: "Responsividade" },
      { label: "Framer Motion" },
      { label: "Microinterações" },
    ],
  },
  {
    title: "Arquitetura Front-end",
    description:
      "Estruturação de componentes, manutenção e qualidade para produtos que evoluem.",
    level: 3,
    levelLabel: "Experiência prática",
    note:
      "Organizo interfaces pensando em reaproveitamento, separação de responsabilidades, performance e facilidade de manutenção.",
    skills: [
      { label: "Arquitetura Front-end" },
      { label: "Manutenibilidade" },
      { label: "Performance Web" },
      { label: "Debug" },
      { label: "Code Review" },
      { label: "Git" },
      { label: "GitHub" },
      { label: "GitLab" },
      { label: "GitHub Actions" },
    ],
  },
  {
    title: "Integrações e Dados",
    description:
      "Ligação entre interface, autenticação, dados e serviços externos.",
    level: 4,
    levelLabel: "Experiência sólida",
    note:
      "Experiência com fluxos reais envolvendo autenticação, persistência de dados, APIs e gerenciamento de estado.",
    skills: [
      { label: "APIs REST" },
      { label: "Firebase Auth" },
      { label: "Firestore" },
      { label: "Storage" },
      { label: "Hosting" },
      { label: "Zustand" },
      { label: "React Query" },
      { label: "Zod" },
      { label: "Persistência de dados" },
    ],
  },
  {
    title: "Mobile",
    description:
      "Extensão do trabalho de front-end para aplicações e fluxos mobile.",
    level: 4,
    levelLabel: "Experiência sólida",
    note:
      "Criação de telas e navegação mobile com atenção a fluxo, responsividade e contexto de uso.",
    skills: [
      { label: "React Native" },
      { label: "Expo" },
      { label: "UX Mobile" },
      { label: "Navegação Mobile" },
      { label: "Firebase" },
      { label: "Responsividade" },
    ],
  },
  {
    title: "IA Local e Automação",
    description:
      "Projetos experimentais com IA local, automação, ferramentas desktop e fluxos assistidos.",
    level: 3,
    levelLabel: "Experiência prática",
    note:
      "Aplicação prática em agentes locais, tradução assistida por IA, automação de pesquisa e ferramentas de apoio ao fluxo de trabalho.",
    skills: [
      { label: "Ollama" },
      { label: "Qwen" },
      { label: "Python" },
      { label: "PySide6" },
      { label: "Playwright" },
      { label: "Node.js" },
      { label: "Automação local" },
    ],
  },
];
