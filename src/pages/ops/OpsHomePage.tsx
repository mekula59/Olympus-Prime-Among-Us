import { ModuleFrame } from '../../components/ModuleFrame';
import { PageIntro } from '../../components/PageIntro';
import { currentAmongUsOpsSessionId } from '../../data/games/among-us/amongUsOpsData';
import { currentHubOpsSessionId, opsSummaryCards } from '../../data/ops/hubOpsData';

export function OpsHomePage() {
  return (
    <div className="page page--ops-home">
      <PageIntro
        eyebrow="Ops"
        title="Run the record, not the whole community."
        lede="Discord stays live for planning and chatter. Ops is the calmer companion layer for creating a session, editing the record, and opening the deeper game engines only when needed."
        tags={['Mobile first', 'Host friendly', 'Lightweight']}
      />

      <ModuleFrame
        eyebrow="Quick actions"
        title="Start from the simplest path"
        lede="Generic Ops should stay broad, calm, and useful in a few taps."
        className="ops-home-card"
      >
        <div className="hub-feature-stack">
          <a className="hub-feature hub-feature--cool" href="#/ops/sessions/new">
            <span>New session</span>
            <strong>Start a fresh gamesnight record</strong>
            <p>Open a lightweight session shell for attendance, recap prep, and publish readiness.</p>
          </a>
          <a className="hub-feature hub-feature--warm" href={`#/ops/sessions/${currentHubOpsSessionId}`}>
            <span>Edit latest</span>
            <strong>Pick up the current draft session</strong>
            <p>Jump back into the generic editor for the active gamesnight record.</p>
          </a>
          <a className="hub-feature hub-feature--hot" href={`#/ops/among-us/sessions/${currentAmongUsOpsSessionId}`}>
            <span>Among Us engine</span>
            <strong>Open the staged session engine</strong>
            <p>Use the flagship game flow when a session needs deeper logging and report control.</p>
          </a>
        </div>
      </ModuleFrame>

      <ModuleFrame
        eyebrow="Current status"
        title="What hosts are managing right now"
        lede="A small, readable status lane instead of a heavy control dashboard."
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
