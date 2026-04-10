import { navigationGroups, railRumors, routeOrder, routes } from './data/hqData';
import { useHashRoute } from './hooks/useHashRoute';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { CrewFilePage } from './pages/CrewFilePage';
import { CrewRankingsPage } from './pages/CrewRankingsPage';
import { IncidentBoardPage } from './pages/IncidentBoardPage';
import { MissionLogsPage } from './pages/MissionLogsPage';
import { MissionReportPage } from './pages/MissionReportPage';
import { OpsConsolePage } from './pages/OpsConsolePage';
import { PrimeLegendsArchivePage } from './pages/PrimeLegendsArchivePage';
import { TransmissionReportsPage } from './pages/TransmissionReportsPage';
import type { RouteId } from './types/hq';
import './styles/index.css';

const groupLabels = {
  HQ: 'SIM',
  Records: 'LOG',
  Ops: 'OPS',
} as const;

const routeStateLabels: Record<RouteId, string> = {
  'command-center': 'Lobby',
  'crew-rankings': 'Board',
  'crew-file': 'File',
  'mission-logs': 'Replay',
  'mission-report': 'Report',
  'prime-legends-archive': 'Legend',
  'incident-board': 'Alert',
  'transmission-reports': 'Signal',
  'ops-console': 'Host',
};

function renderPage(route: RouteId) {
  switch (route) {
    case 'command-center':
      return <CommandCenterPage />;
    case 'crew-rankings':
      return <CrewRankingsPage />;
    case 'crew-file':
      return <CrewFilePage />;
    case 'mission-logs':
      return <MissionLogsPage />;
    case 'mission-report':
      return <MissionReportPage />;
    case 'prime-legends-archive':
      return <PrimeLegendsArchivePage />;
    case 'incident-board':
      return <IncidentBoardPage />;
    case 'transmission-reports':
      return <TransmissionReportsPage />;
    case 'ops-console':
      return <OpsConsolePage />;
    default:
      return <CommandCenterPage />;
  }
}

function App() {
  const route = useHashRoute();
  const currentRoute = routes.find((entry) => entry.id === route) ?? routes[0];

  return (
    <div className={`app-shell app-shell--${route}`}>
      <div className="ambient ambient--one" aria-hidden="true" />
      <div className="ambient ambient--two" aria-hidden="true" />
      <div className="ambient ambient--three" aria-hidden="true" />

      <div className="hq-layout">
        <aside className="nav-rail">
          <a className="brand-mark" href="#/command-center" aria-label="Olympus Prime command center">
            <img src="/assets/olympus-signal.svg" alt="" />
            <span>
              Olympus Prime
              <strong>Among Us HQ</strong>
            </span>
          </a>

          <div className="shell-state">
            <p className="section-kicker">SIM STATE</p>
            <div className="shell-state__row">
              <strong>LIVE</strong>
              <span>{routeStateLabels[route]}</span>
            </div>
            <p>{currentRoute.cue}</p>
          </div>

          <section className="rail-hum rail-hum--system" aria-label="Ship chatter">
            <div className="rail-hum__lights">
              <span className="rail-hum__light rail-hum__light--warm" aria-hidden="true" />
              <span className="rail-hum__light rail-hum__light--cool" aria-hidden="true" />
              <span className="rail-hum__light rail-hum__light--hot" aria-hidden="true" />
            </div>
            <div className="rail-hum__copy">
              {railRumors.map((item) => (
                <article className="rail-hum__item" key={item.title}>
                  <span>{item.title}</span>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <nav className="route-groups" aria-label="Primary navigation">
            {navigationGroups.map((group) => (
              <section className="route-group" key={group}>
                <p>{groupLabels[group]}</p>
                <div className="route-group__links">
                  {routeOrder
                    .map((id) => routes.find((routeItem) => routeItem.id === id)!)
                    .filter((routeItem) => routeItem.group === group)
                    .map((routeItem) => (
                      <a
                        className={`nav-chip ${routeItem.id === route ? 'nav-chip--active' : ''}`}
                        href={`#/${routeItem.id}`}
                        key={routeItem.id}
                      >
                        <span>{routeStateLabels[routeItem.id]}</span>
                        <strong>{routeItem.shortLabel}</strong>
                        <small>{routeItem.id === route ? 'LIVE' : 'LOAD'}</small>
                      </a>
                    ))}
                </div>
              </section>
            ))}
          </nav>
        </aside>

        <div className="bridge-column">
          <header className="bridge-header">
            <div>
              <p className="section-kicker">ROOM</p>
              <h2>{currentRoute.label}</h2>
              <p>{currentRoute.blurb}</p>
            </div>

            <div className="bridge-header__signals" aria-label="Current route details">
              <article>
                <span>Mode</span>
                <strong>{routeStateLabels[route]}</strong>
              </article>
              <article>
                <span>Deck</span>
                <strong>{currentRoute.deck}</strong>
              </article>
              <article>
                <span>Band</span>
                <strong>{currentRoute.group}</strong>
              </article>
            </div>
          </header>

          <main className="page-stage" key={route}>
            {renderPage(route)}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
