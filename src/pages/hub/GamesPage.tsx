import { ModuleFrame } from '../../components/ModuleFrame';
import { PageIntro } from '../../components/PageIntro';
import { hubGameCards } from '../../data/hub/hubSelectors';

export function GamesPage() {
  return (
    <div className="page page--hub-games">
      <PageIntro
        eyebrow="Games"
        title="Flagship modules inside the Hub."
        lede="The Hub shell stays broad and calm. Each game module gets to carry its own personality once you enter it."
        tags={['Featured game', 'Module first', 'Discord companion']}
      />

      <ModuleFrame
        eyebrow="Modules"
        title="Game spaces"
        lede="Among Us leads first. Future recurring games can slot in beside it without changing the Hub shell."
      >
        <div className="hub-game-list">
          {hubGameCards.map((game) => (
            <a className={`hub-game-card hub-game-card--${game.tone}`} href={game.href} key={game.id}>
              <span>{game.name}</span>
              <strong>{game.latestLabel}</strong>
              <p>{game.summary}</p>
              <small>{game.theme}</small>
            </a>
          ))}
        </div>
      </ModuleFrame>
    </div>
  );
}
