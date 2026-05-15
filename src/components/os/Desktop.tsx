"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { ContactApp } from "@/components/os/apps/ContactApp";
import { DoomApp } from "@/components/os/apps/DoomApp";
import { HomeApp } from "@/components/os/apps/HomeApp";
import { MissionsApp } from "@/components/os/apps/MissionsApp";
import { ProjectsApp } from "@/components/os/apps/ProjectsApp";
import { RecruiterApp } from "@/components/os/apps/RecruiterApp";
import { SkillsApp } from "@/components/os/apps/SkillsApp";
import { TimelineApp } from "@/components/os/apps/TimelineApp";
import { WallpaperApp } from "@/components/os/apps/WallpaperApp";
import { CommandTerminal } from "@/components/os/CommandTerminal";
import {
  DesktopIcon,
  type DesktopIconKind,
  type DesktopIconPosition,
} from "@/components/os/DesktopIcon";
import { Taskbar, type TaskbarItem } from "@/components/os/Taskbar";
import { useWindowManager, type WindowId } from "@/components/os/useWindowManager";
import { WindowFrame } from "@/components/os/WindowFrame";
import type { AppId } from "@/components/os/RafaelOS";
import { missions, type MissionId } from "@/content/missions";
import { projects } from "@/content/projects";
import { wallpapers } from "@/content/wallpapers";

const projectSelectorLabels: Record<string, string> = {
  Arcadium: "GCDP",
  Luna: "Luna",
  Bordo: "Bordo",
  RDNS: "RDNS",
};

type AchievementId =
  | "organized"
  | "recruiter"
  | "doom"
  | "contact"
  | "virus"
  | "projectExplorer"
  | "missionComplete";

const achievements: Record<AchievementId, { title: string; description: string }> = {
  organized: {
    title: "Mania de organização",
    description: "Você alinhou a bagunça do desktop.",
  },
  recruiter: {
    title: "Modo recrutador",
    description: "Diagnóstico profissional executado com sucesso.",
  },
  doom: {
    title: "Tudo roda DOOM",
    description: "Inclusive este portfólio.",
  },
  contact: {
    title: "Conexão estabelecida",
    description: "Canal de contato aberto.",
  },
  virus: {
    title: "Segurança em primeiro lugar",
    description: "Ameaça falsa isolada sem quebrar o layout.",
  },
  projectExplorer: {
    title: "Curioso profissional",
    description: "Todos os cases principais foram inspecionados.",
  },
  missionComplete: {
    title: "Portfólio 100% explorado",
    description: "Recrutador resistente a interface genérica detectado.",
  },
};

type DesktopProps = {
  activeApp: AppId;
  glitchLevel: number;
  virusAlerts: string[];
  onActivateApp: (app: AppId) => void;
  onTriggerVirus: () => void;
};

type DesktopShortcutId =
  | "about"
  | "gcdp"
  | "luna"
  | "bordo"
  | "rdns"
  | "skills"
  | "timeline"
  | "resume"
  | "cmd"
  | "doom"
  | "missions"
  | "recruiter"
  | "virus"
  | "wallpaper";

type DesktopShortcut = {
  id: DesktopShortcutId;
  label: string;
  kind: DesktopIconKind;
  position: DesktopIconPosition;
  onOpen: () => void;
};

const navigationApps: Array<{ id: AppId; title: string }> = [
  { id: "home", title: "Sobre" },
  { id: "projects", title: "Projetos" },
  { id: "skills", title: "Habilidades" },
  { id: "timeline", title: "Experiência" },
  { id: "contact", title: "Contato" },
];

const appTitleById: Record<AppId, string> = {
  home: "Sobre",
  projects: "Projetos",
  skills: "Habilidades",
  timeline: "Experiência",
  contact: "Contato",
  recruiter: "Recrutador",
  missions: "Missões",
};

const mainWindowSizeByApp: Record<AppId, "mini" | "compact" | "standard" | "large"> = {
  home: "compact",
  projects: "large",
  skills: "large",
  timeline: "large",
  contact: "compact",
  recruiter: "standard",
  missions: "standard",
};

