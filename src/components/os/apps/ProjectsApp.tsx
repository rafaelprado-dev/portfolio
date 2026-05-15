"use client";

import { useEffect, useRef } from "react";
import { projects } from "@/content/projects";

type ProjectsAppProps = {
  initialProjectIndex?: number;
  onProjectSelect?: (projectIndex: number) => void;
};

export function ProjectsApp({
  initialProjectIndex = 0,
  onProjectSelect,
}: ProjectsAppProps) {
  const detailsRef = useRef<HTMLElement>(null);
  const selectedProjectIndex = projects[initialProjectIndex] ? initialProjectIndex : 0;
  const selectedProject = projects[selectedProjectIndex] ?? projects[0];

  useEffect(() => {
    detailsRef.current?.scrollTo({ top: 0 });
  }, [selectedProjectIndex]);

  const handleProjectSelect = (projectIndex: number) => {
    onProjectSelect?.(projectIndex);
  };

  return (
    <div className="app-screen projects-app">
      <p className="app-kicker">/projetos</p>
      <h2>Meus Projetos</h2>

      <div className="projects-explorer" aria-label="Explorador de projetos">
        <nav className="projects-explorer__list" aria-label="Lista de projetos">
          <strong>Arquivos</strong>
          {projects.map((project, index) => (
            <button
              aria-pressed={selectedProjectIndex === index}
              className={selectedProjectIndex === index ? "is-active" : undefined}
              key={project.name}
              type="button"
              onClick={() => handleProjectSelect(index)}
            >
              <span>{project.name}</span>
              <small>{project.type}</small>
            </button>
          ))}
        </nav>

        <article className="project-details" aria-live="polite" ref={detailsRef}>
          <div className="project-details__meta">
            <span>{selectedProject.status}</span>
          </div>

          <h3>{selectedProject.name}</h3>
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
    </div>
  );
}
