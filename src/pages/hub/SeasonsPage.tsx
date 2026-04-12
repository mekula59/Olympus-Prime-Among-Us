import { ModuleFrame } from '../../components/ModuleFrame';
import { PageIntro } from '../../components/PageIntro';
import { hubSeasonCards } from '../../data/hub/hubSelectors';

export function SeasonsPage() {
  return (
    <div className="page page--hub-seasons">
      <PageIntro
        eyebrow="Seasons"
        title="The archive backbone for recurring nights."
        lede="Seasons belong above any one game. They organize the rhythm of gamesnight, the sessions inside it, and the memory that survives after Discord has moved on."
        tags={['Archive first', 'Cross-game', 'Season memory']}
      />

      <ModuleFrame
        eyebrow="Season index"
        title="Current and upcoming seasons"
        lede="A stacked archive made for quick mobile reading."
      >
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