const referenceViewport = {
  width: 1920,
  height: 963,
};

const desktopIconStorageKey = "rafaelos.desktop.icons.v1";
const wallpaperStorageKey = "rafaelos.wallpaper";

const scalePosition = (x: number, y: number): DesktopIconPosition => {
  if (typeof window === "undefined") return { x, y };

  return {
    x: Math.round((window.innerWidth / referenceViewport.width) * x),
    y: Math.round((window.innerHeight / referenceViewport.height) * y),
  };
};

const clampPosition = (position: DesktopIconPosition): DesktopIconPosition => {
  if (typeof window === "undefined") return position;

  return {
    x: Math.min(Math.max(position.x, 8), window.innerWidth - 132),
    y: Math.min(Math.max(position.y, 48), window.innerHeight - 132),
  };
};

const getDefaultIconPositions = (): Record<DesktopShortcutId, DesktopIconPosition> => ({
  about: clampPosition(scalePosition(728, 724)),
  gcdp: clampPosition(scalePosition(398, 538)),
  luna: clampPosition(scalePosition(112, 664)),
  bordo: clampPosition(scalePosition(156, 246)),
  rdns: clampPosition(scalePosition(586, 294)),
  skills: clampPosition(scalePosition(862, 140)),
  timeline: clampPosition(scalePosition(1018, 410)),
  resume: clampPosition(scalePosition(1188, 724)),
  cmd: clampPosition(scalePosition(1410, 278)),
  doom: clampPosition(scalePosition(1502, 654)),
  missions: clampPosition(scalePosition(1320, 566)),
  recruiter: clampPosition(scalePosition(1240, 142)),
  virus: clampPosition(scalePosition(1586, 466)),
  wallpaper: clampPosition(scalePosition(1580, 98)),
});

const getDefaultWindowPositions = (): Record<WindowId, DesktopIconPosition> => {
  if (typeof window === "undefined") {
    return {
      navigation: { x: 706, y: 18 },
      selector: { x: 18, y: 18 },
      main: { x: 576, y: 220 },
      terminal: { x: 578, y: 420 },
      wallpapers: { x: 616, y: 170 },
      doom: { x: 420, y: 96 },
    };
  }

  const navWidth = Math.min(512, window.innerWidth - 32);
  const mainWidth = Math.min(768, window.innerWidth * 0.58);
  const mainHeight = Math.min(window.innerHeight * 0.54, 496);
  const doomWidth = Math.min(688, window.innerWidth - 24);
  const doomHeight = Math.min(638, window.innerHeight - 72);

  return {
    navigation: {
      x: Math.round((window.innerWidth - navWidth) / 2),
      y: 18,
    },
    selector: { x: 18, y: 18 },
    main: {
      x: Math.round((window.innerWidth - mainWidth) / 2),
      y: Math.max(128, Math.round((window.innerHeight - mainHeight - 44) / 2)),
    },
    terminal: clampPosition(scalePosition(578, 420)),
    wallpapers: {
      x: Math.round((window.innerWidth - Math.min(704, window.innerWidth - 32)) / 2),
      y: Math.max(68, Math.round((window.innerHeight - Math.min(window.innerHeight * 0.62, 496) - 44) / 2)),
    },
    doom: {
      x: Math.round((window.innerWidth - doomWidth) / 2),
      y: Math.max(
        44,
        Math.round((window.innerHeight - doomHeight - 44) / 2),
      ),
    },
  };
};

const readStoredIconPositions = () => {
  const defaults = getDefaultIconPositions();

  if (typeof window === "undefined") return defaults;

  try {
    const parsed = JSON.parse(window.localStorage.getItem(desktopIconStorageKey) ?? "null") as
      | Partial<Record<DesktopShortcutId, DesktopIconPosition>>
      | null;

    if (!parsed) return defaults;

    return Object.fromEntries(
      Object.entries(defaults).map(([id, fallback]) => {
        const position = parsed[id as DesktopShortcutId];

        return [
          id,
          typeof position?.x === "number" && typeof position.y === "number"
            ? clampPosition(position)
            : fallback,
        ];
      }),
    ) as Record<DesktopShortcutId, DesktopIconPosition>;
  } catch {
    return defaults;
  }
};

