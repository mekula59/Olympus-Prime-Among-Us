import { hubGameCards } from '../../data/hub/hubSelectors';

export function GamesPage() {
  return (
    <div className="page page--hub-games">
      <div className="page-header">
        <h1>Games</h1>
        <p>Open the strongest active game modules and jump straight to the sessions people still reference.</p>
      </div>

      <div className="hub-row-list">
        {hubGameCards.map((game) => (
          <a className="hub-game-row" href={game.href} key={game.id}>
            <div className="hub-game-row__info">
              <strong>{game.name}</strong>
              <p>{game.summary}</p>
            </div>
            <div className="hub-game-row__meta">
              <span>Latest</span>
              <small>{game.latestLabel}</small>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
