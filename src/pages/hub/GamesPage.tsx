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
          <h1>Choose a world.</h1>
          <p>Open the strongest Olympus Prime game worlds and step into the one the community is most alive in right now.</p>
        </div>

        {flagshipGame ? (
          <a className="hub-games-flagship" href={flagshipGame.href ?? '#/games'}>
            <div className="hub-games-flagship__topline">
              <span>Flagship world</span>
              <small>Open now</small>
            </div>

            <div className="hub-games-flagship__body">
              <strong>{flagshipGame.name}</strong>
              <p>{flagshipGame.summary}</p>
            </div>

            <div className="hub-games-flagship__meta">
              <article>
                <span>Latest</span>
                <strong>{flagshipGame.latestLabel}</strong>
              </article>
              <article>
                <span>Why enter</span>
                <strong>Olympus Prime’s strongest active memory world.</strong>
              </article>
            </div>
          </a>
        ) : null}
      </section>

      {supportingFlagships.length ? (
        <section className="hub-games-secondary" aria-label="Other flagship worlds">
          <div className="hub-home-section__header">
            <span>Other flagship worlds</span>
          </div>

          <div className="hub-games-secondary__stack">
            {supportingFlagships.map((game) => (
              <article className="hub-games-card hub-games-card--flagship" key={game.id}>
                <div className="hub-games-card__topline">
                  <span>Flagship world</span>
                  <small>{game.latestLabel}</small>
                </div>

                <div className="hub-games-card__body">
                  <strong>{game.name}</strong>
                  <p>{game.summary}</p>
                </div>

                <div className="hub-games-card__meta">
                  <span>Status</span>
                  <small>Core Olympus Prime world</small>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="hub-games-secondary" aria-label="Other worlds to enter">
        <div className="hub-home-section__header">
          <span>Other worlds</span>
        </div>

        <div className="hub-games-secondary__stack">
          {supportingGames.map((game) => (
            <a className="hub-games-card" href={game.href ?? '#/games'} key={game.id}>
              <div className="hub-games-card__topline">
                <span>{game.theme}</span>
                <small>Enter</small>
              </div>

              <div className="hub-games-card__body">
                <strong>{game.name}</strong>
                <p>{game.summary}</p>
              </div>

              <div className="hub-games-card__meta">
                <span>Latest</span>
                <small>{game.latestLabel}</small>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
