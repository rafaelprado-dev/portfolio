export type LinkKind =
  | "github"
  | "linkedin"
  | "email"
  | "phone"
  | "resume"
  | "external";

export type SocialLink = {
  label: string;
  href: string;
  kind: LinkKind;
  ariaLabel: string;
  isPrimary?: boolean;
};

export type ProjectStatus =
  | "Privado"
  | "Em evolução"
  | "Concluído"
  | "Experimental";

export type Project = {
  name: string;
  type: string;
  status: ProjectStatus;
  description: string;
  stack: string[];
  highlights: string[];
  links?: Array<{
    label: string;
    href: string;
  }>;
};

export type SkillStatus = "Em estudo" | "Em evolução";

export type Skill = {
  label: string;
  status?: SkillStatus;
};

export type SkillGroup = {
  title: string;
  description: string;
  skills: Skill[];
  level: number;
  levelLabel: string;
  note: string;
};

export type Experience = {
  role: string;
  company: string;
  period: string;
  location?: string;
  description: string;
  highlights: string[];
  impacts: string[];
  technologies: string[];
};

export type Education = {
  title: string;
  institution: string;
  location: string;
  period: string;
};
