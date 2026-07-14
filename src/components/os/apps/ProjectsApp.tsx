"use client";

import { useEffect, useRef, useState } from "react";
import { getFilteredProjectEntries, projectFilters, projects } from "@/content/projects";
import { cn } from "@/lib/utils";
import type { ProjectFilterId } from "@/types/portfolio";

type ProjectsAppProps = {
  initialProjectIndex?: number;
  onProjectSelect?: (projectIndex: number) => void;
};

export function ProjectsApp({
  initialProjectIndex = 0,
  onProjectSelect,
}: ProjectsAppProps) {
  const [activeFilterId, setActiveFilterId] = useState<ProjectFilterId>("all");
  const detailsRef = useRef<HTMLElement>(null);
  const selectedProjectIndex = projects[initialProjectIndex] ? initialProjectIndex : 0;
  const selectedProject = projects[selectedProjectIndex] ?? projects[0];
  const effectiveFilterId =
    activeFilterId === "all" || selectedProject.category === activeFilterId
      ? activeFilterId
      : "all";
  const filteredProjectEntries = getFilteredProjectEntries(effectiveFilterId);
  const selectedProjectEntry =
    filteredProjectEntries.find((entry) => entry.index === selectedProjectIndex) ??
    filteredProjectEntries[0];
  const selectedProjectIndexInFilter = selectedProjectEntry?.index ?? 0;

  useEffect(() => {
    detailsRef.current?.scrollTo({ top: 0 });
  }, [effectiveFilterId, selectedProjectIndexInFilter]);

  const handleProjectSelect = (projectIndex: number) => {
    onProjectSelect?.(projectIndex);
  };

  const handleFilterSelect = (filterId: ProjectFilterId) => {
    const nextProjectEntries = getFilteredProjectEntries(filterId);
    const hasSelectedProject = nextProjectEntries.some(
      (entry) => entry.index === selectedProjectIndex,
    );

    setActiveFilterId(filterId);

    if (!hasSelectedProject && nextProjectEntries[0]) {
      handleProjectSelect(nextProjectEntries[0].index);
    }
  };

  return (
    <section className="app-screen projects-app" aria-labelledby="projects-title">
      <p className="app-kicker">/projetos</p>
      <h2 id="projects-title">Meus Projetos</h2>

      <div
        className="projects-filter-bar"
        role="toolbar"
        aria-label="Filtrar projetos por foco"
      >
        <span>Filtro:</span>
        {projectFilters.map((filter) => {
          const projectCount = getFilteredProjectEntries(filter.id).length;

          return (
            <button
              aria-pressed={effectiveFilterId === filter.id}
              className={effectiveFilterId === filter.id ? "is-active" : undefined}
              key={filter.id}
              type="button"
              onClick={() => handleFilterSelect(filter.id)}
            >
              {filter.label}
              <small>{projectCount}</small>
            </button>
          );
        })}
      </div>

      <div className="projects-explorer" aria-label="Explorador de projetos">
        <nav className="projects-explorer__list" aria-label="Lista de projetos">
          <strong>Arquivos</strong>
          {filteredProjectEntries.map(({ project, index }) => (
            <button
              aria-pressed={selectedProjectIndexInFilter === index}
              className={cn(
                selectedProjectIndexInFilter === index && "is-active",
                project.featured && "is-featured",
              )}
              key={project.name}
              type="button"
              onClick={() => handleProjectSelect(index)}
            >
              <span>{project.name}</span>
              <small>{project.type}</small>
              {project.featured ? (
                <span className="project-featured-star" aria-label="Projeto principal">
                  ★
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <article
          className="project-details"
          aria-labelledby="project-details-title"
          aria-live="polite"
          ref={detailsRef}
        >
          <div className="project-details__meta">
            {selectedProject.status.map((status) => (
              <span key={status}>{status}</span>
            ))}
          </div>

          <h3 id="project-details-title">{selectedProject.name}</h3>
          <p>{selectedProject.description}</p>

          <section aria-labelledby="project-stack-title">
            <h4 id="project-stack-title">Tecnologias</h4>
            <div className="project-details__stack">
              {selectedProject.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </section>

          <section aria-labelledby="project-highlights-title">
            <h4 id="project-highlights-title">Destaques</h4>
            <ul>
              {selectedProject.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </section>
        </article>
      </div>
    </section>
  );
}
