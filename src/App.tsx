import { useAuthState } from './auth/authStore';
import { OpsAccessGate } from './components/auth/OpsAccessGate';
import { AmongUsModuleHeader } from './components/shell/AmongUsModuleHeader';
import { HubShell } from './components/shell/HubShell';
import type { AppRouteId } from './config/routes';
import { useHashRoute } from './hooks/useHashRoute';
import { AmongUsArchivePage } from './pages/games/among-us/AmongUsArchivePage';
import { AmongUsOverviewPage } from './pages/games/among-us/AmongUsOverviewPage';
import { AmongUsPlayersPage } from './pages/games/among-us/AmongUsPlayersPage';
import { AmongUsRankingsPage } from './pages/games/among-us/AmongUsRankingsPage';
import { AmongUsReportPage } from './pages/games/among-us/AmongUsReportPage';
import { AmongUsSessionsPage } from './pages/games/among-us/AmongUsSessionsPage';
import { GamesPage } from './pages/hub/GamesPage';
import { HomePage } from './pages/hub/HomePage';
import { PlayerProfilePage } from './pages/hub/PlayerProfilePage';
import { PlayersPage } from './pages/hub/PlayersPage';
import { SeasonDetailPage } from './pages/hub/SeasonDetailPage';
import { SeasonsPage } from './pages/hub/SeasonsPage';
import { YearbookPage } from './pages/hub/YearbookPage';
import { AmongUsOpsSessionPage } from './pages/ops/among-us/AmongUsOpsSessionPage';
import { OpsHomePage } from './pages/ops/OpsHomePage';
import { SessionEditorPage } from './pages/ops/SessionEditorPage';
import './styles/index.css';

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
    case 'ops':
      return <OpsHomePage />;
    case 'ops-session-new':
    case 'ops-session-edit':
      return <SessionEditorPage />;
    case 'ops-among-us':
    case 'ops-among-us-session':
      return <AmongUsOpsSessionPage />;
    default:
      return <AmongUsOverviewPage />;
  }
}

function App() {
  const { path, route } = useHashRoute();
  const auth = useAuthState();
  const showOpsGate = route.section === 'ops' && !(auth.status === 'ready' && auth.isMember);

  return (
    <div className={`app-shell app-shell--${route.id}`}>
      <div className="ambient ambient--one" aria-hidden="true" />
      <div className="ambient ambient--two" aria-hidden="true" />
      <div className="ambient ambient--three" aria-hidden="true" />

      <HubShell
        currentPath={path}
        currentRoute={route}
        moduleHeader={
          route.path.startsWith('/games/among-us') ? <AmongUsModuleHeader currentPath={path} /> : null
        }
      >
        {showOpsGate ? <OpsAccessGate /> : renderPage(route.id)}
      </HubShell>
    </div>
  );
}

export default App;
