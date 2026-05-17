"use client";

import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { education } from "@/content/education";
import { experiences } from "@/content/experience";
import { cn } from "@/lib/utils";

type ExperienceMode = "professional" | "education";
type ExperienceDetail =
  | { mode: "professional"; index: number }
  | { mode: "education"; index: number }
  | null;

type MobileExperienceAppProps = {
  backSignal: number;
  onBackAvailabilityChange: (canGoBack: boolean) => void;
  onScreenChange: () => void;
};

export function MobileExperienceApp({
  backSignal,
  onBackAvailabilityChange,
  onScreenChange,
}: MobileExperienceAppProps) {
  const [mode, setMode] = useState<ExperienceMode>("professional");
  const [detail, setDetail] = useState<ExperienceDetail>(null);
  const previousBackSignal = useRef(backSignal);
  const isProfessionalMode = mode === "professional";

  useEffect(() => {
    onBackAvailabilityChange(detail !== null);
  }, [detail, onBackAvailabilityChange]);

  useEffect(() => {
    if (previousBackSignal.current === backSignal) return;

    previousBackSignal.current = backSignal;

    if (detail !== null) {
      const frame = window.requestAnimationFrame(() => setDetail(null));

      return () => window.cancelAnimationFrame(frame);
    }
  }, [backSignal, detail]);

  const closeDetail = () => {
    setDetail(null);
    onScreenChange();
  };

  const openDetail = (nextDetail: Exclude<ExperienceDetail, null>) => {
    setDetail(nextDetail);
    onScreenChange();
  };

  const switchMode = (nextMode: ExperienceMode) => {
    setMode(nextMode);
    onScreenChange();
  };

  if (detail?.mode === "professional") {
    const experience = experiences[detail.index] ?? experiences[0];

    return (
      <div className="mobile-app mobile-experience-app">
        <button
          className="mobile-app__back"
          type="button"
          onClick={closeDetail}
        >
          <ArrowLeft size={17} strokeWidth={2.4} />
          Experiência
        </button>

        <article className="mobile-app__detail-screen" aria-labelledby="experience-detail">
          <p className="mobile-app__kicker">Registro selecionado</p>
          <h2 id="experience-detail">{experience.role}</h2>

          <dl className="mobile-experience-detail__meta">
            <div>
              <dt>Período</dt>
              <dd>{experience.period}</dd>
            </div>
            <div>
              <dt>Origem</dt>
              <dd>{experience.company}</dd>
            </div>
          </dl>

          <p>{experience.description}</p>

          <ul className="mobile-app__bullets">
            {experience.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>

          <div className="mobile-experience-detail__block">
            <h3>Impactos</h3>
            <div className="mobile-app__chips">
              {experience.impacts.map((impact) => (
                <span key={impact}>{impact}</span>
              ))}
            </div>
          </div>

          <div className="mobile-experience-detail__block">
            <h3>Tecnologias</h3>
            <div className="mobile-app__chips">
              {experience.technologies.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>
          </div>
        </article>
      </div>
    );
  }

  if (detail?.mode === "education") {
    const item = education[detail.index] ?? education[0];

    return (
      <div className="mobile-app mobile-experience-app">
        <button
          className="mobile-app__back"
          type="button"
          onClick={closeDetail}
        >
          <ArrowLeft size={17} strokeWidth={2.4} />
          Formação
        </button>

        <article className="mobile-app__detail-screen" aria-labelledby="education-detail">
          <p className="mobile-app__kicker">Formação selecionada</p>
          <h2 id="education-detail">{item.title}</h2>

          <dl className="mobile-experience-detail__meta">
            <div>
              <dt>Período</dt>
              <dd>{item.period}</dd>
            </div>
            <div>
              <dt>Instituição</dt>
              <dd>{item.institution}</dd>
            </div>
            <div>
              <dt>Local</dt>
              <dd>{item.location}</dd>
            </div>
          </dl>
        </article>
      </div>
    );
  }

  return (
    <div className="mobile-app mobile-experience-app">
      <header className="mobile-app__hero mobile-app__hero--compact">
        <p className="mobile-app__kicker">Registro carregado</p>
        <h2>Experiência</h2>
        <p>Linha do tempo profissional, formação e contexto de atuação.</p>
      </header>

      <div className="mobile-app__segmented" role="tablist" aria-label="Tipo de registro">
        <button
          aria-selected={isProfessionalMode}
          className={cn(isProfessionalMode && "is-active")}
          role="tab"
          type="button"
          onClick={() => switchMode("professional")}
        >
          Profissional
        </button>
        <button
          aria-selected={!isProfessionalMode}
          className={cn(!isProfessionalMode && "is-active")}
          role="tab"
          type="button"
          onClick={() => switchMode("education")}
        >
          Formação
        </button>
      </div>

      {isProfessionalMode ? (
        <section className="mobile-app__timeline" aria-label="Experiência profissional">
          {experiences.map((experience, index) => (
            <button
              className="mobile-app__timeline-row mobile-experience-row"
              key={`${experience.company}-${experience.period}`}
              type="button"
              onClick={() => openDetail({ mode: "professional", index })}
            >
              <span className="mobile-experience-row__marker" aria-hidden="true" />
              <span className="mobile-experience-row__content">
                <small>{experience.period}</small>
                <strong>{experience.role}</strong>
                <em>{experience.company}</em>
                <p>{experience.description}</p>
                <span>Ver detalhes</span>
              </span>
            </button>
          ))}
        </section>
      ) : (
        <section className="mobile-app__timeline" aria-label="Formação">
          {education.map((item, index) => (
            <button
              className="mobile-app__timeline-row mobile-experience-row"
              key={`${item.title}-${item.period}`}
              type="button"
              onClick={() => openDetail({ mode: "education", index })}
            >
              <span className="mobile-experience-row__marker" aria-hidden="true" />
              <span className="mobile-experience-row__content">
                <small>{item.period}</small>
                <strong>{item.title}</strong>
                <em>{item.institution}</em>
                <p>{item.location}</p>
                <span>Ver detalhes</span>
              </span>
            </button>
          ))}
        </section>
      )}
    </div>
  );
}
