import { missions, type MissionId } from "@/content/missions";

type MobileMissionsAppProps = {
  completedMissionIds: Set<MissionId>;
  completionPercent: number;
  onOpenMission: (missionId: MissionId) => void;
};

export function MobileMissionsApp({
  completedMissionIds,
  completionPercent,
  onOpenMission,
}: MobileMissionsAppProps) {
  return (
    <div className="mobile-app mobile-missions-app">
      <header className="mobile-app__hero mobile-app__hero--compact">
        <p className="mobile-app__kicker">Roteiro de análise</p>
        <h2>Central de missões</h2>
        <p>Perfil explorado {completionPercent}%</p>
      </header>

      <div
        className="mobile-app__progress"
        aria-label={`Perfil explorado ${completionPercent}%`}
      >
        <span style={{ width: `${completionPercent}%` }} />
      </div>

      <section className="mobile-app__section" aria-labelledby="mission-list">
        <h3 id="mission-list">Roteiro de análise</h3>
        <ul className="mobile-app__mission-list">
          {missions.map((mission) => {
            const isCompleted = completedMissionIds.has(mission.id);

            return (
              <li
                className={isCompleted ? "is-completed" : undefined}
                key={mission.id}
              >
                <button type="button" onClick={() => onOpenMission(mission.id)}>
                  <span aria-hidden="true">{isCompleted ? "OK" : "--"}</span>
                  <div>
                    <strong>{mission.title}</strong>
                    <p>{mission.description}</p>
                  </div>
                  <small>{isCompleted ? "Revisitar" : "Visualizar"}</small>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
