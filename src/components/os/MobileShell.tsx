"use client";

import Image from "next/image";
import {
  ArrowLeft,
  BatteryFull,
  BriefcaseBusiness,
  FolderKanban,
  Grid3X3,
  Home,
  Mail,
  MessageSquareText,
  Menu,
  Radio,
  Search,
  SignalHigh,
  Sparkles,
  Trophy,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type FormEvent,
} from "react";
import { MobileContactApp } from "@/components/os/mobile-apps/MobileContactApp";
import { MobileExperienceApp } from "@/components/os/mobile-apps/MobileExperienceApp";
import { MobileMessagesApp } from "@/components/os/mobile-apps/MobileMessagesApp";
import { MobileMissionsApp } from "@/components/os/mobile-apps/MobileMissionsApp";
import { MobileProfileApp } from "@/components/os/mobile-apps/MobileProfileApp";
import { MobileProjectsApp } from "@/components/os/mobile-apps/MobileProjectsApp";
import { MobileRecruiterApp } from "@/components/os/mobile-apps/MobileRecruiterApp";
import { MobileSkillsApp } from "@/components/os/mobile-apps/MobileSkillsApp";
import { MobileSnakeApp } from "@/components/os/mobile-apps/MobileSnakeApp";
import type { AppId } from "@/components/os/RafaelOS";
import { education } from "@/content/education";
import { experiences } from "@/content/experience";
import {
  getMissionCompletion,
  missions,
  type MissionId,
} from "@/content/missions";
import { profile, profileSpecialties } from "@/content/profile";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { socialLinks } from "@/content/socialLinks";
import { useCommunity } from "@/components/community/CommunityProvider";

type MobileShellProps = {
  activeApp: AppId;
  onActivateApp: (app: AppId) => void;
};

type MobileOnlyAppId = "snake";
type MobileAppId = AppId | MobileOnlyAppId;

type MobileAppShortcut = {
  id: MobileAppId;
  label: string;
  packageName: string;
  description: string;
  accent: string;
  icon?: ComponentType<{ size?: number; strokeWidth?: number }>;
  iconImage?: {
    src: string;
    alt: string;
  };
};

type MobileSearchResult =
  | {
      type: "app";
      app: MobileAppId;
      title: string;
      description: string;
      keywords: string[];
    }
  | {
      type: "project";
      projectIndex: number;
      title: string;
      description: string;
      keywords: string[];
    }
  | {
      type: "link";
      href: string;
      title: string;
      description: string;
      keywords: string[];
    };

type MobileNavigationMode = "reset" | "push" | "preserve";

type RafaDroidTheme = "holo" | "pocket" | "violet" | "amber";
type RafaDroidWallpaper = "holo" | "pocket" | "aurora" | "midnight";

type RafaDroidSettings = {
  theme: RafaDroidTheme;
  wallpaper: RafaDroidWallpaper;
};

const defaultRafaDroidSettings: RafaDroidSettings = {
  theme: "holo",
  wallpaper: "holo",
};

const rafaDroidSettingsKey = "rafadroid.settings.v1";

const themeOptions: Array<{
  id: RafaDroidTheme;
  label: string;
}> = [
  {
    id: "holo",
    label: "Azul escuro",
  },
  {
    id: "pocket",
    label: "Verde neon",
  },
  {
    id: "violet",
    label: "Azul neon",
  },
  {
    id: "amber",
    label: "Amber",
  },
];

