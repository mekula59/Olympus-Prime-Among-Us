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
      detail: flagshipGame?.summary ?? 'The flagship social-deduction world inside Olympus Prime.',
      href: flagshipGame?.href ?? '#/games/among-us',
      badge: 'Flagship world',
      state: 'Live memory lane',
      featured: true,
    },
    {
      id: 'leap-of-legends',
      title: 'Leap of Legends',
      detail:
        leapWorld?.summary ??
        'A flagship Olympus Prime world for momentum swings, remembered finishes, and chapter-level nights.',
      href: leapWorld?.href ?? '#/games',
      badge: 'Flagship world',
      state: leapWorld?.latestLabel ?? 'Core world history',
    },
    {
      id: 'players',
      title: 'Players',
      detail: 'Follow the people who keep shaping the room and carrying the stories forward.',
      href: '#/players',
      badge: 'Identity',
      state: 'Recurring regulars',
    },
    {
      id: 'seasons',
      title: 'Seasons',
      detail: 'Track how each run of gamesnight changes across sessions, themes, and standouts.',
      href: '#/seasons',
      badge: 'Archive',
      state: 'Runs over time',
    },
    {
      id: 'yearbook',
      title: 'Yearbook',
      detail: 'Open the remembered lines, titles, and moments that keep coming back.',
      href: '#/yearbook',
      badge: 'Memory',
      state: 'Retold moments',
    },
    {
      id: 'games',
      title: 'Games',
      detail: 'Step into the worlds Olympus Prime keeps returning to night after night.',
      href: '#/games',
      badge: 'Launcher',
      state: 'All active worlds',
    },
  ];
  const featuredMemory = yearbookEntries[1] ?? yearbookEntries[0];
  const xProfileUrl = import.meta.env.VITE_OLYMPUS_X_PROFILE_URL ?? '';
  const xFeaturedPostUrl = import.meta.env.VITE_OLYMPUS_X_FEATURED_POST_URL ?? '';
  const showPublicSignal = Boolean(xProfileUrl);
  const featuredNames = featuredPlayers.slice(0, 3).map((player) => player.callsign);
  const deeperActions = [
    { label: 'Read latest recap', href: primaryFeature?.href ?? '#/games/among-us/reports' },
    { label: 'Open Among Us', href: flagshipGame?.href ?? '#/games/among-us' },
    { label: 'Browse game worlds', href: '#/games' },
    { label: 'Browse players', href: '#/players' },
    { label: 'View season archive', href: '#/seasons' },
  ];

  return (
    <div className="page page--hub-home">
      <section className="hub-launch-scene" aria-label="Olympus Prime opening scene">
        <div className="hub-launch-scene__copy">
          <p className="hub-launch-scene__eyebrow">Olympus Prime</p>
          <h1>Enter the nights they keep building together.</h1>
          <p className="hub-launch-scene__lede">
            Gamesnight Hub is the world layer for Olympus Prime: live in Discord, remembered here, and reopened whenever the story keeps going.
          </p>
          <a className="hub-launch-scene__action" href={primaryFeature?.href ?? '#/games/among-us/reports'}>
            Read latest recap
          </a>
        </div>

        <div className="hub-launch-scene__centerpiece">
          {primaryFeature ? (
            <a className="hub-scene-card" href={primaryFeature.href}>
              <div className="hub-scene-card__topline">
                <span>{primaryFeature.label}</span>
                <small>Opening scene</small>
              </div>
              <strong>{primaryFeature.title}</strong>
              <p>{primaryFeature.detail}</p>

              <div className="hub-scene-card__pulse">
                <article>
                  <span>Season</span>
                  <strong>{currentSeasonDetail?.name ?? 'Season pending'}</strong>
                </article>
                <article>
                  <span>Players</span>
                  <strong>{featuredNames.join(' · ') || 'Crew loading'}</strong>
                </article>
              </div>
            </a>
          ) : null}
        </div>
      </section>

      <section className="hub-current-state" aria-label="Current world state">
        <div className="hub-home-section__header">
          <span>Current world state</span>
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
            <span>Featured players</span>
            <strong>{featuredNames.join(' · ') || 'Room regulars loading'}</strong>
            <p>The people currently shaping the room, carrying streaks, and setting the tone.</p>
          </article>
        </div>
      </section>

      <section className="hub-worlds-entry" aria-label="Worlds to enter">
        <div className="hub-home-section__header">
          <span>Worlds to enter</span>
        </div>

        <div className="hub-world-grid">
          {worldLinks.map((world) => (
            <a
              className={`hub-world-card ${world.featured ? 'hub-world-card--featured' : ''}`}
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
            </a>
          ))}
        </div>
      </section>

      <section className="hub-home-note" aria-label="Why this exists">
        <p>Discord is where the night happens. The Hub is where the night becomes story.</p>
      </section>

      {showPublicSignal ? (
        <section className="hub-home-signal" aria-label="Public signal">
          <div className="hub-home-section__header">
            <span>Public signal</span>
          </div>

          <div className="hub-home-signal__shell">
            <div className="hub-home-signal__intro">
              <span>From Olympus Prime on X</span>
              <strong>Public pulse, not the whole night.</strong>
              <p>
                Discord is still where the room lives. X is the public signal layer when Olympus Prime wants the wider world to feel the motion.
              </p>
            </div>

            <div className="hub-home-signal__body">
              {xFeaturedPostUrl ? (
                <XPostEmbed postUrl={xFeaturedPostUrl} />
              ) : (
                <div className="hub-home-signal__fallback">
                  <strong>Olympus Prime on X</strong>
                  <p>Open the public profile for the latest signal from the world outside Discord.</p>
                </div>
              )}
            </div>

            <div className="hub-home-signal__actions">
              <a className="secondary-link" href={xProfileUrl} rel="noreferrer" target="_blank">
                View Olympus Prime on X
              </a>
            </div>
          </div>
        </section>
      ) : null}

      {featuredMemory ? (
        <section className="hub-home-memory hub-home-memory--featured" aria-label="Featured memory">
          <span>Featured memory</span>
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
