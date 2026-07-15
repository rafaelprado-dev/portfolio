"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type RafaDroidBootScreenProps = {
  onComplete: () => void;
};

const bootLines = [
  {
    module: "bootloader",
    message: "iniciando RafaDroid 1.7 Pocket Edition",
  },
  {
    module: "kernel",
    message: "montando /system/portfolio/rafael-prado",
  },
  {
    module: "storage",
    message: "carregando perfil.db, projetos.db e experiência.db",
  },
  {
    module: "package",
    message: "validando perfil.apk, projetos.apk e contato.apk",
  },
  {
    module: "service",
    message: "ativando provedores de habilidades e missões",
  },
  {
    module: "graphics",
    message: "ajustando densidade para tela de bolso",
  },
  {
    module: "cleanup",
    message: "removendo SplashGenericoActivity",
  },
  {
    module: "launcher",
    message: "liberando gaveta de aplicativos",
  },
];

export function RafaDroidBootScreen({ onComplete }: RafaDroidBootScreenProps) {
  const [progress, setProgress] = useState(0);
  const logRef = useRef<HTMLDivElement>(null);
  const visibleLines = useMemo(() => {
    const lineCount = Math.max(
      1,
      Math.ceil((progress / 100) * bootLines.length),
    );

    return bootLines.slice(0, lineCount);
  }, [progress]);

  useEffect(() => {
    const log = logRef.current;

    if (!log) return;

    log.scrollTop = log.scrollHeight;
  }, [visibleLines]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((value) => Math.min(100, value + 5));
    }, 180);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 100) return undefined;

    const timer = window.setTimeout(onComplete, 700);

    return () => window.clearTimeout(timer);
  }, [onComplete, progress]);

  return (
    <main
      className="rafadroid-boot-screen"
      aria-label="Tela de carregamento RafaDroid"
    >
      <section className="rafadroid-boot-panel" aria-live="polite">
        <div className="rafadroid-boot-panel__top">
          <div className="rafadroid-mascot" aria-label="Mascote do RafaDroid">
            <span className="rafadroid-mascot__antenna rafadroid-mascot__antenna--left" />
            <span className="rafadroid-mascot__antenna rafadroid-mascot__antenna--right" />
            <span className="rafadroid-mascot__arm rafadroid-mascot__arm--left" />
            <span className="rafadroid-mascot__arm rafadroid-mascot__arm--right" />
            <span className="rafadroid-mascot__body">
              <span className="rafadroid-mascot__eye rafadroid-mascot__eye--left" />
              <span className="rafadroid-mascot__eye rafadroid-mascot__eye--right" />
              <span className="rafadroid-mascot__mouth" />
            </span>
          </div>

          <div>
            <p className="rafadroid-boot-panel__eyebrow">Pocket Edition</p>
            <h1>RafaDroid 1.7</h1>
          </div>
        </div>

        <div
          className="rafadroid-boot-progress"
          role="progressbar"
          aria-label="Progresso de inicialização do RafaDroid"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progress}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
        <strong className="rafadroid-boot-progress-label">
          {progress}% preparado
        </strong>

        <div className="rafadroid-boot-log" ref={logRef}>
          {visibleLines.map((line) => (
            <p key={line.module}>
              <span aria-hidden="true">#</span>
              <strong>{line.module}:</strong>
              {line.message}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