const wallpaperOptions: Array<{
  id: RafaDroidWallpaper;
  label: string;
}> = [
  {
    id: "holo",
    label: "Padrão",
  },
  {
    id: "pocket",
    label: "Razer",
  },
  {
    id: "aurora",
    label: "Neon Dusk",
  },
  {
    id: "midnight",
    label: "Midnight",
  },
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const normalizeRafaDroidSettings = (value: unknown): RafaDroidSettings => {
  if (!isRecord(value)) return defaultRafaDroidSettings;

  const theme = themeOptions.some((option) => option.id === value.theme)
    ? (value.theme as RafaDroidTheme)
    : defaultRafaDroidSettings.theme;
  const wallpaper = wallpaperOptions.some(
    (option) => option.id === value.wallpaper,
  )
    ? (value.wallpaper as RafaDroidWallpaper)
    : defaultRafaDroidSettings.wallpaper;

  return {
    theme,
    wallpaper,
  };
};

const mobileApps: MobileAppShortcut[] = [
  {
    id: "home",
    label: "Perfil",
    packageName: "perfil.apk",
    description: "Cartão de contato do sistema",
    accent: "#29b6f6",
    icon: Home,
  },
  {
    id: "projects",
    label: "Projetos",
    packageName: "projetos.apk",
    description: "Gerenciador de pacotes",
    accent: "#66bb6a",
    icon: FolderKanban,
  },
  {
    id: "skills",
    label: "Habilidades",
    packageName: "habilidades.apk",
    description: "Monitor de módulos",
    accent: "#ffa726",
    icon: Wrench,
  },
  {
    id: "timeline",
    label: "Experiência",
    packageName: "experiencia.log",
    description: "Registro profissional",
    accent: "#ab47bc",
    icon: BriefcaseBusiness,
  },
  {
    id: "contact",
    label: "Contato",
    packageName: "contato.apk",
    description: "Agenda e protocolos",
    accent: "#26c6da",
    icon: Mail,
  },
  {
    id: "feedback",
    label: "Mensagens",
    packageName: "mensagens.apk",
    description: "Mensagens de texto",
    accent: "#42a5f5",
    icon: MessageSquareText,
  },
  {
    id: "recruiter",
    label: "Recrutador",
    packageName: "recrutador.exe",
    description: "Diagnóstico de perfil",
    accent: "#ef5350",
    icon: UserRound,
  },
  {
    id: "missions",
    label: "Missões",
    packageName: "missoes.sys",
    description: "Checklist do sistema",
    accent: "#d4e157",
    icon: Trophy,
  },
  {
    id: "snake",
    label: "Cobrinha",
    packageName: "snake.apk",
    description: "Jogo retro mobile",
    accent: "#7cb342",
    iconImage: {
      src: "/assets/icons/snake/snake-64.png",
      alt: "",
    },
  },
];

const appTitleById: Record<MobileAppId, string> = {
  home: "Perfil",
  projects: "Projetos",
  skills: "Habilidades",
  timeline: "Experiência",
  contact: "Contato",
  feedback: "Mensagens",
  recruiter: "Recrutador",
  missions: "Missões",
  snake: "Cobrinha",
};

const normalizeSearchText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function MobileShell({ activeApp, onActivateApp }: MobileShellProps) {
  const { messages, visitorCount } = useCommunity();
  const appWindowRef = useRef<HTMLDivElement | null>(null);
  const launcherRef = useRef<HTMLDivElement | null>(null);
  const [launcherOpen, setLauncherOpen] = useState(activeApp === "home");
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [settings, setSettings] = useState<RafaDroidSettings>(
    defaultRafaDroidSettings,
  );
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [requestedProjectIndex, setRequestedProjectIndex] = useState<
    number | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOnlyApp, setMobileOnlyApp] = useState<MobileOnlyAppId | null>(
    null,
  );
  const [appCanGoBack, setAppCanGoBack] = useState(false);
  const [appBackSignal, setAppBackSignal] = useState(0);
  const [appScreenSignal, setAppScreenSignal] = useState(0);
  const [navigationStack, setNavigationStack] = useState<AppId[]>([]);
  const [completedMissionIds, setCompletedMissionIds] = useState<
    Set<MissionId>
  >(() => new Set());
  const [showAchievement, setShowAchievement] = useState(true);
  const [now, setNow] = useState(() => new Date());

  const missionCompletion = getMissionCompletion(completedMissionIds);
  const missionProgress = missionCompletion.percent;
  const activeMobileApp: MobileAppId = mobileOnlyApp ?? activeApp;
  const activeShortcut =
    mobileApps.find((app) => app.id === activeMobileApp) ?? mobileApps[0];
  const activeAppTitle = appTitleById[activeMobileApp];
  const shellClassName = [
    "rafadroid-shell",
    launcherOpen && "is-launcher",
    quickSettingsOpen && "is-menu-open",
    `is-theme-${settings.theme}`,
    `is-wallpaper-${settings.wallpaper}`,
  ]
    .filter(Boolean)
    .join(" ");
  const searchIndex = useMemo<MobileSearchResult[]>(() => {
    const keywordsByApp: Record<MobileAppId, string[]> = {
      home: [
        profile.name,
        profile.role,
        profile.headline,
        profile.summary,
        profile.about,
        ...profileSpecialties,
      ],
      projects: projects.flatMap((project) => [
        project.name,
        project.type,
        ...project.status,
        project.description,
        ...project.stack,
        ...project.highlights,
      ]),
      skills: skillGroups.flatMap((group) => [
        group.title,
        group.description,
        group.levelLabel,
        group.note,
        ...group.skills.map((skill) => `${skill.label} ${skill.status ?? ""}`),
      ]),
      timeline: [
        ...experiences.flatMap((experience) => [
          experience.role,
          experience.company,
          experience.period,
          experience.description,
          ...experience.highlights,
          ...experience.technologies,
        ]),
        ...education.flatMap((item) => [
          item.title,
          item.institution,
          item.period,
          item.location,
        ]),
      ],
      contact: [
        profile.location,
        profile.availability,
        ...socialLinks.map((link) => `${link.label} ${link.href} ${link.kind}`),
      ],
      feedback: ["feedback", "mensagens", "sms", "comentário", "sugestão"],
      recruiter: [
        profile.headline,
        profile.summary,
        ...profileSpecialties,
        ...skillGroups.map((group) => group.title),
        ...projects.map((project) => project.name),
      ],
      missions: missions.flatMap((mission) => [
        mission.title,
        mission.description,
        mission.id,
      ]),
      snake: [
        "cobrinha",
        "snake",
        "jogo",
        "game",
        "retro",
        "mobile",
        "android",
      ],
    };

    const appResults: MobileSearchResult[] = mobileApps.map((app) => ({
      type: "app",
      app: app.id,
      title: app.label,
      description: app.description,
      keywords: [
        app.label,
        app.packageName,
        app.description,
        ...keywordsByApp[app.id],
      ],
    }));

    const projectResults: MobileSearchResult[] = projects.map(
      (project, projectIndex) => ({
        type: "project",
        projectIndex,
        title: project.name,
        description: project.type,
        keywords: [
          project.name,
          project.type,
          ...project.status,
          project.description,
          ...project.stack,
          ...project.highlights,
        ],
      }),
    );

    const linkResults: MobileSearchResult[] = socialLinks.map((link) => ({
      type: "link",
      href: link.href,
      title: link.label,
      description: link.ariaLabel,
      keywords: [link.label, link.kind, link.href, link.ariaLabel],
    }));

    return [...appResults, ...projectResults, ...linkResults];
  }, []);
  const normalizedSearchQuery = normalizeSearchText(searchQuery.trim());
  const searchResults = useMemo(() => {
    if (!normalizedSearchQuery) return [];

    const terms = normalizedSearchQuery.split(/\s+/).filter(Boolean);

    return searchIndex
      .map((result, order) => {
        const titleText = normalizeSearchText(result.title);
        const primaryText = normalizeSearchText(
          `${result.title} ${result.description}`,
        );
        const matchText = normalizeSearchText(
          [result.title, result.description, ...result.keywords].join(" "),
        );
        let score: number | null = null;

        if (terms.every((term) => titleText.includes(term))) {
          score = 0;
        } else if (terms.every((term) => primaryText.includes(term))) {
          score = 1;
        } else if (terms.every((term) => matchText.includes(term))) {
          score = 2;
        }

        if (score === null) return null;

        return {
          order,
          result,
          score: result.type === "project" ? score - 0.2 : score,
        };
      })
      .filter(
        (
          item,
        ): item is {
          order: number;
          result: MobileSearchResult;
          score: number;
        } => item !== null,
      )
      .sort(
        (first, second) =>
          first.score - second.score || first.order - second.order,
      )
      .map(({ result }) => result)
      .slice(0, 6);
  }, [normalizedSearchQuery, searchIndex]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedSettings = window.localStorage.getItem(rafaDroidSettingsKey);

      if (storedSettings) {
        try {
          setSettings(normalizeRafaDroidSettings(JSON.parse(storedSettings)));
        } catch {
          window.localStorage.removeItem(rafaDroidSettingsKey);
        }
      }

      setSettingsLoaded(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;

    window.localStorage.setItem(rafaDroidSettingsKey, JSON.stringify(settings));
  }, [settings, settingsLoaded]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const scrollTarget = launcherOpen
        ? launcherRef.current
        : appWindowRef.current;

      scrollTarget?.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [
    activeApp,
    activeMobileApp,
    appBackSignal,
    appScreenSignal,
    launcherOpen,
    requestedProjectIndex,
  ]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowAchievement(false), 6200);

    return () => window.clearTimeout(timer);
  }, []);

  const completeMission = (missionId: MissionId) => {
    setCompletedMissionIds((current) => {
      if (current.has(missionId)) return current;

      const next = new Set(current);
      next.add(missionId);

      return next;
    });
  };

  const formattedTime = useMemo(() => {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(now);
  }, [now]);

  const openApp = (
    app: AppId,
    options?: { history?: MobileNavigationMode; projectIndex?: number },
  ) => {
    const historyMode = options?.history ?? "reset";

    if (historyMode === "reset") {
      setNavigationStack([]);
    }

    if (
      historyMode === "push" &&
      !launcherOpen &&
      !mobileOnlyApp &&
      activeApp !== app
    ) {
      setNavigationStack((current) => {
        if (current[current.length - 1] === activeApp) return current;

        return [...current, activeApp];
      });
    }

    setMobileOnlyApp(null);
    setQuickSettingsOpen(false);
    setAppCanGoBack(false);

    const missionByApp: Partial<Record<AppId, MissionId>> = {
      home: "about",
      projects: "project",
      skills: "skills",
      timeline: "timeline",
      contact: "contact",
      recruiter: "recruiter",
    };
    const missionId = missionByApp[app];

    if (app === "projects" && typeof options?.projectIndex === "number") {
      setSelectedProjectIndex(options.projectIndex);
      setRequestedProjectIndex(options.projectIndex);
      completeMission("project");
    } else {
      setRequestedProjectIndex(null);
    }

    if (missionId) {
      completeMission(missionId);
    }

    onActivateApp(app);
    setLauncherOpen(false);
  };

  const openMobileApp = (
    app: MobileAppId,
    options?: { history?: MobileNavigationMode; projectIndex?: number },
  ) => {
    if (app === "snake") {
      setSearchQuery("");
      setRequestedProjectIndex(null);
      setQuickSettingsOpen(false);
      setAppCanGoBack(false);
      setNavigationStack([]);
      setMobileOnlyApp("snake");
      setLauncherOpen(false);
      return;
    }

    openApp(app, options);
  };

  const openSearchResult = (result: MobileSearchResult) => {
    setSearchQuery("");
    setQuickSettingsOpen(false);

    if (result.type === "link") {
      window.open(result.href, "_blank", "noreferrer,noopener");
      return;
    }

    if (result.type === "project") {
      openMobileApp("projects", { projectIndex: result.projectIndex });
      return;
    }

    openMobileApp(result.app);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const firstResult = searchResults[0];

    if (firstResult) {
      openSearchResult(firstResult);
    }
  };

  const goHome = () => {
    setSearchQuery("");
    setQuickSettingsOpen(false);
    setNavigationStack([]);
    setLauncherOpen(true);
  };

  const handleBack = () => {
    if (quickSettingsOpen) {
      setQuickSettingsOpen(false);
      return;
    }

    if (searchQuery.trim()) {
      setSearchQuery("");
      return;
    }

    if (!launcherOpen && appCanGoBack) {
      setAppBackSignal((current) => current + 1);
      return;
    }

    const previousApp = navigationStack[navigationStack.length - 1];

    if (!launcherOpen && previousApp) {
      setNavigationStack((current) => current.slice(0, -1));
      openApp(previousApp, { history: "preserve" });
      return;
    }

    if (!launcherOpen) {
      setLauncherOpen(true);
    }
  };

  const updateTheme = (theme: RafaDroidTheme) => {
    setSettings((current) => ({ ...current, theme }));
  };

  const updateWallpaper = (wallpaper: RafaDroidWallpaper) => {
    setSettings((current) => ({ ...current, wallpaper }));
  };

  const resetSettings = () => {
    setSettings(defaultRafaDroidSettings);
  };

  const openMission = (missionId: MissionId) => {
    const missionTargetById: Partial<Record<MissionId, AppId>> = {
      about: "home",
      project: "projects",
      skills: "skills",
      timeline: "timeline",
      contact: "contact",
      recruiter: "recruiter",
    };
    const targetApp = missionTargetById[missionId];

    if (targetApp) {
      openApp(targetApp, { history: "push" });
    }
  };

  const handleProjectSelect = (projectIndex: number) => {
    setSelectedProjectIndex(projectIndex);
    completeMission("project");
  };

  const renderActiveApp = () => {
    if (mobileOnlyApp === "snake") {
      return <MobileSnakeApp />;
    }

    if (activeApp === "home") {
      return (
        <MobileProfileApp
          onOpenContact={() => openApp("contact", { history: "push" })}
          onOpenProjects={() => openApp("projects", { history: "push" })}
        />
      );
    }

    if (activeApp === "projects") {
      return (
        <MobileProjectsApp
          backSignal={appBackSignal}
          initialDetailProjectIndex={requestedProjectIndex}
          onBackAvailabilityChange={setAppCanGoBack}
          selectedProjectIndex={selectedProjectIndex}
          onScreenChange={() => setAppScreenSignal((current) => current + 1)}
          onProjectSelect={handleProjectSelect}
        />
      );
    }

    if (activeApp === "skills") {
      return (
        <MobileSkillsApp
          backSignal={appBackSignal}
          onBackAvailabilityChange={setAppCanGoBack}
          onScreenChange={() => setAppScreenSignal((current) => current + 1)}
        />
      );
    }

    if (activeApp === "timeline") {
      return (
        <MobileExperienceApp
          backSignal={appBackSignal}
          onBackAvailabilityChange={setAppCanGoBack}
          onScreenChange={() => setAppScreenSignal((current) => current + 1)}
        />
      );
    }

    if (activeApp === "contact") {
      return <MobileContactApp />;
    }

    if (activeApp === "feedback") {
      return <MobileMessagesApp />;
    }

    if (activeApp === "recruiter") {
      return (
        <MobileRecruiterApp
          onOpenContact={() => openApp("contact", { history: "push" })}
          onOpenProjects={() => openApp("projects", { history: "push" })}
        />
      );
    }

    return (
      <MobileMissionsApp
        completedMissionIds={completedMissionIds}
        completionPercent={missionProgress}
        onOpenMission={openMission}
      />
    );
  };

  return (
    <main
      id="conteudo"
      className={shellClassName}
      aria-label="Portfólio mobile RafaDroid 1.7"
    >
      <div className="rafadroid-statusbar" aria-label="Status do RafaDroid">
        <span className="rafadroid-statusbar__carrier">
          <Radio size={13} strokeWidth={2.4} />
          RAFA.NET
        </span>
        <span className="rafadroid-statusbar__icons">
          <SignalHigh size={14} strokeWidth={2.4} aria-hidden="true" />
          <BatteryFull size={15} strokeWidth={2.4} aria-hidden="true" />
          <time dateTime={now.toISOString()}>{formattedTime}</time>
        </span>
      </div>

      {!launcherOpen ? (
        <header className="rafadroid-appbar">
          <div>
            <small>/{activeShortcut.packageName}</small>
          </div>
          <button
            aria-label="Abrir launcher"
            className="rafadroid-icon-button"
            type="button"
            onClick={goHome}
          >
            <Grid3X3 size={18} />
          </button>
        </header>
      ) : null}

      <section
        className="rafadroid-screen"
        aria-label={launcherOpen ? "Launcher de aplicativos" : activeAppTitle}
      >
        {launcherOpen ? (
          <div className="rafadroid-launcher" ref={launcherRef}>
            <header className="rafadroid-launcher__header">
              <div className="rafadroid-clock-widget">
                <time dateTime={now.toISOString()}>{formattedTime}</time>
                <span>RafaDroid 1.7 Pocket Edition</span>
              </div>
              <div className="rafadroid-search-stack">
                <form
                  className="rafadroid-search-widget"
                  role="search"
                  onSubmit={handleSearchSubmit}
                >
                  <span className="rafadroid-search-widget__brand">Google</span>
                  <input
                    aria-label="Pesquisar no RafaDroid"
                    autoComplete="off"
                    inputMode="search"
                    placeholder="Pesquisar"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                  {searchQuery ? (
                    <button
                      aria-label="Limpar busca"
                      className="rafadroid-search-widget__clear"
                      type="button"
                      onClick={() => setSearchQuery("")}
                    >
                      <X size={15} strokeWidth={2.4} />
                    </button>
                  ) : (
                    <Search size={15} strokeWidth={2.4} aria-hidden="true" />
                  )}
                </form>
                {normalizedSearchQuery ? (
                  <section
                    className="rafadroid-search-results"
                    aria-label="Resultados da busca local"
                  >
                    {searchResults.length ? (
                      searchResults.map((result) => (
                        <button
                          key={`${result.type}-${result.title}`}
                          type="button"
                          onClick={() => openSearchResult(result)}
                        >
                          <small>
                            {result.type === "project"
                              ? "projeto"
                              : result.type === "link"
                                ? "atalho"
                                : "app"}
                          </small>
                          <strong>{result.title}</strong>
                          <span>{result.description}</span>
                        </button>
                      ))
                    ) : (
                      <p>Nenhum resultado local encontrado.</p>
                    )}
                  </section>
                ) : null}
              </div>
              <div className="rafadroid-widget-tray">
                <button
                  className="rafadroid-recruiter-widget"
                  type="button"
                  onClick={() => openApp("missions")}
                  style={
                    {
                      "--mission-progress": `${missionProgress}%`,
                    } as CSSProperties
                  }
                  aria-label={`Abrir progresso do recrutador: ${missionProgress}% analisado`}
                >
                  <span
                    className="rafadroid-recruiter-widget__dial"
                    aria-hidden="true"
                  >
                    <span>{missionProgress}%</span>
                  </span>
                  <span className="rafadroid-recruiter-widget__readout">
                    <strong>Recrutador</strong>
                    <em>scan ativo</em>
                    <small>
                      {missionCompletion.completedCount}/
                      {missionCompletion.total} módulos
                    </small>
                  </span>
                </button>
                <button
                  className="rafadroid-community-widget"
                  type="button"
                  onClick={() => openApp("feedback")}
                >
                  <span
                    className="rafadroid-community-widget__icon"
                    aria-hidden="true"
                  >
                    <MessageSquareText size={19} strokeWidth={2.2} />
                  </span>
                  <span className="rafadroid-community-widget__copy">
                    <strong>Mensagens</strong>
                    <small>
                      {messages[0]?.message ??
                        "Envie um feedback pelo RafaDroid"}
                    </small>
                  </span>
                  <span className="rafadroid-community-widget__count">
                    {visitorCount.toLocaleString("pt-BR")}
                    <small>visitas</small>
                  </span>
                </button>
              </div>
            </header>
            <div className="rafadroid-launcher__grid" role="list">
              {mobileApps.map((app) => {
                const Icon = app.icon;

                return (
                  <button
                    className={
                      activeMobileApp === app.id ? "is-active" : undefined
                    }
                    key={app.id}
                    role="listitem"
                    style={{ "--app-accent": app.accent } as CSSProperties}
                    type="button"
                    onClick={() => openMobileApp(app.id)}
                    aria-label={`${app.label}: ${app.description}`}
                  >
                    <span>
                      {app.iconImage ? (
                        <Image
                          alt={app.iconImage.alt}
                          aria-hidden="true"
                          height={36}
                          src={app.iconImage.src}
                          width={36}
                        />
                      ) : null}
                      {Icon ? <Icon size={22} strokeWidth={2.3} /> : null}
                    </span>
                    <strong>{app.label}</strong>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rafadroid-app-window" ref={appWindowRef}>
            {renderActiveApp()}
          </div>
        )}
      </section>

      <footer className="rafadroid-softkeys" aria-label="Teclas do RafaDroid">
        <button
          aria-controls="rafadroid-quick-settings"
          aria-expanded={quickSettingsOpen}
          type="button"
          onClick={() => setQuickSettingsOpen((current) => !current)}
        >
          <Menu size={15} strokeWidth={2.4} />
          Menu
        </button>
        <button type="button" onClick={goHome}>
          <Home size={15} strokeWidth={2.4} />
          Início
        </button>
        <button type="button" onClick={handleBack}>
          <ArrowLeft size={15} strokeWidth={2.4} />
          Voltar
        </button>
      </footer>

      {quickSettingsOpen ? (
        <div
          aria-label="Menu de personalização do RafaDroid"
          className="rafadroid-quick-settings-backdrop"
          id="rafadroid-quick-settings"
          role="presentation"
          onClick={() => setQuickSettingsOpen(false)}
        >
          <section
            aria-label="Opções de personalização do RafaDroid"
            className="rafadroid-quick-settings"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="rafadroid-quick-settings__header">
              <div>
                <small>Menu</small>
                <h2>Personalização</h2>
              </div>
              <button
                aria-label="Fechar menu"
                className="rafadroid-icon-button"
                type="button"
                onClick={() => setQuickSettingsOpen(false)}
              >
                <X size={17} strokeWidth={2.4} />
              </button>
            </header>

            <div className="rafadroid-quick-settings__group">
              <h3>Tema</h3>
              <div className="rafadroid-quick-settings__options">
                {themeOptions.map((option) => (
                  <button
                    aria-pressed={settings.theme === option.id}
                    className={
                      settings.theme === option.id ? "is-active" : undefined
                    }
                    key={option.id}
                    type="button"
                    onClick={() => updateTheme(option.id)}
                  >
                    <strong>{option.label}</strong>
                  </button>
                ))}
              </div>
            </div>

            <div className="rafadroid-quick-settings__group">
              <h3>Wallpaper</h3>
              <div className="rafadroid-quick-settings__options">
                {wallpaperOptions.map((option) => (
                  <button
                    aria-pressed={settings.wallpaper === option.id}
                    className={
                      settings.wallpaper === option.id ? "is-active" : undefined
                    }
                    key={option.id}
                    type="button"
                    onClick={() => updateWallpaper(option.id)}
                  >
                    <strong>{option.label}</strong>
                  </button>
                ))}
              </div>
            </div>

            <button
              className="rafadroid-quick-settings__reset"
              type="button"
              onClick={resetSettings}
            >
              Restaurar padrão
            </button>
          </section>
        </div>
      ) : null}

      {showAchievement && !quickSettingsOpen ? (
        <div className="rafadroid-achievement" role="status">
          <Sparkles size={18} strokeWidth={2.4} aria-hidden="true" />
          <div>
            <small>Conquista desbloqueada</small>
            <strong>Você encontrou o RafaDroid 1.7</strong>
          </div>
        </div>
      ) : null}
    </main>
  );
}
