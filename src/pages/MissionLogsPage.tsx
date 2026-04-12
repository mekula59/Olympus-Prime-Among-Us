import { ModuleFrame } from '../components/ModuleFrame';
import { PageIntro } from '../components/PageIntro';
import { usePublicSyncState } from '../hooks/usePublicSyncState';

export function MissionLogsPage() {
  const { missionLogs, shell, sync } = usePublicSyncState();

  return (
    <div className="page page--mission-logs">
      <PageIntro
        eyebrow="Archive corridor"
        title="Round-by-round history with the hallway still echoing."
        lede={
          sync.runtimeEnabled
            ? `${shell.title} is feeding this corridor directly, so the turning points below now come from the session engine instead of a separate static archive.`
            : 'Mission Logs should feel like walking past illuminated memory capsules, each one holding a point where the room shifted, cracked up, or suddenly understood too much.'
        }
        tags={['Corridor timestamps', sync.phaseLabel, 'Hallway memory']}
        aside={
          <div className="memory-orb memory-orb--compact">
            <p className="memory-orb__label">Corridor note</p>
            <strong>
              {sync.runtimeEnabled
                ? 'Every new match log now leaves a fresh footprint in the corridor.'
                : 'Every timestamp keeps a little bit of the room noise trapped inside it.'}
            </strong>
          </div>
        }
      />

      <div className="logs-layout">
        <ModuleFrame
          eyebrow="Recorded sequence"
          title="The corridor of turning points"
          lede="Each log preserves the feeling of the round, not just the result."
          className="timeline-module"
        >
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
          <ModuleFrame
            eyebrow="Hot mic fragments"
            title="What the corridor kept"
            lede="Small atmospheric pieces make the archive feel inhabited."
            tone="warm"
          >
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

          <ModuleFrame
            eyebrow="Unwritten log"
            title="Next legendary round pending"
            lede="A purposeful empty state that promises future lore."
            className="empty-state-module"
          >
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
