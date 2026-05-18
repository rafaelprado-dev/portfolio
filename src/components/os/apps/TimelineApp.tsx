"use client";

import { useEffect, useRef, useState } from "react";
import { education } from "@/content/education";
import { experiences } from "@/content/experience";

type TimelineMode = "professional" | "education";

export function TimelineApp() {
  const [mode, setMode] = useState<TimelineMode>("professional");
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState(0);
  const [selectedEducationIndex, setSelectedEducationIndex] = useState(0);
  const selectedExperience =
    experiences[selectedExperienceIndex] ?? experiences[0];
  const selectedEducation = education[selectedEducationIndex] ?? education[0];
  const detailsRef = useRef<HTMLElement>(null);
  const isProfessionalMode = mode === "professional";

  useEffect(() => {
    detailsRef.current?.scrollTo({ top: 0 });
  }, [mode, selectedExperienceIndex, selectedEducationIndex]);

  const handleModeChange = (nextMode: TimelineMode) => {
    setMode(nextMode);
    setSelectedExperienceIndex(0);
    setSelectedEducationIndex(0);
  };

  return (
    <section className="app-screen timeline-app" aria-labelledby="timeline-title">
      <p className="app-kicker">/experiência.log</p>
      <div className="timeline-app__header">
        <h2 id="timeline-title">
          {isProfessionalMode ? "Experiência Profissional" : "Formação"}
        </h2>
        <div
          className="timeline-mode"
          aria-label="Alternar categoria do histórico"
        >
          <button
            aria-pressed={isProfessionalMode}
            className={isProfessionalMode ? "is-active" : undefined}
            type="button"
            onClick={() => handleModeChange("professional")}
          >
            Profissional
          </button>
          <button
            aria-pressed={!isProfessionalMode}
            className={!isProfessionalMode ? "is-active" : undefined}
            type="button"
            onClick={() => handleModeChange("education")}
          >
            Formação
          </button>
        </div>
      </div>

      <div
        className="timeline-explorer"
        aria-label="Viewer de registros profissionais"
      >
        <nav
          className="timeline-explorer__list"
          aria-label={
            isProfessionalMode
              ? "Registros profissionais"
              : "Registros de formação"
          }
        >
          <strong>{isProfessionalMode ? "Registros" : "Arquivos"}</strong>
          {isProfessionalMode
            ? experiences.map((experience, index) => (
                <button
                  aria-pressed={selectedExperienceIndex === index}
                  className={
                    selectedExperienceIndex === index ? "is-active" : undefined
                  }
                  key={`${experience.company}-${experience.period}`}
                  type="button"
                  onClick={() => setSelectedExperienceIndex(index)}
                >
                  <small>{experience.period}</small>
                  <span>{experience.role}</span>
                  <em>{experience.company}</em>
                </button>
              ))
            : education.map((item, index) => (
                <button
                  aria-pressed={selectedEducationIndex === index}
                  className={
                    selectedEducationIndex === index ? "is-active" : undefined
                  }
                  key={`${item.title}-${item.period}`}
                  type="button"
                  onClick={() => setSelectedEducationIndex(index)}
                >
                  <small>{item.period}</small>
                  <span>{item.title}</span>
                  <em>{item.institution}</em>
                </button>
              ))}
        </nav>

        <article
          className="experience-details"
          ref={detailsRef}
          aria-labelledby="experience-details-title"
          aria-live="polite"
        >
          {isProfessionalMode ? (
            <>
              <div className="experience-details__meta">
                <span>{selectedExperience.company}</span>
                <span>{selectedExperience.period}</span>
              </div>

              <h3 id="experience-details-title">{selectedExperience.role}</h3>
              <p>{selectedExperience.description}</p>

              <section aria-labelledby="experience-highlights-title">
                <h4 id="experience-highlights-title">Destaques</h4>
                <ul>
                  {selectedExperience.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="experience-impact-title">
                <h4 id="experience-impact-title">Sinais de impacto</h4>
                <div className="experience-details__impact">
                  {selectedExperience.impacts.map((impact) => (
                    <span key={impact}>{impact}</span>
                  ))}
                </div>
              </section>

              <section aria-labelledby="experience-tech-title">
                <h4 id="experience-tech-title">Tecnologias aplicadas</h4>
                <div className="experience-details__stack">
                  {selectedExperience.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <>
              <div className="experience-details__meta">
                <span>{selectedEducation.period}</span>
                <span>{selectedEducation.location}</span>
              </div>

              <h3 id="experience-details-title">{selectedEducation.title}</h3>
              <p>{selectedEducation.institution}</p>

              <section aria-labelledby="education-record-title">
                <h4 id="education-record-title">Registro acadêmico</h4>
                <div className="experience-details__impact">
                  <span>Formação técnica complementar</span>
                  <span>Base para produto e front-end</span>
                  <span>Evolução contínua</span>
                </div>
              </section>
            </>
          )}
        </article>
      </div>
    </section>
  );
}
