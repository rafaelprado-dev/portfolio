"use client";

import { useEffect, useRef } from "react";
import { projects } from "@/content/projects";
import { cn } from "@/lib/utils";

type MobileProjectsAppProps = {
  selectedProjectIndex: number;
  onProjectSelect: (projectIndex: number) => void;
};

export function MobileProjectsApp({
  selectedProjectIndex,
  onProjectSelect,
}: MobileProjectsAppProps) {
  const detailsRef = useRef<HTMLElement>(null);
  const selectedProject = projects[selectedProjectIndex] ?? projects[0];

  useEffect(() => {
    detailsRef.current?.scrollTo({ top: 0 });
  }, [selectedProjectIndex]);

  return (
    <div className="mobile-app mobile-projects-app">
      <header className="mobile-app__hero mobile-app__hero--compact">
        <p className="mobile-app__kicker">/projetos.apk</p>
        <h2>Gerenciador de pacotes</h2>
        <p>Pacotes instalados com projetos principais, stack e destaques.</p>
      </header>

      <section className="mobile-app__section" aria-labelledby="project-packages">
        <h3 id="project-packages">Pacotes instalados</h3>
        <div className="mobile-app__list" role="list">
          {projects.map((project, index) => (
            <button
              className={cn(index === selectedProjectIndex && "is-active")}
              key={project.name}
              type="button"
              onClick={() => onProjectSelect(index)}
            >
              <strong>{project.name}</strong>
              <span>{project.type}</span>
              <small>{project.status}</small>
            </button>
          ))}
        </div>
      </section>

      <section
        className="mobile-app__section mobile-app__detail"
        aria-labelledby="project-detail"
        ref={detailsRef}
      >
        <p className="mobile-app__kicker">Detalhes do pacote</p>
        <h3 id="project-detail">{selectedProject.name}</h3>
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
      </section>
    </div>
  );
}