const isOrganizedCluster = (positions: Record<DesktopShortcutId, DesktopIconPosition>) => {
  const points = Object.values(positions);
  const minX = Math.min(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxX = Math.max(...points.map((point) => point.x));
  const maxY = Math.max(...points.map((point) => point.y));
  const grid = 96;
  const tolerance = 14;
  const isCompact = maxX - minX <= 390 && maxY - minY <= 520;
  const isGridAligned = points.every((point) => {
    const xOffset = Math.abs((point.x - minX) % grid);
    const yOffset = Math.abs((point.y - minY) % grid);

    return (
      Math.min(xOffset, grid - xOffset) <= tolerance &&
      Math.min(yOffset, grid - yOffset) <= tolerance
    );
  });

  return isCompact && isGridAligned;
};

export function Desktop({
  activeApp,
  glitchLevel,
  virusAlerts,
  onActivateApp,
  onTriggerVirus,
}: DesktopProps) {
  const [iconPositions, setIconPositions] = useState(readStoredIconPositions);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [viewedProjectIndexes, setViewedProjectIndexes] = useState<Set<number>>(
    () => new Set(),
  );
  const [completedMissionIds, setCompletedMissionIds] = useState<Set<MissionId>>(
    () => new Set(["about"]),
  );
  const [, setUnlockedAchievements] = useState<Set<AchievementId>>(
    () => new Set(),
  );
  const [visibleAchievement, setVisibleAchievement] = useState<AchievementId | null>(
    null,
  );
  const [selectedWallpaperId, setSelectedWallpaperId] = useState(() => {
    const fallback = wallpapers[0]?.id ?? "";

    if (typeof window === "undefined") {
      return fallback;
    }

    const savedWallpaperId = window.localStorage.getItem(wallpaperStorageKey);

    return savedWallpaperId && wallpapers.some((wallpaper) => wallpaper.id === savedWallpaperId)
      ? savedWallpaperId
      : fallback;
  });
  const {
    windows,
    openWindow,
    focusWindow,
    minimizeWindow,
    closeWindow,
  } = useWindowManager();
  const windowPositions = useMemo(() => getDefaultWindowPositions(), []);

  const title = appTitleById[activeApp];
  const mainWindowSize = mainWindowSizeByApp[activeApp];
  const missionProgress = Math.round((completedMissionIds.size / missions.length) * 100);

  useEffect(() => {
    if (!visibleAchievement) return;

    const timer = window.setTimeout(() => setVisibleAchievement(null), 5200);

    return () => window.clearTimeout(timer);
  }, [visibleAchievement]);

  const selectedWallpaper = wallpapers.find((wallpaper) => wallpaper.id === selectedWallpaperId);
  const desktopStyle = {
    "--desktop-wallpaper": selectedWallpaper ? `url(${selectedWallpaper.src})` : "none",
  } as CSSProperties;

  const unlockAchievement = (achievementId: AchievementId) => {
    setUnlockedAchievements((current) => {
      if (current.has(achievementId)) return current;

      const next = new Set(current);
      next.add(achievementId);
      setVisibleAchievement(achievementId);

      return next;
    });
  };

  const completeMission = (missionId: MissionId) => {
    if (completedMissionIds.has(missionId)) return;

    const next = new Set(completedMissionIds);
    next.add(missionId);
    setCompletedMissionIds(next);

    if (next.size >= missions.length) {
      unlockAchievement("missionComplete");
    }
  };

  const activateApp = (app: AppId) => {
    onActivateApp(app);
    openWindow("main");

    const missionByApp: Partial<Record<AppId, MissionId>> = {
      home: "about",
      skills: "skills",
      timeline: "timeline",
      contact: "contact",
      recruiter: "recruiter",
    };
    const missionId = missionByApp[app];

    if (missionId) {
      completeMission(missionId);
    }

    if (app === "contact") {
      unlockAchievement("contact");
    }

    if (app === "recruiter") {
      unlockAchievement("recruiter");
    }
  };

  const markProjectViewed = (projectIndex: number) => {
    const next = new Set(viewedProjectIndexes);
    next.add(projectIndex);
    setViewedProjectIndexes(next);
    completeMission("project");

    if (next.size >= projects.length) {
      unlockAchievement("projectExplorer");
      completeMission("allProjects");
    }
  };

  const selectProject = (projectIndex: number) => {
    setSelectedProjectIndex(projectIndex);
    markProjectViewed(projectIndex);
  };

  const activateProject = (projectIndex: number) => {
    selectProject(projectIndex);
    activateApp("projects");
  };

  const selectWallpaper = (wallpaperId: string) => {
    setSelectedWallpaperId(wallpaperId);
    window.localStorage.setItem(wallpaperStorageKey, wallpaperId);
  };

  const openDoom = () => {
    openWindow("doom");
    unlockAchievement("doom");
    completeMission("doom");
  };

  const triggerVirusScan = () => {
    onTriggerVirus();
    unlockAchievement("virus");
    completeMission("virus");
  };

  const updateIconPosition = (id: DesktopShortcutId, position: DesktopIconPosition) => {
    setIconPositions((current) => ({
      ...current,
      [id]: position,
    }));
  };

  const finishIconMove = (id: DesktopShortcutId, position: DesktopIconPosition) => {
    const nextPositions = {
      ...iconPositions,
      [id]: position,
    };

    window.localStorage.setItem(desktopIconStorageKey, JSON.stringify(nextPositions));

    if (!isOrganizedCluster(nextPositions)) return;

    unlockAchievement("organized");
  };

  const shortcuts: DesktopShortcut[] = [
    {
      id: "about",
      label: "sobre.exe",
      kind: "folder",
      position: iconPositions.about,
      onOpen: () => activateApp("home"),
    },
    {
      id: "gcdp",
      label: "gcdp.case",
      kind: "case",
      position: iconPositions.gcdp,
      onOpen: () => activateProject(0),
    },
    {
      id: "luna",
      label: "luna.ai",
      kind: "case",
      position: iconPositions.luna,
      onOpen: () => activateProject(1),
    },
    {
      id: "bordo",
      label: "bordo.guild",
      kind: "case",
      position: iconPositions.bordo,
      onOpen: () => activateProject(2),
    },
    {
      id: "rdns",
      label: "rdns.net",
      kind: "case",
      position: iconPositions.rdns,
      onOpen: () => activateProject(3),
    },
    {
      id: "skills",
      label: "skills.tree",
      kind: "tree",
      position: iconPositions.skills,
      onOpen: () => activateApp("skills"),
    },
    {
      id: "timeline",
      label: "trajeto.log",
      kind: "folder",
      position: iconPositions.timeline,
      onOpen: () => activateApp("timeline"),
    },
    {
      id: "resume",
      label: "contato.pdf",
      kind: "pdf",
      position: iconPositions.resume,
      onOpen: () => {
        activateApp("contact");
        unlockAchievement("contact");
      },
    },
    {
      id: "cmd",
      label: "cmd.exe",
      kind: "cmd",
      position: iconPositions.cmd,
      onOpen: () => openWindow("terminal"),
    },
    {
      id: "doom",
      label: "doom.exe",
      kind: "doom",
      position: iconPositions.doom,
      onOpen: openDoom,
    },
    {
      id: "missions",
      label: "missões.sys",
      kind: "mission",
      position: iconPositions.missions,
      onOpen: () => activateApp("missions"),
    },
    {
      id: "recruiter",
      label: "recrutador.exe",
      kind: "diagnostic",
      position: iconPositions.recruiter,
      onOpen: () => {
        activateApp("recruiter");
        unlockAchievement("recruiter");
      },
    },
    {
      id: "virus",
      label: "vírus-scan.exe",
      kind: "shield",
      position: iconPositions.virus,
      onOpen: triggerVirusScan,
    },
    {
      id: "wallpaper",
      label: "wallpaper.cpl",
      kind: "wallpaper",
      position: iconPositions.wallpaper,
      onOpen: () => openWindow("wallpapers"),
    },
  ];

  const topWindowId = useMemo(() => {
    return (Object.entries(windows) as Array<[WindowId, (typeof windows)[WindowId]]>)
      .filter(([, window]) => window.status === "open")
      .sort((a, b) => b[1].zIndex - a[1].zIndex)[0]?.[0];
  }, [windows]);

  const taskbarItems: TaskbarItem[] = useMemo(() => {
    const labels: Record<WindowId, string> = {
      navigation: "Navegação",
      selector: "Principais Projetos",
      main: `${title}.app`,
      terminal: "cmd.exe",
      wallpapers: "wallpaper.cpl",
      doom: "doom.exe",
    };

    return (Object.entries(windows) as Array<[WindowId, (typeof windows)[WindowId]]>)
      .filter(([, window]) => window.status !== "closed")
      .map(([id, window]) => ({
        id,
        label: labels[id],
        isActive: topWindowId === id,
        isMinimized: window.status === "minimized",
      }));
  }, [title, topWindowId, windows]);

  const toggleTaskbarWindow = (windowId: WindowId) => {
    const window = windows[windowId];

    if (!window) return;

    if (window.status === "minimized") {
      openWindow(windowId);
      return;
    }

    if (window.status === "open") {
      minimizeWindow(windowId);
      return;
    }

    openWindow(windowId);
  };

  return (
    <main
      id="conteudo"
      aria-label="RafaelOS portfolio desktop"
      className={`rafaelos-desktop glitch-${glitchLevel}`}
      style={desktopStyle}
    >
      <div className="stars" aria-hidden="true" />

      {windows.navigation.status === "open" ? (
        <WindowFrame
          bodyClassName="system-window__body nav-window__body"
          className="nav-window"
          defaultPosition={windowPositions.navigation}
          storageKey="rafaelos.window.navigation.v1"
          title="Navegação"
          zIndex={windows.navigation.zIndex}
          onClose={() => closeWindow("navigation")}
          onFocus={() => focusWindow("navigation")}
          onMinimize={() => minimizeWindow("navigation")}
        >
          {navigationApps.map((app) => (
            <button
              className={activeApp === app.id ? "is-active" : undefined}
              key={app.id}
              type="button"
              onClick={() => activateApp(app.id)}
            >
              {app.title}
            </button>
          ))}
        </WindowFrame>
      ) : null}

      {windows.selector.status === "open" ? (
        <WindowFrame
          bodyClassName="system-window__body project-selector__body"
          className="project-selector"
          defaultPosition={windowPositions.selector}
          storageKey="rafaelos.window.selector.v1"
          title="Principais Projetos"
          zIndex={windows.selector.zIndex}
          onClose={() => closeWindow("selector")}
          onFocus={() => focusWindow("selector")}
          onMinimize={() => minimizeWindow("selector")}
        >
          <button type="button" onClick={() => activateProject(0)}>
            Ver todos
          </button>
          <div className="project-selector__grid">
            {projects.map((project, index) => (
              <button key={project.name} type="button" onClick={() => activateProject(index)}>
                {projectSelectorLabels[project.name.split(" ")[0]] ?? project.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </WindowFrame>
      ) : null}

      <div className="desktop-icons-layer" aria-label="Desktop shortcuts">
        {shortcuts.map((shortcut) => (
          <DesktopIcon
            key={shortcut.id}
            kind={shortcut.kind}
            label={shortcut.label}
            position={shortcut.position}
            onMove={(position) => updateIconPosition(shortcut.id, position)}
            onMoveEnd={(position) => finishIconMove(shortcut.id, position)}
            onOpen={shortcut.onOpen}
          />
        ))}
      </div>

      {windows.main.status === "open" ? (
        <WindowFrame
          className={`main-window main-window--${mainWindowSize}`}
          defaultPosition={windowPositions.main}
          scrollable={
            activeApp !== "projects" &&
            activeApp !== "skills" &&
            activeApp !== "timeline" &&
            activeApp !== "contact" &&
            activeApp !== "recruiter" &&
            activeApp !== "missions"
          }
          storageKey="rafaelos.window.main.v1"
          title={`${title}.app`}
          zIndex={windows.main.zIndex}
          onClose={() => closeWindow("main")}
          onFocus={() => focusWindow("main")}
          onMinimize={() => minimizeWindow("main")}
        >
          {activeApp === "home" ? <HomeApp /> : null}
          {activeApp === "projects" ? (
            <ProjectsApp
              initialProjectIndex={selectedProjectIndex}
              onProjectSelect={selectProject}
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
        </WindowFrame>
      ) : null}

      {windows.terminal.status === "open" ? (
        <WindowFrame
          bodyClassName="system-window__body cmd-window__body"
          className="cmd-window"
          defaultPosition={windowPositions.terminal}
          storageKey="rafaelos.window.terminal.v1"
          title="cmd.exe"
          zIndex={windows.terminal.zIndex}
          onClose={() => closeWindow("terminal")}
          onFocus={() => focusWindow("terminal")}
          onMinimize={() => minimizeWindow("terminal")}
        >
          <CommandTerminal onActivateApp={activateApp} onTriggerVirus={triggerVirusScan} />
        </WindowFrame>
      ) : null}

      {windows.wallpapers.status === "open" ? (
        <WindowFrame
          bodyClassName="system-window__body wallpaper-window__body"
          className="wallpaper-window"
          defaultPosition={windowPositions.wallpapers}
          storageKey="rafaelos.window.wallpapers.v2"
          title="wallpaper.cpl"
          zIndex={windows.wallpapers.zIndex}
          onClose={() => closeWindow("wallpapers")}
          onFocus={() => focusWindow("wallpapers")}
          onMinimize={() => minimizeWindow("wallpapers")}
        >
          <WallpaperApp
            selectedWallpaperId={selectedWallpaperId}
            onSelectWallpaper={selectWallpaper}
          />
        </WindowFrame>
      ) : null}

      {windows.doom.status === "open" ? (
        <WindowFrame
          bodyClassName="system-window__body doom-window__body"
          className="doom-window"
          defaultPosition={windowPositions.doom}
          storageKey="rafaelos.window.doom.v2"
          title="doom.exe"
          zIndex={windows.doom.zIndex}
          onClose={() => closeWindow("doom")}
          onFocus={() => focusWindow("doom")}
          onMinimize={() => minimizeWindow("doom")}
        >
          <DoomApp />
        </WindowFrame>
      ) : null}

      <div className="virus-stack" aria-live="polite">
        {virusAlerts.map((alert) => (
          <div className="window virus-alert" key={alert}>
            <div className="title-bar">
              <div className="title-bar-text">RafaelOS Defender</div>
            </div>
            <div className="window-body">
              <strong>{alert}</strong>
              <p>Architecture shield: active. WCAG scanner: online.</p>
            </div>
          </div>
        ))}
      </div>

      {visibleAchievement ? (
        <div className="achievement-toast" role="status">
          <span aria-hidden="true" />
          <div>
            <small>Conquista desbloqueada</small>
            <strong>{achievements[visibleAchievement].title}</strong>
            <p>{achievements[visibleAchievement].description}</p>
          </div>
        </div>
      ) : null}

      <Taskbar
        items={taskbarItems}
        missionProgress={missionProgress}
        onActivateApp={activateApp}
        onToggleWindow={toggleTaskbarWindow}
      />
    </main>
  );
}
