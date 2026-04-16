import { hubGameCards } from '../../data/hub/hubSelectors';

export function GamesPage() {
  return (
    <div className="page page--hub-games">
      <div className="page-header">
        <h1>Games</h1>
        <p>{hubGameCards.length} tracked · {hubGameCards[0]?.name ?? 'Among Us'} flagship</p>
      </div>

      <div className="hub-row-list">
        {hubGameCards.map((game) => (
          <a className="hub-game-row" href={game.href} key={game.id}>
            <div className="hub-game-row__info">
              <strong>{game.name}</strong>
              <p>{game.summary}</p>
            </div>
            <small>{game.latestLabel}</small>
          </a>
        ))}
      </div>
    </div>
  );
}
