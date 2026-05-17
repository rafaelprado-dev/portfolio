import type { CSSProperties } from "react";
import { missions, type MissionId } from "@/content/missions";

type MissionsAppProps = {
  completedMissionIds: Set<MissionId>;
  completionPercent: number;
};

export function MissionsApp({
  completedMissionIds,
  completionPercent,
}: MissionsAppProps) {
  return (
    <div className="app-screen missions-app">
      <p className="app-kicker">/missões.sys</p>
      <h2>Central de Missões</h2>

      <section className="missions-app__status" aria-label="Progresso do portfólio">
        <div>
          <strong>Perfil analisado</strong>
          <span>{completionPercent}%</span>
        </div>
        <div
          aria-hidden="true"
          className="missions-app__progress"
          style={{ "--mission-progress": `${completionPercent}%` } as CSSProperties}
        />
      </section>

      <div className="missions-app__list" aria-label="Roteiro de análise">
        {missions.map((mission) => {
          const isComplete = completedMissionIds.has(mission.id);

          return (
            <article
              className={isComplete ? "is-complete" : undefined}
              key={mission.id}
            >
              <span aria-hidden="true">{isComplete ? "OK" : "--"}</span>
              <div>
                <h3>{mission.title}</h3>
                <p>{mission.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
