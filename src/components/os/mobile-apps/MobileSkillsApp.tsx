"use client";

import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { skillGroups } from "@/content/skills";
import { cn } from "@/lib/utils";

type MobileSkillsAppProps = {
  backSignal: number;
  onBackAvailabilityChange: (canGoBack: boolean) => void;
  onScreenChange: () => void;
};

export function MobileSkillsApp({
  backSignal,
  onBackAvailabilityChange,
  onScreenChange,
}: MobileSkillsAppProps) {
  const [detailGroupIndex, setDetailGroupIndex] = useState<number | null>(null);
  const previousBackSignal = useRef(backSignal);
  const selectedGroup =
    detailGroupIndex !== null ? skillGroups[detailGroupIndex] : null;

  useEffect(() => {
    onBackAvailabilityChange(detailGroupIndex !== null);
  }, [detailGroupIndex, onBackAvailabilityChange]);

  useEffect(() => {
    if (previousBackSignal.current === backSignal) return;

    previousBackSignal.current = backSignal;

    if (detailGroupIndex !== null) {
      const frame = window.requestAnimationFrame(() =>
        setDetailGroupIndex(null),
      );

      return () => window.cancelAnimationFrame(frame);
    }
  }, [backSignal, detailGroupIndex]);

  const closeGroup = () => {
    setDetailGroupIndex(null);
    onScreenChange();
  };

  const openGroup = (groupIndex: number) => {
    setDetailGroupIndex(groupIndex);
    onScreenChange();
  };

  if (selectedGroup) {
    return (
      <div className="mobile-app mobile-skills-app">
        <button className="mobile-app__back" type="button" onClick={closeGroup}>
          <ArrowLeft size={17} strokeWidth={2.4} />
          Habilidades
        </button>

        <article
          className="mobile-app__detail-screen"
          aria-labelledby="skill-detail"
        >
          <p className="mobile-app__kicker">Módulo selecionado</p>
          <h2 id="skill-detail">{selectedGroup.title}</h2>
          <span className="mobile-app__meta">{selectedGroup.levelLabel}</span>
          <p>{selectedGroup.note}</p>
          <div
            className="mobile-app__meter"
            aria-label={`Nível ${selectedGroup.level} de 5`}
          >
            <span style={{ width: `${(selectedGroup.level / 5) * 100}%` }} />
          </div>
          <div className="mobile-app__chips">
            {selectedGroup.skills.map((skill) => (
              <span key={skill.label}>
                {skill.label}
                {skill.status ? ` · ${skill.status}` : ""}
              </span>
            ))}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="mobile-app mobile-skills-app">
      <header className="mobile-app__hero mobile-app__hero--compact">
        <p className="mobile-app__kicker">Módulos ativos</p>
        <h2>Monitor de módulos</h2>
      </header>

      <section className="mobile-app__section" aria-labelledby="skill-modules">
        <div className="mobile-app__list mobile-app__list--dense" role="list">
          {skillGroups.map((group, index) => (
            <button
              className={cn(index === detailGroupIndex && "is-active")}
              key={group.title}
              type="button"
              onClick={() => openGroup(index)}
            >
              <strong>{group.title}</strong>
              <span>{group.description}</span>
              <small>{group.levelLabel}</small>
              <span className="mobile-app__meter" aria-hidden="true">
                <span style={{ width: `${(group.level / 5) * 100}%` }} />
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
