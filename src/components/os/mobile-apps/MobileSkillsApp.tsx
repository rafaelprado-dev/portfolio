"use client";

import { useState } from "react";
import { skillGroups } from "@/content/skills";
import { cn } from "@/lib/utils";

const maxLevel = 5;

export function MobileSkillsApp() {
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const selectedGroup = skillGroups[selectedGroupIndex] ?? skillGroups[0];

  return (
    <div className="mobile-app mobile-skills-app">
      <header className="mobile-app__hero mobile-app__hero--compact">
        <p className="mobile-app__kicker">/habilidades.sys</p>
        <h2>Monitor de módulos</h2>
        <p>Competências agrupadas por foco técnico e nível de atuação.</p>
      </header>

      <section className="mobile-app__section" aria-labelledby="skill-modules">
        <h3 id="skill-modules">Módulos ativos</h3>
        <div className="mobile-app__list mobile-app__list--dense" role="list">
          {skillGroups.map((group, index) => (
            <button
              className={cn(index === selectedGroupIndex && "is-active")}
              key={group.title}
              type="button"
              onClick={() => setSelectedGroupIndex(index)}
            >
              <strong>{group.title}</strong>
              <span>{group.description}</span>
              <small>
                {"★".repeat(group.level)}
                {"☆".repeat(maxLevel - group.level)} · {group.levelLabel}
              </small>
            </button>
          ))}
        </div>
      </section>

      <section className="mobile-app__section mobile-app__detail" aria-labelledby="skill-detail">
        <p className="mobile-app__kicker">Módulo selecionado</p>
        <h3 id="skill-detail">{selectedGroup.title}</h3>
        <p>{selectedGroup.note}</p>
        <div className="mobile-app__chips">
          {selectedGroup.skills.map((skill) => (
            <span key={skill.label}>
              {skill.label}
              {skill.status ? ` · ${skill.status}` : ""}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
