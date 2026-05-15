"use client";

import { FormEvent, useState } from "react";
import type { AppId } from "@/components/os/RafaelOS";

type CommandTerminalProps = {
  onActivateApp: (app: AppId) => void;
  onTriggerVirus: () => void;
};

const commandMap: Partial<Record<string, AppId>> = {
  home: "home",
  about: "home",
  projects: "projects",
  work: "projects",
  skills: "skills",
  timeline: "timeline",
  contact: "contact",
  recruiter: "recruiter",
  hire: "recruiter",
  missions: "missions",
  missoes: "missions",
  "missões": "missions",
};

export function CommandTerminal({ onActivateApp, onTriggerVirus }: CommandTerminalProps) {
  const [value, setValue] = useState("");
  const [lines, setLines] = useState([
    "terminal online.",
    "type HELP for commands."
  ]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const command = value.trim().toLowerCase();
    if (!command) return;

    if (command === "clear") {
      setLines([]);
      setValue("");
      return;
    }

    if (command === "help") {
      setLines((items) => [
        ...items,
        "> help",
        "commands: home, projects, skills, timeline, contact, recruiter, missions, virus, github, resume, clear",
      ]);
      setValue("");
      return;
    }

    if (command === "virus") {
      onTriggerVirus();
      setLines((items) => [...items, "> virus", "fake threat quarantined. clean architecture restored."]);
      setValue("");
      return;
    }

    if (command === "github") {
      window.open("https://github.com/rafaelprado-dev", "_blank", "noreferrer");
      setLines((items) => [...items, "> github", "opening remote repository..."]);
      setValue("");
      return;
    }

    if (command === "resume") {
      window.open("/rafael-prado-curriculo.pdf", "_blank", "noreferrer");
      setLines((items) => [...items, "> resume", "downloading resume.pdf..."]);
      setValue("");
      return;
    }

    const app = commandMap[command];
    if (app) {
      onActivateApp(app);
      setLines((items) => [...items, `> ${command}`, `opening ${app}.app...`]);
    } else {
      setLines((items) => [...items, `> ${command}`, "unknown command. type HELP."]);
    }

    setValue("");
  };

  return (
    <section className="terminal-panel" aria-label="Command terminal">
      <div className="terminal-panel__output" aria-live="polite">
        {lines.slice(-5).map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
      </div>
      <form onSubmit={submit}>
        <label htmlFor="command-input">&gt;</label>
        <input
          autoComplete="off"
          id="command-input"
          placeholder="type a command (help)"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </form>
    </section>
  );
}
