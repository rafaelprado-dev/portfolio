"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import type { AppId } from "@/components/os/RafaelOS";

type CommandTerminalProps = {
  onActivateApp: (app: AppId) => void;
  onTriggerVirus: () => void;
};

type TerminalLine = {
  text: string;
  tone?: "error";
};

const prompt = "RafaelOS:\\portfolio>";
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const bootSequence = [
  {
    delay: 160,
    lines: ["perfil detectando"],
  },
  {
    delay: 820,
    lines: ["perfil: Rafael Prado", "classe detectando"],
  },
  {
    delay: 1480,
    lines: [
      "perfil: Rafael Prado",
      "classe: Front-end Developer",
      "build detectando",
    ],
  },
  {
    delay: 2140,
    lines: [
      "perfil: Rafael Prado",
      "classe: Front-end Developer",
      "build atual: React - React Native - Next.js - TypeScript - Tailwind CSS",
    ],
  },
];

const helpLines = [
  "comandos disponíveis:",
  "",
  "scan       analisa o perfil",
  "stack      mostra habilidades",
  "projects   abre Projetos.app",
  "xp         abre Experiência.app",
  "hire       abre Recrutador.app",
  "bugfix     próxima atualização",
  "café       prepara café",
  "clear      limpa o console",
];

const scanMetrics = [
  { label: "arquitetura", target: 80 },
  { label: "segurança", target: 90 },
  { label: "back-end", target: 70 },
  { label: "front-end", target: 100 },
  { label: "componentização", target: 100 },
  { label: "ux-ui", target: 100 },
  { label: "testes", target: 60 },
  { label: "performance", target: 90 },
  { label: "acessibilidade", target: 100 },
  { label: "documentação", target: 100 },
  { label: "devops & ci/cd", target: 50 },
  { label: "escalabilidade", target: 90 },
];

const stackLines = [
  "core:",
  "React - React Native - Next.js - TypeScript - JavaScript ES6+",
  "",
  "interface:",
  "UX/UI - Acessibilidade - Design Systems - Performance - Tailwind CSS - Atomic Design",
  "",
  "dados:",
  "Firebase - APIs REST - Zustand - React Query - Zod",
  "",
  "extras:",
  "Expo - Ollama - Qwen - Automação local",
];

const bugfixLines = [
  "vai ser adicionado na próxima atualização!",
];

const toTerminalLines = (items: Array<string | TerminalLine>): TerminalLine[] =>
  items.map((item) => (typeof item === "string" ? { text: item } : item));

const formatScanLine = (label: string, value: number) => {
  const targetWidth = 21;
  const divider = "-".repeat(Math.max(2, targetWidth - label.length));

  return `${label} ${divider} ${String(value).padStart(3, " ")}%`;
};

