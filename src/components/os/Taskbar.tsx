"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { AppId } from "@/components/os/RafaelOS";
import type { WindowId } from "@/components/os/useWindowManager";
import { cn } from "@/lib/utils";

export type TaskbarItem = {
  id: WindowId;
  label: string;
  isActive: boolean;
  isMinimized: boolean;
};

type TaskbarProps = {
  onActivateApp: (app: AppId) => void;
  onToggleWindow: (windowId: WindowId) => void;
  items: TaskbarItem[];
  missionProgress: number;
};

const formatClock = (date: Date) => {
  const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "short" })
    .format(date)
    .replace(".", "");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${weekday} ${day}/${month} ${hour}:${minute}`;
};

export function Taskbar({
  onActivateApp,
  onToggleWindow,
  items,
  missionProgress,
}: TaskbarProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <footer className="taskbar" aria-label="RafaelOS taskbar">
      <button className="taskbar__start" type="button" onClick={() => onActivateApp("home")}>
        RafaelOS
      </button>
      <div className="taskbar__apps" aria-label="Janelas abertas">
        {items.map((item) => (
          <button
            className={cn(
              "taskbar__app",
              item.isActive && "is-active",
              item.isMinimized && "is-minimized",
            )}
            key={item.id}
            type="button"
            onClick={() => onToggleWindow(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <button
        className="taskbar__mission"
        style={{ "--mission-progress": `${missionProgress}%` } as CSSProperties}
        type="button"
        onClick={() => onActivateApp("missions")}
      >
        <span>Perfil analisado</span>
        <strong>{missionProgress}%</strong>
      </button>
      <time className="taskbar__clock" dateTime={now.toISOString()}>
        {formatClock(now)}
      </time>
    </footer>
  );
}
