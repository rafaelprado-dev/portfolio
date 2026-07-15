"use client";

import { useEffect, useMemo, useState } from "react";
import { BootLog } from "@/components/os/BootLog";

type BootScreenProps = {
  config: {
    title: string;
    subtitle: string;
    modules: Array<{
      label: string;
      total: number;
      entries: string[];
    }>;
  };
  onComplete: () => void;
};

export function BootScreen({ config, onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);

  const blocks = useMemo(() => Array.from({ length: 48 }), []);
  const visibleLogs = useMemo(() => {
    const logs: string[] = [];
    const moduleSpan = 100 / config.modules.length;

    config.modules.forEach((module, moduleIndex) => {
      const start = moduleIndex * moduleSpan;
      const localProgress = Math.max(
        0,
        Math.min(1, (progress - start) / moduleSpan),
      );

      if (localProgress <= 0 && moduleIndex > 0) return;

      const current = Math.max(
        1,
        Math.min(module.total, Math.round(localProgress * module.total)),
      );
      logs.push(`${module.label}: ${current} / ${module.total}`);

      const entryCount = Math.min(
        module.entries.length,
        Math.ceil(localProgress * module.entries.length),
      );
      module.entries.slice(0, entryCount).forEach((entry) => {
        logs.push(
          `${entry} ${Math.min(100, Math.max(8, Math.round(localProgress * 100)))}% [OK]`,
        );
      });
    });

    return logs;
  }, [config.modules, progress]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((value) => {
        const next = Math.min(100, value + Math.ceil(Math.random() * 4));
        return next;
      });
    }, 210);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = window.setTimeout(onComplete, 950);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [onComplete, progress]);

  return (
    <main className="boot-screen" aria-label="Tela de carregamento RafaelOS">
      <section className="boot-panel" aria-live="polite">
        <h1>{config.title}</h1>
        <p>{config.subtitle}</p>
        <p className="boot-panel__copy">
          Inicializando Rafael Prado
          <span className="loading-dots" aria-hidden="true" />
        </p>

        <div className="boot-panel__status">
          <span>Copiando arquivos para C:\RAFAELOS\PROFILE\RAFAEL_PRADO\</span>
          <div
            className="boot-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            {blocks.map((_, index) => (
              <span
                className={
                  index < Math.round((progress / 100) * blocks.length)
                    ? "is-loaded"
                    : undefined
                }
                key={index}
              />
            ))}
          </div>
          <strong>{progress}% concluído</strong>
        </div>

        <BootLog logs={visibleLogs} />
      </section>
    </main>
  );
}
