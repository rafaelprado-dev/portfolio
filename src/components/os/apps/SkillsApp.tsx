"use client";

import { useEffect, useRef, useState } from "react";
import { skillGroups } from "@/content/skills";

const maxStars = 5;

export function SkillsApp() {
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const selectedGroup = skillGroups[selectedGroupIndex] ?? skillGroups[0];
  const detailsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    detailsRef.current?.scrollTo({ top: 0 });
  }, [selectedGroupIndex]);

  return (
    <section className="app-screen skills-app" aria-labelledby="skills-title">
      <p className="app-kicker">/skills.tree</p>
      <h2 id="skills-title">Árvore de Habilidades</h2>

      <div className="skills-explorer" aria-label="Árvore de habilidades">
        <nav className="skills-explorer__list" aria-label="Categorias de habilidade">
          <strong>Módulos</strong>
          {skillGroups.map((group, index) => (
            <button
              aria-pressed={selectedGroupIndex === index}
              className={selectedGroupIndex === index ? "is-active" : undefined}
              key={group.title}
              type="button"
              onClick={() => setSelectedGroupIndex(index)}
            >
              <span>{group.title}</span>
              <small>{group.levelLabel}</small>
            </button>
          ))}
        </nav>

        <article
          className="skill-details"
          ref={detailsRef}
          aria-labelledby="skill-details-title"
          aria-live="polite"
        >
          <div className="skill-details__rating" aria-label={`${selectedGroup.level} de ${maxStars} estrelas: ${selectedGroup.levelLabel}`}>
            {Array.from({ length: maxStars }, (_, index) => (
              <span
                aria-hidden="true"
                className={index < selectedGroup.level ? "is-filled" : undefined}
                key={index}
              >
                ★
              </span>
            ))}
            <strong>{selectedGroup.levelLabel}</strong>
          </div>

          <h3 id="skill-details-title">{selectedGroup.title}</h3>
          <p>{selectedGroup.description}</p>
          <p className="skill-details__note">{selectedGroup.note}</p>

          <section aria-labelledby="skill-modules-title">
            <h4 id="skill-modules-title">Tecnologias e competências</h4>
            <div className="skill-details__modules">
              {selectedGroup.skills.map((skill) => (
                <span className="skill-chip" key={skill.label}>
                  {skill.label}
                  {skill.status ? <small>{skill.status}</small> : null}
                </span>
              ))}
            </div>
          </section>
        </article>
      </div>
    </section>
  );
}
