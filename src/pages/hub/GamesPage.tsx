import { useHubViewModel } from '../../data/hub/hubSelectors';

export function GamesPage() {
  const { hubGameCards } = useHubViewModel();
  const flagshipGame = hubGameCards.find((game) => game.slug === 'among-us') ?? hubGameCards[0];
  const supportingFlagships = hubGameCards.filter(
    (game) => game.isFlagship && game.id !== flagshipGame?.id,
  );
  const supportingGames = hubGameCards.filter((game) => !game.isFlagship);

  return (
    <div className="page page--hub-games">
      <section className="hub-games-launch" aria-label="Game world selection">
        <div className="page-header">
          <span className="page-header__marker">Play side</span>
          <h1>Choose a game gate.</h1>
          <p>Where the room competes, laughs, argues, and remembers who showed up.</p>
        </div>

        <div className="hub-games-flagship-grid">
          {flagshipGame ? (
            <a className="hub-games-flagship" href={flagshipGame.href ?? '#/games'}>
              <div className="hub-games-flagship__topline">
                <span>Active flagship game</span>
                <small>Gate open</small>
              </div>

              <div className="hub-games-flagship__body">
                <strong>{flagshipGame.name}</strong>
                <p>{flagshipGame.summary}</p>
              </div>

              <div className="hub-games-flagship__meta">
                <article>
                  <span>Latest pulse</span>
                  <strong>{flagshipGame.latestLabel}</strong>
                </article>
                <article>
                  <span>Why enter</span>
                  <strong>Competition, reads, and receipts the room keeps replaying.</strong>
                </article>
              </div>
              <span className="object-activation">Enter game</span>
            </a>
          ) : null}

          {supportingFlagships.map((game) => (
            <article className={`hub-games-card hub-games-card--flagship hub-games-card--${game.slug}`} key={game.id}>
              <div className="hub-games-card__topline">
                <span>{game.slug === 'leap-of-legends' ? 'Parallel flagship game' : 'Flagship game'}</span>
                <small>{game.slug === 'leap-of-legends' ? 'Comeback gate' : game.latestLabel}</small>
              </div>

              <div className="hub-games-card__body">
                <strong>{game.name}</strong>
                <p>{game.summary}</p>
              </div>

              <div className="hub-games-card__meta">
                <span>Current run</span>
                <small>{game.slug === 'leap-of-legends' ? game.latestLabel : 'Core Olympus Prime game'}</small>
              </div>
              <span className="object-activation">Open gate</span>
            </article>
          ))}
        </div>
      </section>

      <section className="hub-games-secondary" aria-label="Other worlds to enter">
        <div className="hub-home-section__header">
          <span>Other gates</span>
        </div>

        <div className="hub-games-secondary__stack">
          {supportingGames.map((game) => (
            <a className="hub-games-card" href={game.href ?? '#/games'} key={game.id}>
              <div className="hub-games-card__topline">
                <span>{game.theme}</span>
                <small>Gate</small>
              </div>

              <div className="hub-games-card__body">
                <strong>{game.name}</strong>
                <p>{game.summary}</p>
              </div>

              <div className="hub-games-card__meta">
                <span>Latest pulse</span>
                <small>{game.latestLabel}</small>
              </div>
              <span className="object-activation">Open gate</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
