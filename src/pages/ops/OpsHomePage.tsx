import { ModuleFrame } from '../../components/ModuleFrame';
import { PageIntro } from '../../components/PageIntro';
import { useAmongUsOpsData } from '../../data/games/among-us/amongUsOpsData';
import { useHubOpsData } from '../../data/ops/hubOpsData';

export function OpsHomePage() {
  const { currentHubOpsSessionId, opsSummaryCards } = useHubOpsData();
  const { currentAmongUsOpsSessionId } = useAmongUsOpsData();

  return (
    <div className="page page--ops-home">
      <PageIntro
        eyebrow="Command room"
        title="Run the room without killing the vibe."
        lede="Discord stays loud. Ops keeps the night clean: set up the session, lock the recap, and open the deeper tools only when the room needs them."
        tags={['Host console', 'Record control', 'Transmit ready']}
      />

      <ModuleFrame
        eyebrow="Command surfaces"
        title="Choose the control surface"
        lede="Start broad, then enter a realm engine only when the session needs deeper logging."
        className="ops-home-card"
      >
        <a className="ops-primary-action" href="#/ops/sessions/new">
          <span>Primary action</span>
          <strong>Start New Session</strong>
          <p>Create a fresh Gamesnight record and stage it for publishing.</p>
        </a>

        <div className="hub-feature-stack ops-command-lanes">
          <a className="hub-feature hub-feature--warm ops-command-lane ops-command-lane--live" href={`#/ops/sessions/${currentHubOpsSessionId}`}>
            <span>Active draft</span>
            <strong>Continue Session</strong>
            <p>Jump back into the general command surface for the active gamesnight entry.</p>
            <span className="object-activation">Activate lane</span>
          </a>
          <a className="hub-feature hub-feature--hot ops-command-lane ops-command-lane--realm" href={`#/ops/among-us/sessions/${currentAmongUsOpsSessionId}`}>
            <span>Among Us engine</span>
            <strong>Enter the flagship realm controls</strong>
            <p>Use the flagship flow when a session needs deeper logging and report control.</p>
            <span className="object-activation">Activate lane</span>
          </a>
        </div>
      </ModuleFrame>

      <ModuleFrame
        eyebrow="Room telemetry"
        title="What the command room is tracking"
        lede="A small, readable signal lane for the record state, not a heavy dashboard."
        tone="cool"
      >
        <div className="hub-game-list">
          {opsSummaryCards.map((card) => (
            <article className={`hub-game-card hub-game-card--${card.tone}`} key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <p>{card.detail}</p>
            </article>
          ))}
        </div>
      </ModuleFrame>
    </div>
  );
}
