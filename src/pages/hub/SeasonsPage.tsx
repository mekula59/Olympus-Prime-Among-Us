import { useHubViewModel } from '../../data/hub/hubSelectors';

export function SeasonsPage() {
  const { hubSeasonCards } = useHubViewModel();
  const activeSeason = hubSeasonCards.find((season) => season.status === 'active') ?? hubSeasonCards[0];
  const previousSeasons = hubSeasonCards.filter((season) => season.id !== activeSeason?.id);

  return (
    <div className="page page--hub-seasons">
      <section className="hub-seasons-scene" aria-label="Current season">
        <div className="page-header">
          <span className="page-header__marker">Era Timeline</span>
          <h1>Eras.</h1>
          <p>The current chapter of Olympus Prime, and the earlier eras that shaped the world into what it is now.</p>
        </div>

        {activeSeason ? (
          <a className="hub-seasons-feature" href="#/seasons/current">
            <div className="hub-seasons-feature__topline">
              <span>{activeSeason.status === 'active' ? 'Current era' : 'Latest era'}</span>
              <small>{activeSeason.code}</small>
            </div>

            <div className="hub-seasons-feature__body">
              <strong>{activeSeason.name}</strong>
              <p>{activeSeason.theme}</p>
            </div>

            <div className="hub-seasons-feature__meta">
              <article>
                <span>Era week</span>
                <strong>{activeSeason.currentWeek}</strong>
              </article>
              <article>
                <span>Entries</span>
                <strong>{activeSeason.sessionCount}</strong>
              </article>
              <article>
                <span>Realm focus</span>
                <strong>{activeSeason.featuredGame}</strong>
              </article>
            </div>
            <span className="object-activation">Enter era</span>
          </a>
        ) : null}
      </section>

      <section className="hub-seasons-archive" aria-label="Season chapters">
        <div className="hub-home-section__header">
          <span>Sealed chapters</span>
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
              <span className="object-activation">Open chapter</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
