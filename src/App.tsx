import { ModuleFrame } from './components/ModuleFrame';
import { AmongUsModuleHeader } from './components/shell/AmongUsModuleHeader';
import { HubShell } from './components/shell/HubShell';
import type { AppRouteId } from './config/routes';
import { usePublicSyncState } from './hooks/usePublicSyncState';
import { useHashRoute } from './hooks/useHashRoute';
import { OpsConsolePage } from './pages/OpsConsolePage';
import { AmongUsArchivePage } from './pages/games/among-us/AmongUsArchivePage';
import { AmongUsIncidentsPage } from './pages/games/among-us/AmongUsIncidentsPage';
import { AmongUsLegendsPage } from './pages/games/among-us/AmongUsLegendsPage';
import { AmongUsOverviewPage } from './pages/games/among-us/AmongUsOverviewPage';
import { AmongUsPlayersPage } from './pages/games/among-us/AmongUsPlayersPage';
import { AmongUsRankingsPage } from './pages/games/among-us/AmongUsRankingsPage';
import { AmongUsReportPage } from './pages/games/among-us/AmongUsReportPage';
import { AmongUsSessionsPage } from './pages/games/among-us/AmongUsSessionsPage';
import { AmongUsTransmissionsPage } from './pages/games/among-us/AmongUsTransmissionsPage';
import { GamesPage } from './pages/hub/GamesPage';
import { HomePage } from './pages/hub/HomePage';
import { PlayerProfilePage } from './pages/hub/PlayerProfilePage';
import { PlayersPage } from './pages/hub/PlayersPage';
import { SeasonDetailPage } from './pages/hub/SeasonDetailPage';
import { SeasonsPage } from './pages/hub/SeasonsPage';
import { YearbookPage } from './pages/hub/YearbookPage';
import './styles/index.css';

interface HubPlaceholderPageProps {
  eyebrow: string;
  title: string;
  lede: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

function HubPlaceholderPage({
  eyebrow,
  title,
  lede,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: HubPlaceholderPageProps) {
  return (
    <div className="page page--hub-placeholder">
      <ModuleFrame
        eyebrow={eyebrow}
        title={title}
        lede={lede}
        className="hub-placeholder"
      >
        <div className="hub-placeholder__actions">
          <a className="primary-link" href={primaryHref}>
            {primaryLabel}
          </a>
          {secondaryHref && secondaryLabel ? (
            <a className="secondary-link" href={secondaryHref}>
              {secondaryLabel}
            </a>
          ) : null}
        </div>
      </ModuleFrame>
    </div>
  );
}

function renderPage(routeId: AppRouteId) {
  switch (routeId) {
    case 'home':
      return <HomePage />;
    case 'players':
      return <PlayersPage />;
    case 'player-profile':
      return <PlayerProfilePage />;
    case 'seasons':
      return <SeasonsPage />;
    case 'season-detail':
      return <SeasonDetailPage />;
    case 'yearbook':
      return <YearbookPage />;
    case 'games':
      return <GamesPage />;
    case 'among-us-overview':
      return <AmongUsOverviewPage />;
    case 'among-us-rankings':
      return <AmongUsRankingsPage />;
    case 'among-us-players':
      return <AmongUsPlayersPage />;
    case 'among-us-sessions':
      return <AmongUsSessionsPage />;
    case 'among-us-reports':
      return <AmongUsReportPage />;
    case 'among-us-archive':
      return <AmongUsArchivePage />;
    case 'among-us-legends':
      return <AmongUsLegendsPage />;
    case 'among-us-incidents':
      return <AmongUsIncidentsPage />;
    case 'among-us-transmissions':
      return <AmongUsTransmissionsPage />;
    case 'ops':
      return (
        <HubPlaceholderPage
          eyebrow="Ops"
          title="Broad Ops route reserved."
          lede="This route will become the generic gamesnight entry and publish layer. The full staged session engine remains available under Among Us Ops during the transition."
          primaryHref="#/ops/among-us"
          primaryLabel="Open Among Us Ops"
          secondaryHref="#/"
          secondaryLabel="Back to Hub"
        />
      );
    case 'ops-among-us':
      return <OpsConsolePage />;
    default:
      return <AmongUsOverviewPage />;
  }
}

function App() {
  const { path, route } = useHashRoute();
  const { shell, sync } = usePublicSyncState();

  return (
    <div className={`app-shell app-shell--${route.id}`}>
      <div className="ambient ambient--one" aria-hidden="true" />
      <div className="ambient ambient--two" aria-hidden="true" />
      <div className="ambient ambient--three" aria-hidden="true" />

      <HubShell
        currentPath={path}
        currentRoute={route}
        shellTitle={shell.title}
        shellDetail={route.section === 'hub' ? route.blurb : shell.detail}
        shellStatus={route.section === 'hub' ? route.stateLabel : sync.phaseLabel}
        noteTitle="Discord first"
        noteDetail="Discord remains the live home for Olympus Prime. The site is shifting into the memory, identity, archive, and recap layer."
        moduleHeader={
          route.path.startsWith('/games/among-us') ? <AmongUsModuleHeader currentPath={path} /> : null
        }
      >
        {renderPage(route.id)}
      </HubShell>
    </div>
  );
}

export default App;
