import { ModuleFrame } from '../../components/ModuleFrame';
import { PageIntro } from '../../components/PageIntro';
import { useHubViewModel } from '../../data/hub/hubSelectors';

export function SeasonDetailPage() {
  const { currentSeasonDetail, currentSeasonSessions } = useHubViewModel();

  if (!currentSeasonDetail) {
    return null;
  }

  return (
    <div className="page page--hub-season-detail">
      <PageIntro
        eyebrow="Season detail"
        title={currentSeasonDetail.name}
        lede="This is the broad season shell: one place for session rhythm, standout recaps, and game memory that stretches beyond a single report."
        tags={[currentSeasonDetail.featuredGame, currentSeasonDetail.currentWeek, 'Season archive']}
      />

      <ModuleFrame
        eyebrow="Season overview"
        title={`${currentSeasonDetail.sessionCount} sessions so far`}
        lede={currentSeasonDetail.theme}
      >
        <div className="hub-stat-row">
          <article>
            <span>Status</span>
            <strong>{currentSeasonDetail.status}</strong>
          </article>
          <article>
            <span>Current week</span>
            <strong>{currentSeasonDetail.currentWeek}</strong>
          </article>
          <article>
            <span>Featured game</span>
            <strong>{currentSeasonDetail.featuredGame}</strong>
          </article>
        </div>
      </ModuleFrame>

      <ModuleFrame
        eyebrow="Sessions"
        title="Published and upcoming nights"
        lede="Session links stay simple at Hub level; richer storytelling remains inside the game module."
      >
        <div className="hub-memory-list">
          {currentSeasonSessions.map((session) => (
            <a className="hub-memory-item hub-memory-item--link" href={session.href} key={session.id}>
              <span>{session.title}</span>
              <p>{session.detail}</p>
            </a>
          ))}
        </div>
      </ModuleFrame>
    </div>
  );
}
