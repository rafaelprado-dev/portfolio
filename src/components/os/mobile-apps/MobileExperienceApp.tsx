"use client";

import { useState } from "react";
import { education, languages } from "@/content/education";
import { experiences } from "@/content/experience";
import { cn } from "@/lib/utils";

type ExperienceMode = "professional" | "education";

export function MobileExperienceApp() {
  const [mode, setMode] = useState<ExperienceMode>("professional");
  const isProfessionalMode = mode === "professional";

  return (
    <div className="mobile-app mobile-experience-app">
      <header className="mobile-app__hero mobile-app__hero--compact">
        <p className="mobile-app__kicker">/experiencia.log</p>
        <h2>Registro profissional</h2>
        <p>Experiência e formação organizadas como histórico do sistema.</p>
      </header>

      <div className="mobile-app__segmented" role="tablist" aria-label="Tipo de registro">
        <button
          aria-selected={isProfessionalMode}
          className={cn(isProfessionalMode && "is-active")}
          role="tab"
          type="button"
          onClick={() => setMode("professional")}
        >
          Profissional
        </button>
        <button
          aria-selected={!isProfessionalMode}
          className={cn(!isProfessionalMode && "is-active")}
          role="tab"
          type="button"
          onClick={() => setMode("education")}
        >
          Formação
        </button>
      </div>

      {isProfessionalMode ? (
        <section className="mobile-app__timeline" aria-label="Experiência profissional">
          {experiences.map((experience) => (
            <article className="mobile-app__section" key={`${experience.company}-${experience.period}`}>
              <p className="mobile-app__kicker">{experience.period}</p>
              <h3>{experience.role}</h3>
              <strong>{experience.company}</strong>
              <p>{experience.description}</p>
              <ul className="mobile-app__bullets">
                {experience.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <div className="mobile-app__chips">
                {experience.technologies.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="mobile-app__timeline" aria-label="Formação">
          {education.map((item) => (
            <article className="mobile-app__section" key={`${item.title}-${item.period}`}>
              <p className="mobile-app__kicker">{item.period}</p>
              <h3>{item.title}</h3>
              <strong>{item.institution}</strong>
              <p>{item.location}</p>
            </article>
          ))}

          <article className="mobile-app__section">
            <h3>Idiomas</h3>
            <div className="mobile-app__chips">
              {languages.map((language) => (
                <span key={language}>{language}</span>
              ))}
            </div>
          </article>
        </section>
      )}
    </div>
  );
}
