"use client";

import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/content/projects";
import { cn } from "@/lib/utils";

type MobileProjectsAppProps = {
  backSignal: number;
  initialDetailProjectIndex?: number | null;
  onBackAvailabilityChange: (canGoBack: boolean) => void;
  onScreenChange: () => void;
  selectedProjectIndex: number;
  onProjectSelect: (projectIndex: number) => void;
};

export function MobileProjectsApp({
  backSignal,
  initialDetailProjectIndex = null,
  onBackAvailabilityChange,
  onScreenChange,
  selectedProjectIndex,
  onProjectSelect,
}: MobileProjectsAppProps) {
  const [detailProjectIndex, setDetailProjectIndex] = useState<number | null>(
    initialDetailProjectIndex,
  );
  const previousBackSignal = useRef(backSignal);
  const selectedProject =
    projects[detailProjectIndex ?? selectedProjectIndex] ?? projects[0];

  useEffect(() => {
    onBackAvailabilityChange(detailProjectIndex !== null);
  }, [detailProjectIndex, onBackAvailabilityChange]);

  useEffect(() => {
    if (previousBackSignal.current === backSignal) return;

    previousBackSignal.current = backSignal;

    if (detailProjectIndex !== null) {
      const frame = window.requestAnimationFrame(() =>
        setDetailProjectIndex(null),
      );

      return () => window.cancelAnimationFrame(frame);
    }
  }, [backSignal, detailProjectIndex]);

  const closeProject = () => {
    setDetailProjectIndex(null);
    onScreenChange();
  };

  const openProject = (projectIndex: number) => {
    onProjectSelect(projectIndex);
    setDetailProjectIndex(projectIndex);
    onScreenChange();
  };

  if (detailProjectIndex !== null) {
    return (
      <div className="mobile-app mobile-projects-app">
        <button
          className="mobile-app__back"
          type="button"
          onClick={closeProject}
        >
          <ArrowLeft size={17} strokeWidth={2.4} />
          Projetos
        </button>

        <article
          className="mobile-app__detail-screen"
          aria-labelledby="project-detail"
        >
          <p className="mobile-app__kicker">Detalhes do pacote</p>
          <h2 id="project-detail">{selectedProject.name}</h2>
          <span className="mobile-app__meta">{selectedProject.status}</span>
          <p>{selectedProject.description}</p>

          <div className="mobile-app__chips">
            {selectedProject.stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <ul className="mobile-app__bullets">
            {selectedProject.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>

          {selectedProject.links?.length ? (
            <div className="mobile-app__actions">
              {selectedProject.links.map((link) => (
                <a
                  href={link.href}
                  key={link.href}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </article>
      </div>
    );
  }

  return (
    <div className="mobile-app mobile-projects-app">
      <header className="mobile-app__hero mobile-app__hero--compact">
        <p className="mobile-app__kicker">Pacotes instalados</p>
        <h2>Gerenciador de projetos</h2>
      </header>

      <section
        className="mobile-app__section"
        aria-labelledby="project-packages"
      >
        <div className="mobile-app__list" role="list">
          {projects.map((project, index) => (
            <button
              className={cn(index === selectedProjectIndex && "is-active")}
              key={project.name}
              type="button"
              onClick={() => openProject(index)}
            >
              <strong>{project.name}</strong>
              <span>{project.type}</span>
              <small>{project.status}</small>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
