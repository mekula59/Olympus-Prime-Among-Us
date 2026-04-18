import { hubSeasonCards } from '../../data/hub/hubSelectors';

export function SeasonsPage() {
  const activeSeason = hubSeasonCards.find((season) => season.status === 'active') ?? hubSeasonCards[0];
  const previousSeasons = hubSeasonCards.filter((season) => season.id !== activeSeason?.id);

  return (
    <div className="page page--hub-seasons">
      <section className="hub-seasons-scene" aria-label="Current season">
        <div className="page-header">
          <h1>Seasons</h1>
          <p>The ongoing run of Olympus Prime, and the earlier chapters that built the community into what it is now.</p>
        </div>

        {activeSeason ? (
          <a className="hub-seasons-feature" href="#/seasons/current">
            <div className="hub-seasons-feature__topline">
              <span>{activeSeason.status === 'active' ? 'Current season' : 'Latest season'}</span>
              <small>{activeSeason.code}</small>
            </div>

            <div className="hub-seasons-feature__body">
              <strong>{activeSeason.name}</strong>
              <p>{activeSeason.theme}</p>
            </div>

            <div className="hub-seasons-feature__meta">
              <article>
                <span>Current week</span>
                <strong>{activeSeason.currentWeek}</strong>
              </article>
              <article>
                <span>Sessions</span>
                <strong>{activeSeason.sessionCount}</strong>
              </article>
              <article>
                <span>Featured game</span>
                <strong>{activeSeason.featuredGame}</strong>
              </article>
            </div>
          </a>
        ) : null}
      </section>

      <section className="hub-seasons-archive" aria-label="Season chapters">
        <div className="hub-home-section__header">
          <span>Earlier chapters</span>
        </div>

        <div className="hub-seasons-archive__stack">
          {previousSeasons.map((season) => (
            <a className="hub-season-chapter" href="#/seasons/current" key={season.id}>
              <div className="hub-season-chapter__rail" aria-hidden="true" />

              <div className="hub-season-chapter__content">
                <div className="hub-season-chapter__topline">
                  <span>{season.code}</span>
                  <small>{season.featuredGame}</small>
                </div>

                <strong>{season.name}</strong>
                <p>{season.theme}</p>

                <div className="hub-season-chapter__meta">
                  <small>{season.currentWeek}</small>
                  <small>{season.sessionCount} sessions</small>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
