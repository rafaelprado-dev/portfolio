import type { SkillGroup } from "@/types/portfolio";

export const skillGroups: SkillGroup[] = [
  {
    title: "Front-end",
    description:
      "Interfaces modernas, responsivas e componentizadas para produtos web escaláveis.",
    level: 5,
    levelLabel: "Foco principal",
    note:
      "Desenvolvimento de dashboards, plataformas SaaS e experiências digitais com foco em clareza, performance e usabilidade.",
    skills: [
      { label: "React" },
      { label: "Next.js" },
      { label: "TypeScript" },
      { label: "JavaScript ES6+" },
      { label: "HTML5" },
      { label: "CSS3" },
      { label: "Componentização" },
      { label: "Responsividade" },
    ],
  },
  {
    title: "UX/UI e Acessibilidade",
    description:
      "Design com legibilidade, consistência visual e navegação inclusiva.",
    level: 4,
    levelLabel: "Domínio sólido",
    note: "Construção de interfaces intuitivas, acessíveis e visualmente consistentes.",
    skills: [
      { label: "Tailwind CSS" },
      { label: "Framer Motion" },
      { label: "Atomic Design" },
      { label: "Design System" },
      { label: "WCAG" },
      { label: "A11Y" },
      { label: "UX/UI" },
    ],
  },
  {
    title: "Arquitetura e Qualidade",
    description:
      "Organização de código, manutenção e performance pensadas para produtos reais.",
    level: 4,
    levelLabel: "Domínio sólido",
    note: "Estruturo soluções com foco em evolução técnica, estabilidade e clareza.",
    skills: [
      { label: "Arquitetura limpa" },
      { label: "Organização de código" },
      { label: "Performance Web" },
      { label: "Debug" },
      { label: "Revisão de código" },
      { label: "Git" },
      { label: "GitHub" },
      { label: "GitLab" },
    ],
  },
  {
    title: "Integrações e Dados",
    description:
      "Integração entre interface, regras de negócio e serviços externos.",
    level: 4,
    levelLabel: "Domínio sólido",
    note:
      "Construção de fluxos reais com autenticação, integração com backend e dados orientados ao produto.",
    skills: [
      { label: "APIs RESTful" },
      { label: "Firebase Auth" },
      { label: "Firestore" },
      { label: "Storage" },
      { label: "Hosting" },
      { label: "Zustand" },
      { label: "Autenticação" },
      { label: "Persistência de dados" },
    ],
  },
  {
    title: "Mobile e Produto",
    description:
      "Experiências pensadas para uso real, com atenção a fluxo, contexto e recorrência.",
    level: 3,
    levelLabel: "Experiência prática",
    note: "Extensão prática do meu trabalho com interfaces para experiências além da web.",
    skills: [
      { label: "React Native" },
      { label: "Expo" },
      { label: "UX mobile" },
      { label: "Navegação" },
      { label: "Visão de produto" },
    ],
  },
  {
    title: "IA, Automação e Contexto Local",
    description:
      "Camada em crescimento voltada à produtividade, automações e experiência conversacional.",
    level: 3,
    levelLabel: "Em evolução",
    note:
      "Evolução prática aplicada à Luna, com foco em IA útil no mundo real.",
    skills: [
      { label: "Python", status: "Em estudo" },
      { label: "APIs de IA" },
      { label: "STT/TTS" },
      { label: "Automação" },
      { label: "Windows" },
      { label: "Contexto local" },
    ],
  },
];
