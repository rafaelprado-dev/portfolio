"use client";

import {
  ArrowLeft,
  BatteryFull,
  BriefcaseBusiness,
  FolderKanban,
  Grid3X3,
  Home,
  Mail,
  Menu,
  Radio,
  SignalHigh,
  Sparkles,
  Trophy,
  UserRound,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import { MobileContactApp } from "@/components/os/mobile-apps/MobileContactApp";
import { MobileExperienceApp } from "@/components/os/mobile-apps/MobileExperienceApp";
import { MobileMissionsApp } from "@/components/os/mobile-apps/MobileMissionsApp";
import { MobileProfileApp } from "@/components/os/mobile-apps/MobileProfileApp";
import { MobileProjectsApp } from "@/components/os/mobile-apps/MobileProjectsApp";
import { MobileRecruiterApp } from "@/components/os/mobile-apps/MobileRecruiterApp";
import { MobileSkillsApp } from "@/components/os/mobile-apps/MobileSkillsApp";
import type { AppId } from "@/components/os/RafaelOS";
import { missions, type MissionId } from "@/content/missions";
import { projects } from "@/content/projects";

type MobileShellProps = {
  activeApp: AppId;
  onActivateApp: (app: AppId) => void;
};

type MobileAppShortcut = {
  id: AppId;
  label: string;
  packageName: string;
  description: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
};

const mobileApps: MobileAppShortcut[] = [
  {
    id: "home",
    label: "Perfil",
    packageName: "perfil.apk",
    description: "Cartão de contato do sistema",
    icon: Home,
  },
  {
    id: "projects",
    label: "Projetos",
    packageName: "projetos.apk",
    description: "Gerenciador de pacotes",
    icon: FolderKanban,
  },
  {
    id: "skills",
    label: "Habilidades",
    packageName: "habilidades.apk",
    description: "Monitor de módulos",
    icon: Wrench,
  },
  {
    id: "timeline",
    label: "Experiência",
    packageName: "experiencia.log",
    description: "Registro profissional",
    icon: BriefcaseBusiness,
  },
  {
    id: "contact",
    label: "Contato",
    packageName: "contato.apk",
    description: "Agenda e protocolos",
    icon: Mail,
  },
  {
    id: "recruiter",
    label: "Recrutador",
    packageName: "recrutador.exe",
    description: "Diagnóstico de perfil",
    icon: UserRound,
  },
  {
    id: "missions",
    label: "Missões",
    packageName: "missoes.sys",
    description: "Checklist do sistema",
    icon: Trophy,
  },
];

const appTitleById: Record<AppId, string> = {
  home: "Perfil",
  projects: "Projetos",
  skills: "Habilidades",
  timeline: "Experiência",
  contact: "Contato",
  recruiter: "Recrutador",
  missions: "Missões",
};

export function MobileShell({ activeApp, onActivateApp }: MobileShellProps) {
  const [launcherOpen, setLauncherOpen] = useState(true);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [, setViewedProjectIndexes] = useState<Set<number>>(
    () => new Set(),
  );
  const [completedMissionIds, setCompletedMissionIds] = useState<Set<MissionId>>(
    () => new Set(),
  );
  const [showAchievement, setShowAchievement] = useState(true);
  const [now, setNow] = useState(() => new Date());

  const missionProgress = Math.round((completedMissionIds.size / missions.length) * 100);
  const activeShortcut =
    mobileApps.find((app) => app.id === activeApp) ?? mobileApps[0];
  const activeAppTitle = appTitleById[activeApp];

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);

    return () => window.clearInterval(timer);
  }, []);

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

  const openApp = (app: AppId) => {
    const missionByApp: Partial<Record<AppId, MissionId>> = {
      home: "about",
      skills: "skills",
      timeline: "timeline",
      contact: "contact",
      recruiter: "recruiter",
      missions: "about",
    };
    const missionId = missionByApp[app];

    if (missionId) {
      completeMission(missionId);
    }

    onActivateApp(app);
    setLauncherOpen(false);
  };

  const handleProjectSelect = (projectIndex: number) => {
    setSelectedProjectIndex(projectIndex);
    setViewedProjectIndexes((current) => {
      const next = new Set(current);
      next.add(projectIndex);

      if (next.size >= projects.length) {
        setCompletedMissionIds((missionsCurrent) => {
          const missionsNext = new Set(missionsCurrent);
          missionsNext.add("project");
          missionsNext.add("allProjects");

          return missionsNext;
        });
      } else {
        setCompletedMissionIds((missionsCurrent) => {
          if (missionsCurrent.has("project")) return missionsCurrent;

          const missionsNext = new Set(missionsCurrent);
          missionsNext.add("project");

          return missionsNext;
        });
      }

      return next;
    });
  };

  const renderActiveApp = () => {
    if (activeApp === "home") {
      return (
        <MobileProfileApp
          onOpenContact={() => openApp("contact")}
          onOpenProjects={() => openApp("projects")}
        />
      );
    }

    if (activeApp === "projects") {
      return (
        <MobileProjectsApp
          selectedProjectIndex={selectedProjectIndex}
          onProjectSelect={handleProjectSelect}
        />
      );
    }

    if (activeApp === "skills") {
      return <MobileSkillsApp />;
    }

    if (activeApp === "timeline") {
      return <MobileExperienceApp />;
    }

    if (activeApp === "contact") {
      return <MobileContactApp />;
    }

    if (activeApp === "recruiter") {
      return (
        <MobileRecruiterApp
          onOpenContact={() => openApp("contact")}
          onOpenProjects={() => openApp("projects")}
        />
      );
    }

    return (
      <MobileMissionsApp
        completedMissionIds={completedMissionIds}
        completionPercent={missionProgress}
      />
    );
  };

  return (
    <main className="rafadroid-shell" aria-label="Portfólio mobile RafaDroid 1.7">
      <div className="rafadroid-statusbar" aria-label="Status do RafaDroid">
        <span className="rafadroid-statusbar__carrier">
          <Radio size={13} strokeWidth={2.4} />
          RAFAELNET
        </span>
        <span className="rafadroid-statusbar__icons">
          <SignalHigh size={14} strokeWidth={2.4} aria-hidden="true" />
          <BatteryFull size={15} strokeWidth={2.4} aria-hidden="true" />
          <time dateTime={now.toISOString()}>{formattedTime}</time>
        </span>
      </div>

      <header className="rafadroid-appbar">
        <div>
          <small>{launcherOpen ? "RafaDroid 1.7" : activeShortcut.packageName}</small>
          <h1>{launcherOpen ? "Launcher" : activeAppTitle}</h1>
        </div>
        <button
          aria-label={launcherOpen ? "Voltar ao aplicativo" : "Abrir launcher"}
          className="rafadroid-icon-button"
          type="button"
          onClick={() => setLauncherOpen((current) => !current)}
        >
          {launcherOpen ? <ArrowLeft size={18} /> : <Grid3X3 size={18} />}
        </button>
      </header>

      <section
        className="rafadroid-screen"
        aria-label={launcherOpen ? "Launcher de aplicativos" : activeAppTitle}
      >
        {launcherOpen ? (
          <div className="rafadroid-launcher">
            <header className="rafadroid-launcher__header">
              <p className="rafadroid-launcher__eyebrow">Pocket Edition</p>
              <h2>RafaDroid 1.7</h2>
              <p>Apps profissionais renderizados em modo telefone antigo.</p>
            </header>
            <div className="rafadroid-launcher__grid">
              {mobileApps.map((app) => {
                const Icon = app.icon;

                return (
                  <button
                    className={activeApp === app.id ? "is-active" : undefined}
                    key={app.id}
                    type="button"
                    onClick={() => openApp(app.id)}
                  >
                    <span>
                      <Icon size={22} strokeWidth={2.3} />
                    </span>
                    <strong>{app.label}</strong>
                    <small>{app.packageName}</small>
                    <em>{app.description}</em>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rafadroid-app-window">{renderActiveApp()}</div>
        )}
      </section>

      <footer className="rafadroid-softkeys" aria-label="Teclas do RafaDroid">
        <button type="button" onClick={() => setLauncherOpen((current) => !current)}>
          <Menu size={15} strokeWidth={2.4} />
          Menu
        </button>
        <button type="button" onClick={() => setLauncherOpen(true)}>
          <Home size={15} strokeWidth={2.4} />
          Início
        </button>
        <button type="button" onClick={() => setLauncherOpen(true)}>
          <ArrowLeft size={15} strokeWidth={2.4} />
          Voltar
        </button>
      </footer>

      {showAchievement ? (
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
