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
          <span className="page-header__marker">Realm Gate</span>
          <h1>Select a realm gate.</h1>
          <p>Each game is a gate. Among Us is live now; Leap of Legends is the other flagship, built for swings, clutch finishes, and nights that become stories fast.</p>
        </div>

        <div className="hub-games-flagship-grid">
          {flagshipGame ? (
            <a className="hub-games-flagship" href={flagshipGame.href ?? '#/games'}>
              <div className="hub-games-flagship__topline">
                <span>Active flagship realm</span>
                <small>Gate open</small>
              </div>

              <div className="hub-games-flagship__body">
                <strong>{flagshipGame.name}</strong>
                <p>{flagshipGame.summary}</p>
              </div>

              <div className="hub-games-flagship__meta">
                <article>
                  <span>Latest signal</span>
                  <strong>{flagshipGame.latestLabel}</strong>
                </article>
                <article>
                  <span>Realm pull</span>
                  <strong>Olympus Prime’s strongest active memory realm.</strong>
                </article>
              </div>
              <span className="object-activation">Enter realm</span>
            </a>
          ) : null}

          {supportingFlagships.map((game) => (
            <article className={`hub-games-card hub-games-card--flagship hub-games-card--${game.slug}`} key={game.id}>
              <div className="hub-games-card__topline">
                <span>{game.slug === 'leap-of-legends' ? 'Parallel flagship realm' : 'Flagship realm'}</span>
                <small>{game.slug === 'leap-of-legends' ? 'Momentum gate' : game.latestLabel}</small>
              </div>

              <div className="hub-games-card__body">
                <strong>{game.name}</strong>
                <p>{game.summary}</p>
              </div>

              <div className="hub-games-card__meta">
                <span>Realm state</span>
                <small>{game.slug === 'leap-of-legends' ? game.latestLabel : 'Core Olympus Prime realm'}</small>
              </div>
              <span className="object-activation">Signal gate</span>
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
                <span>Latest signal</span>
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
