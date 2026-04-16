import { ModuleFrame } from '../../components/ModuleFrame';
import { hubSeasonCards } from '../../data/hub/hubSelectors';

export function SeasonsPage() {
  const activeSeason = hubSeasonCards.find((season) => season.status === 'active') ?? hubSeasonCards[0];

  return (
    <div className="page page--hub-seasons">
      <section className="hub-screen-header" aria-label="Seasons overview">
        <p className="hub-screen-header__eyebrow">Seasons</p>
        <h2>Season archive</h2>
        <p className="hub-screen-header__lede">A simple index of active and past seasons across Olympus Prime gamesnights.</p>

        <div className="hub-utility-row" aria-label="Season summary">
          <article>
            <span>Total</span>
            <strong>{hubSeasonCards.length}</strong>
          </article>
          <article>
            <span>Active</span>
            <strong>{activeSeason?.code ?? 'None'}</strong>
          </article>
          <article>
            <span>Current</span>
            <strong>{activeSeason?.currentWeek ?? 'No season yet'}</strong>
          </article>
        </div>
      </section>

      <ModuleFrame className="hub-list-module">
        <div className="hub-season-list">
          {hubSeasonCards.map((season) => (
            <a className="hub-season-card" href="#/seasons/current" key={season.id}>
              <span>{season.code}</span>
              <strong>{season.name}</strong>
              <p>{season.theme}</p>
              <div className="hub-season-card__meta">
                <small>{season.currentWeek}</small>
                <small>{season.sessionCount} sessions</small>
                <small>{season.featuredGame}</small>
              </div>
            </a>
          ))}
        </div>
      </ModuleFrame>
    </div>
  );
}
