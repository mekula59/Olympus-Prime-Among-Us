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
        title="Control the record without taking over the night."
        lede="Discord stays live for planning and chatter. Ops is the command layer for staging a session, tuning the record, and opening deeper realm engines only when needed."
        tags={['Host console', 'Record control', 'Transmit ready']}
      />

      <ModuleFrame
        eyebrow="Command surfaces"
        title="Choose the control surface"
        lede="Start broad, then enter a realm engine only when the session needs deeper logging."
        className="ops-home-card"
      >
        <div className="hub-feature-stack ops-command-lanes">
          <a className="hub-feature hub-feature--cool ops-command-lane ops-command-lane--stage" href="#/ops/sessions/new">
            <span>New record</span>
            <strong>Stage a fresh gamesnight entry</strong>
            <p>Open a lightweight command surface for attendance, recap prep, and publish readiness.</p>
            <span className="object-activation">Activate lane</span>
          </a>
          <a className="hub-feature hub-feature--warm ops-command-lane ops-command-lane--live" href={`#/ops/sessions/${currentHubOpsSessionId}`}>
            <span>Active draft</span>
            <strong>Return to the live record</strong>
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
