"use client";

import { ArrowLeft, Pin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  getFilteredProjectEntries,
  projectFilters,
  projects,
} from "@/content/projects";
import { cn } from "@/lib/utils";
import type { ProjectFilterId } from "@/types/portfolio";

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
  const [activeFilterId, setActiveFilterId] = useState<ProjectFilterId>("all");
  const [detailProjectIndex, setDetailProjectIndex] = useState<number | null>(
    initialDetailProjectIndex,
  );
  const previousBackSignal = useRef(backSignal);
  const selectedListProject = projects[selectedProjectIndex] ?? projects[0];
  const effectiveFilterId =
    activeFilterId === "all" || selectedListProject.category === activeFilterId
      ? activeFilterId
      : "all";
  const filteredProjectEntries = getFilteredProjectEntries(effectiveFilterId);
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

  const selectFilter = (filterId: ProjectFilterId) => {
    const nextProjectEntries = getFilteredProjectEntries(filterId);
    const hasSelectedProject = nextProjectEntries.some(
      (entry) => entry.index === selectedProjectIndex,
    );

    setActiveFilterId(filterId);
    onScreenChange();

    if (!hasSelectedProject && nextProjectEntries[0]) {
      onProjectSelect(nextProjectEntries[0].index);
    }
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
          <div
            className="mobile-app__status-list"
            aria-label="Status do projeto"
          >
            {selectedProject.status.map((status) => (
              <span key={status}>{status}</span>
            ))}
          </div>
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

      <div
        className="mobile-app__filter-strip"
        role="toolbar"
        aria-label="Filtrar projetos por foco"
      >
        {projectFilters.map((filter) => (
          <button
            aria-pressed={effectiveFilterId === filter.id}
            className={cn(effectiveFilterId === filter.id && "is-active")}
            key={filter.id}
            type="button"
            onClick={() => selectFilter(filter.id)}
          >
            {filter.shortLabel}
          </button>
        ))}
      </div>

      <section
        className="mobile-app__section"
        aria-labelledby="project-packages"
      >
        <div className="mobile-app__list" role="list">
          {filteredProjectEntries.map(({ project, index }) => (
            <button
              className={cn(
                index === selectedProjectIndex && "is-active",
                project.featured && "is-featured",
              )}
              key={project.name}
              type="button"
              onClick={() => openProject(index)}
            >
              <strong>{project.name}</strong>
              <span>{project.type}</span>
              <span className="mobile-app__status-list">
                {project.status.map((status) => (
                  <small key={status}>{status}</small>
                ))}
              </span>
              {project.featured ? (
                <span
                  className="mobile-app__featured-rail"
                  aria-label="Projeto principal"
                >
                  <Pin
                    aria-hidden="true"
                    className="mobile-app__featured-pin"
                    size={18}
                    strokeWidth={2.4}
                  />
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
