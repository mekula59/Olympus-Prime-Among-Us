import { ModuleFrame } from '../../../components/ModuleFrame';
import { useAmongUsPublicSyncState } from '../../../hooks/games/among-us/useAmongUsPublicSyncState';

export function AmongUsSessionsPage() {
  const { missionLogs, shell, sync } = useAmongUsPublicSyncState();

  return (
    <div className="page page--mission-logs">
      <section className="module-screen-header" aria-label="Among Us sessions">
        <p className="module-screen-header__eyebrow">Among Us</p>
        <h2>Session history</h2>
        <p className="module-screen-header__lede">Round-by-round turning points, kept in a cleaner mobile archive.</p>

        <div className="module-utility-row" aria-label="Session log summary">
          <article>
            <span>Source</span>
            <strong>{sync.runtimeEnabled ? 'Live sync' : 'Archive'}</strong>
          </article>
          <article>
            <span>Current</span>
            <strong>{shell.title}</strong>
          </article>
          <article>
            <span>Logs</span>
            <strong>{missionLogs.length}</strong>
          </article>
        </div>
      </section>

      <div className="logs-layout">
        <ModuleFrame className="timeline-module module-screen-module">
          <div className="timeline-corridor">
            {missionLogs.map((log) => (
              <article className={`timeline-node timeline-node--${log.tone}`} key={`${log.stamp}-${log.title}`}>
                <div className="timeline-node__stamp">
                  <span>{log.stamp}</span>
                  <small>{log.location}</small>
                </div>
                <div className="timeline-node__content">
                  <p className="timeline-node__tag">{log.tag}</p>
                  <h4>{log.title}</h4>
                  <p>{log.summary}</p>
                  <p className="timeline-node__detail">{log.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </ModuleFrame>

        <div className="stacked-side-modules">
          <ModuleFrame tone="warm" className="module-screen-module">
          <div className="quote-stack">
              <blockquote>
                {sync.runtimeEnabled
                  ? '“The log updated before the room fully recovered, which means HQ definitely felt that round.”'
                  : '“That sounded way too prepared for someone who says they were improvising.”'}
              </blockquote>
              <blockquote>
                {sync.runtimeEnabled
                  ? '“If the engine marked it live, the hallway is going to keep that argument forever.”'
                  : '“Skip if you want, but the hallway already voted.”'}
              </blockquote>
              <blockquote>
                {sync.runtimeEnabled
                  ? '“A transmitted round always sounds louder on replay than it did in the room.”'
                  : '“No one says ‘trust me’ like that unless the room should do the opposite.”'}
              </blockquote>
          </div>
          </ModuleFrame>

          <ModuleFrame className="empty-state-module module-screen-module">
            <div className="empty-bay">
              <p>
                {sync.runtimeEnabled
                  ? 'The live session has not pushed the next turning point yet, so this corridor slot is waiting on the room.'
                  : 'The next corridor entry does not exist yet, but the ship is clearly expecting one.'}
              </p>
              <span>{sync.runtimeEnabled ? 'Session link open. Next match will print here.' : 'Archive slot warm and waiting.'}</span>
            </div>
          </ModuleFrame>
        </div>
      </div>
    </div>
  );
}