export function CommandTerminal({
  onActivateApp,
  onTriggerVirus,
}: CommandTerminalProps) {
  const [value, setValue] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const hasUserInputRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      schedule(() => {
        setLines(toTerminalLines(bootSequence.at(-1)?.lines ?? []));
        setIsAnimating(false);
      }, 0);

      return clearTimers;
    }

    bootSequence.forEach((step, index) => {
      schedule(() => {
        if (!hasUserInputRef.current) {
          setLines(toTerminalLines(step.lines));

          if (index === bootSequence.length - 1) {
            setIsAnimating(false);
          }
        }
      }, step.delay);
    });

    return clearTimers;
  }, [clearTimers, schedule]);

  const renderCommand = (command: string, output: string[]) => {
    clearTimers();
    hasUserInputRef.current = true;
    setIsAnimating(false);
    setLines(toTerminalLines([`${prompt} ${command}`, ...output]));
  };

  const renderScan = () => {
    clearTimers();
    hasUserInputRef.current = true;

    const commandLine = `${prompt} scan`;
    const steps = 12;
    const renderProgress = (step: number) => {
      const progress = step / steps;
      const metricLines = scanMetrics.map(({ label, target }) =>
        formatScanLine(label, Math.round(target * progress)),
      );
      const statusLines =
        step === steps
          ? [
              "",
              "resultado: perfil compatível com produto, interfaces e front-end aplicado",
            ]
          : ["", "resultado: calculando compatibilidade"];

      setLines(toTerminalLines([
        commandLine,
        "analisando Rafael Prado",
        "",
        ...metricLines,
        ...statusLines,
      ]));
    };

    if (prefersReducedMotion()) {
      setIsAnimating(false);
      renderProgress(steps);
      return;
    }

    setIsAnimating(true);

    Array.from({ length: steps + 1 }, (_, step) => {
      schedule(() => {
        renderProgress(step);

        if (step === steps) {
          setIsAnimating(false);
        }
      }, step * 95);
    });
  };

  const renderCoffee = () => {
    clearTimers();
    hasUserInputRef.current = true;

    const commandLine = `${prompt} café`;
    const loadingFrames = [
      "preparando café",
      "preparando café.",
      "preparando café..",
      "preparando café...",
    ];

    const renderResult = () => {
      setLines(toTerminalLines([
        commandLine,
        "preparando café...",
        "",
        { text: "ERROR: café acabou", tone: "error" },
        "fallback aplicado: suco de abacaxi com hortelã",
      ]));
      setIsAnimating(false);
    };

    if (prefersReducedMotion()) {
      renderResult();
      return;
    }

    setIsAnimating(true);

    loadingFrames.forEach((frame, index) => {
      schedule(() => {
        setLines(toTerminalLines([commandLine, frame]));
      }, index * 260);
    });

    schedule(renderResult, loadingFrames.length * 260 + 280);
  };

  const openApp = (app: AppId) => {
    clearTimers();
    hasUserInputRef.current = true;
    setIsAnimating(false);
    setLines([]);
    onActivateApp(app);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const command = value.trim().toLowerCase();
    if (!command) return;

    if (command === "clear") {
      clearTimers();
      hasUserInputRef.current = true;
      setIsAnimating(false);
      setLines([]);
      setValue("");
      return;
    }

    if (command === "help") {
      renderCommand(command, helpLines);
      setValue("");
      return;
    }

    if (command === "scan") {
      renderScan();
      setValue("");
      return;
    }

    if (command === "stack") {
      renderCommand(command, stackLines);
      setValue("");
      return;
    }

    if (command === "projects") {
      openApp("projects");
      setValue("");
      return;
    }

    if (command === "xp") {
      openApp("timeline");
      setValue("");
      return;
    }

    if (command === "hire") {
      openApp("recruiter");
      setValue("");
      return;
    }

    if (command === "bugfix") {
      renderCommand(command, bugfixLines);
      setValue("");
      return;
    }

    if (command === "café" || command === "cafe") {
      renderCoffee();
      setValue("");
      return;
    }

    if (command === "virus") {
      onTriggerVirus();
      renderCommand(command, [
        "RafaelOS Defender acionado",
        "ameaça fictícia isolada",
      ]);
      setValue("");
      return;
    }

    renderCommand(command, ["comando não encontrado", "use help"]);
    setValue("");
  };

  return (
    <section className="terminal-panel" aria-label="RafaelOS Dev Console">
      <div className="terminal-panel__header">
        <strong>RafaelOS Dev Console</strong>
        <span>v1.0</span>
      </div>

      <div
        aria-busy={isAnimating}
        aria-live={isAnimating ? "off" : "polite"}
        className="terminal-panel__output"
      >
        {lines.map((line, index) => (
          <p className={line.tone === "error" ? "is-error" : undefined} key={`${line.text}-${index}`}>
            {line.text || "\u00a0"}
          </p>
        ))}
      </div>

      <form onSubmit={submit}>
        <label htmlFor="command-input">{prompt}</label>
        <input
          autoComplete="off"
          id="command-input"
          placeholder="digite help"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </form>
    </section>
  );
}
