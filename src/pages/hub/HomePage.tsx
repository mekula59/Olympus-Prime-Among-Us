import { XPostEmbed } from '../../components/social/XPostEmbed';
import { useHubViewModel } from '../../data/hub/hubSelectors';

export function HomePage() {
  const { currentSeasonDetail, featuredPlayers, hubGameCards, hubHomeFeatures, yearbookEntries } =
    useHubViewModel();
  const primaryFeature = hubHomeFeatures[0];
  const supportingFeatures = hubHomeFeatures.slice(1, 3);
  const flagshipGame = hubGameCards.find((game) => game.slug === 'among-us') ?? hubGameCards[0];
  const leapWorld = hubGameCards.find((game) => game.slug === 'leap-of-legends');
  const worldLinks: Array<{
    id: string;
    title: string;
    detail: string;
    href: string;
    badge: string;
    state: string;
    featured?: boolean;
  }> = [
    {
      id: 'among-us',
      title: 'Among Us',
      detail: flagshipGame?.summary ?? 'The flagship game room for reads, rivalry, and replay-worthy nights.',
      href: flagshipGame?.href ?? '#/games/among-us',
      badge: 'Active game',
      state: 'Live room',
      featured: true,
    },
    {
      id: 'leap-of-legends',
      title: 'Leap of Legends',
      detail: leapWorld?.summary ?? 'Built for comebacks, clutch saves, and plays the room keeps replaying.',
      href: leapWorld?.href ?? '#/games',
      badge: 'Flagship game',
      state: leapWorld?.latestLabel ?? 'Room forming',
    },
    {
      id: 'players',
      title: 'Member files',
      detail: 'Meet the people who trade, play, build, and keep the room alive.',
      href: '#/players',
      badge: 'Dossiers',
      state: 'Roster indexed',
    },
    {
      id: 'seasons',
      title: 'Community eras',
      detail: 'Track market runs, game nights, loud wins, and the moments people keep bringing up.',
      href: '#/seasons',
      badge: 'Chronicle',
      state: 'Chapters active',
    },
    {
      id: 'yearbook',
      title: 'Culture vault',
      detail: 'Open the lines, wins, plays, calls, and memories that made Olympus Prime feel alive.',
      href: '#/yearbook',
      badge: 'Vault',
      state: 'Memories held',
    },
    {
      id: 'games',
      title: 'Game gates',
      detail: 'Step into the play side of Olympus Prime.',
      href: '#/games',
      badge: 'Games',
      state: 'All gates',
    },
  ];
  const featuredMemory = yearbookEntries[1] ?? yearbookEntries[0];
  const xProfileUrl = import.meta.env.VITE_OLYMPUS_X_PROFILE_URL ?? '';
  const xFeaturedPostUrl = import.meta.env.VITE_OLYMPUS_X_FEATURED_POST_URL ?? '';
  const showPublicSignal = Boolean(xFeaturedPostUrl || xProfileUrl);
  const publicSignalPostUrl = xFeaturedPostUrl || xProfileUrl;
  const featuredNames = featuredPlayers.slice(0, 3).map((player) => player.callsign);
  const deeperActions = [
    { label: 'Read latest recap', href: primaryFeature?.href ?? '#/games/among-us/reports' },
    { label: 'Open Among Us', href: flagshipGame?.href ?? '#/games/among-us' },
    { label: 'Browse games', href: '#/games' },
    { label: 'Browse members', href: '#/players' },
    { label: 'View community eras', href: '#/seasons' },
  ];

  return (
    <div className="page page--hub-home">
      <section className="hub-launch-scene" aria-label="Olympus Prime opening scene">
        <div className="hub-launch-scene__copy">
          <p className="hub-launch-scene__eyebrow hub-launch-scene__eyebrow--brand">
            <img src="/brand/selected/olympus-prime-wordmark.svg" alt="" />
          </p>
          <h1>Enter Olympus Prime.</h1>
          <p className="hub-launch-scene__lede">
            Olympus Prime is where Web3 traders, gamers, and builders come to trade, play, build, and belong.
          </p>
          <a className="hub-launch-scene__action" href={primaryFeature?.href ?? '#/games/among-us/reports'}>
            Enter the live room
          </a>
        </div>

        <div className="hub-launch-scene__centerpiece">
          {primaryFeature ? (
            <a className="hub-scene-card" href={primaryFeature.href}>
              <div className="hub-scene-card__topline">
                <span>{primaryFeature.label}</span>
                <small>Latest pulse</small>
              </div>
              <strong>{primaryFeature.title}</strong>
              <p>{primaryFeature.detail}</p>

              <div className="hub-scene-card__pulse">
                <article>
                  <span>Era</span>
                  <strong>{currentSeasonDetail?.name ?? 'Season pending'}</strong>
                </article>
                <article>
                  <span>Dossiers</span>
                  <strong>{featuredNames.join(' · ') || 'Crew loading'}</strong>
                </article>
              </div>
              <span className="object-activation">Enter room</span>
            </a>
          ) : null}
        </div>
      </section>

      {showPublicSignal ? (
        <section className="hub-home-signal" aria-label="Public pulse">
          <div className="hub-home-section__header">
            <span>Public pulse</span>
          </div>

          <div className="hub-home-signal__shell">
            <div className="hub-home-signal__intro">
              <span>From Olympus Prime on X</span>
              <strong>Latest public pulse.</strong>
            </div>

            <div className="hub-home-signal__body">
              <article className="hub-home-signal__native">
                <div className="hub-home-signal__native-copy">
                  <span>Featured post</span>
                  <strong>Public pulse, not the whole night.</strong>
                  <p>
                    Trade talk, game nights, rivalries, wins, and the moments that turn a room into a real community.
                  </p>
                </div>

                <div className="hub-home-signal__actions">
                  {publicSignalPostUrl ? (
                    <a className="secondary-link" href={publicSignalPostUrl} rel="noreferrer" target="_blank">
                      View on X
                    </a>
                  ) : null}
                  {xProfileUrl && xProfileUrl !== publicSignalPostUrl ? (
                    <a
                      className="secondary-link secondary-link--quiet"
                      href={xProfileUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open Olympus Prime on X
                    </a>
                  ) : null}
                </div>
              </article>

              {xFeaturedPostUrl ? (
                <div className="hub-home-signal__embed" aria-label="X embed preview">
                  <XPostEmbed postUrl={xFeaturedPostUrl} />
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="hub-current-state" aria-label="Current world state">
        <div className="hub-home-section__header">
          <span>What’s live</span>
        </div>

        <div className="hub-current-state__stack">
          {supportingFeatures.map((feature) => (
            <article className="hub-state-card" key={feature.title}>
              <span>{feature.label}</span>
              <strong>{feature.title}</strong>
              <p>{feature.detail}</p>
            </article>
          ))}

          <article className="hub-state-card hub-state-card--players">
            <span>Member spotlight</span>
            <strong>{featuredNames.join(' · ') || 'Room regulars loading'}</strong>
            <p>The members shaping the room, carrying streaks, and setting the tone.</p>
          </article>
        </div>
      </section>

      <section className="hub-worlds-entry" aria-label="Worlds to enter">
        <div className="hub-home-section__header">
          <span>Game gates</span>
        </div>

        <div className="hub-world-grid">
          {worldLinks.map((world) => (
            <a
              className={`hub-world-card hub-world-card--${world.id} ${world.featured ? 'hub-world-card--featured' : ''}`}
              href={world.href}
              key={world.id}
            >
              <div className="hub-world-card__topline">
                <span>{world.badge}</span>
                <small>{world.state}</small>
              </div>

              <div className="hub-world-card__body">
                <strong>{world.title}</strong>
                <p>{world.detail}</p>
              </div>
              <span className="object-activation">{world.featured ? 'Enter game' : 'Open gate'}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="hub-home-note" aria-label="Why this exists">
        <p>Trading, building, gaming, and inside jokes all leave a mark here.</p>
      </section>

      {featuredMemory ? (
        <section className="hub-home-memory hub-home-memory--featured" aria-label="Featured memory">
          <span>Saved memory</span>
          <blockquote>{featuredMemory.detail}</blockquote>
          <p>{featuredMemory.note}</p>
        </section>
      ) : null}

      <section className="hub-home-deeper" aria-label="Go deeper">
        <div className="hub-home-section__header">
          <span>Go deeper</span>
        </div>

        <div className="hub-home-deeper__actions">
          {deeperActions.map((action) => (
            <a className="hub-home-deeper__action" href={action.href} key={action.label}>
              <strong>{action.label}</strong>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
