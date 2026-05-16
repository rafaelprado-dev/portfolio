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
import { ContactApp } from "@/components/os/apps/ContactApp";
import { HomeApp } from "@/components/os/apps/HomeApp";
import { MissionsApp } from "@/components/os/apps/MissionsApp";
import { ProjectsApp } from "@/components/os/apps/ProjectsApp";
import { RecruiterApp } from "@/components/os/apps/RecruiterApp";
import { SkillsApp } from "@/components/os/apps/SkillsApp";
import { TimelineApp } from "@/components/os/apps/TimelineApp";
import type { AppId } from "@/components/os/RafaelOS";
import { missions, type MissionId } from "@/content/missions";
import { projects } from "@/content/projects";
import { cn } from "@/lib/utils";

type MobileShellProps = {
  activeApp: AppId;
  onActivateApp: (app: AppId) => void;
};

type MobileAppShortcut = {
  id: AppId;
  label: string;
  packageName: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
};

const primaryApps: MobileAppShortcut[] = [
  {
    id: "home",
    label: "Perfil",
    packageName: "perfil.apk",
    icon: Home,
  },
  {
    id: "projects",
    label: "Projetos",
    packageName: "projetos.apk",
    icon: FolderKanban,
  },
  {
    id: "skills",
    label: "Habilidades",
    packageName: "habilidades.apk",
    icon: Wrench,
  },
  {
    id: "timeline",
    label: "Trajeto",
    packageName: "trajeto.apk",
    icon: BriefcaseBusiness,
  },
  {
    id: "contact",
    label: "Contato",
    packageName: "contato.apk",
    icon: Mail,
  },
];

const drawerApps: MobileAppShortcut[] = [
  ...primaryApps,
  {
    id: "recruiter",
    label: "Recrutador",
    packageName: "recrutador.apk",
    icon: UserRound,
  },
  {
    id: "missions",
    label: "Missões",
    packageName: "missions.apk",
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [, setViewedProjectIndexes] = useState<Set<number>>(
    () => new Set(),
  );
  const [completedMissionIds, setCompletedMissionIds] = useState<Set<MissionId>>(
    () => new Set(["about"]),
  );
  const [showAchievement, setShowAchievement] = useState(true);
  const [now, setNow] = useState(() => new Date());

  const missionProgress = Math.round((completedMissionIds.size / missions.length) * 100);
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
    setDrawerOpen(false);
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
          <small>RafaDroid 1.7</small>
          <h1>{drawerOpen ? "Apps" : activeAppTitle}</h1>
        </div>
        <button
          aria-label={drawerOpen ? "Fechar launcher" : "Abrir launcher"}
          className="rafadroid-icon-button"
          type="button"
          onClick={() => setDrawerOpen((current) => !current)}
        >
          {drawerOpen ? <ArrowLeft size={18} /> : <Grid3X3 size={18} />}
        </button>
      </header>

      <section className="rafadroid-screen" aria-label={drawerOpen ? "Gaveta de aplicativos" : activeAppTitle}>
        {drawerOpen ? (
          <div className="rafadroid-launcher">
            <p className="rafadroid-launcher__hint">
              gaveta de aplicativos instalada para tela pequena
            </p>
            <div className="rafadroid-launcher__grid">
              {drawerApps.map((app) => {
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
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rafadroid-app-window">
            {activeApp === "home" ? <HomeApp /> : null}
            {activeApp === "projects" ? (
              <ProjectsApp
                initialProjectIndex={selectedProjectIndex}
                onProjectSelect={handleProjectSelect}
              />
            ) : null}
            {activeApp === "skills" ? <SkillsApp /> : null}
            {activeApp === "timeline" ? <TimelineApp /> : null}
            {activeApp === "contact" ? <ContactApp /> : null}
            {activeApp === "recruiter" ? <RecruiterApp /> : null}
            {activeApp === "missions" ? (
              <MissionsApp
                completedMissionIds={completedMissionIds}
                completionPercent={missionProgress}
              />
            ) : null}
          </div>
        )}
      </section>

      <nav className="rafadroid-dock" aria-label="Aplicativos principais">
        {primaryApps.map((app) => {
          const Icon = app.icon;

          return (
            <button
              aria-label={app.label}
              className={cn(activeApp === app.id && !drawerOpen && "is-active")}
              key={app.id}
              type="button"
              onClick={() => openApp(app.id)}
            >
              <Icon size={19} strokeWidth={2.3} />
              <span>{app.label}</span>
            </button>
          );
        })}
      </nav>

      <footer className="rafadroid-softkeys" aria-label="Teclas do RafaDroid">
        <button type="button" onClick={() => setDrawerOpen((current) => !current)}>
          <Menu size={15} strokeWidth={2.4} />
          Menu
        </button>
        <button type="button" onClick={() => openApp("home")}>
          <Home size={15} strokeWidth={2.4} />
          Início
        </button>
        <button type="button" onClick={() => setDrawerOpen(false)}>
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
