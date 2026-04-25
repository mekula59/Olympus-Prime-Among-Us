export type AppRouteId =
  | 'home'
  | 'players'
  | 'player-profile'
  | 'seasons'
  | 'season-detail'
  | 'yearbook'
  | 'games'
  | 'among-us-overview'
  | 'among-us-rankings'
  | 'among-us-players'
  | 'among-us-sessions'
  | 'among-us-reports'
  | 'among-us-archive'
  | 'ops'
  | 'ops-session-new'
  | 'ops-session-edit'
  | 'ops-among-us'
  | 'ops-among-us-session';

export type AppRouteSection = 'hub' | 'games' | 'ops';
export type AppRouteShell = 'hub' | 'among-us';

export interface AppRoute {
  id: AppRouteId;
  path: string;
  matchPath?: RegExp;
  label: string;
  shortLabel: string;
  section: AppRouteSection;
  shell: AppRouteShell;
  stateLabel: string;
  blurb: string;
  nav: 'bottom' | 'module' | 'hidden';
}

export const appRoutes: AppRoute[] = [
  {
    id: 'home',
    path: '/',
    label: 'Gamesnight Hub',
    shortLabel: 'Home',
    section: 'hub',
    shell: 'hub',
    stateLabel: 'Hub',
    blurb: 'A calm memory layer for Olympus Prime sessions, player identity, and recurring nights that start in Discord.',
    nav: 'bottom',
  },
  {
    id: 'players',
    path: '/players',
    label: 'Recurring Players',
    shortLabel: 'Players',
    section: 'hub',
    shell: 'hub',
    stateLabel: 'Players',
    blurb: 'The cross-game player layer for attendance, identity, and the people who keep showing up.',
    nav: 'bottom',
  },
  {
    id: 'player-profile',
    path: '/players/profile',
    label: 'Player Profile',
    shortLabel: 'Profile',
    section: 'hub',
    shell: 'hub',
    stateLabel: 'Profile',
    blurb: 'A cross-game identity page for one Olympus Prime regular.',
    nav: 'hidden',
  },
  {
    id: 'seasons',
    path: '/seasons',
    label: 'Seasons',
    shortLabel: 'Seasons',
    section: 'hub',
    shell: 'hub',
    stateLabel: 'Seasons',
    blurb: 'The archive backbone for recurring gamesnights, recaps, and season memories.',
    nav: 'bottom',
  },
  {
    id: 'season-detail',
    path: '/seasons/current',
    label: 'Season Detail',
    shortLabel: 'Season',
    section: 'hub',
    shell: 'hub',
    stateLabel: 'Season',
    blurb: 'A season-level recap space for sessions, players, and notable moments.',
    nav: 'hidden',
  },
  {
    id: 'yearbook',
    path: '/yearbook',
    label: 'Yearbook',
    shortLabel: 'Yearbook',
    section: 'hub',
    shell: 'hub',
    stateLabel: 'Yearbook',
    blurb: 'A hall of fame layer for standout quotes, titles, and yearly memory snapshots.',
    nav: 'bottom',
  },
  {
    id: 'games',
    path: '/games',
    label: 'Games',
    shortLabel: 'Games',
    section: 'games',
    shell: 'hub',
    stateLabel: 'Games',
    blurb: 'A game index with Among Us as the flagship memory module inside the broader Hub.',
    nav: 'bottom',
  },
  {
    id: 'among-us-overview',
    path: '/games/among-us',
    label: 'Among Us',
    shortLabel: 'Overview',
    section: 'games',
    shell: 'among-us',
    stateLabel: 'Overview',
    blurb: 'The flagship module for Olympus Prime Among Us nights, recaps, rankings, and memory-rich reports.',
    nav: 'module',
  },
  {
    id: 'among-us-rankings',
    path: '/games/among-us/rankings',
    label: 'Among Us Rankings',
    shortLabel: 'Rankings',
    section: 'games',
    shell: 'among-us',
    stateLabel: 'Rankings',
    blurb: 'A polished memory board for who owned the room, read the crew, and closed the night best.',
    nav: 'module',
  },
  {
    id: 'among-us-players',
    path: '/games/among-us/players',
    label: 'Among Us Players',
    shortLabel: 'Players',
    section: 'games',
    shell: 'among-us',
    stateLabel: 'Players',
    blurb: 'A game-specific player entry layer for crew reads, tells, and familiar room patterns.',
    nav: 'module',
  },
  {
    id: 'among-us-sessions',
    path: '/games/among-us/sessions',
    label: 'Among Us Sessions',
    shortLabel: 'Sessions',
    section: 'games',
    shell: 'among-us',
    stateLabel: 'Sessions',
    blurb: 'The running archive of Among Us sessions, rounds, and turning points worth replaying.',
    nav: 'module',
  },
  {
    id: 'among-us-reports',
    path: '/games/among-us/reports',
    label: 'Among Us Reports',
    shortLabel: 'Reports',
    section: 'games',
    shell: 'among-us',
    stateLabel: 'Reports',
    blurb: 'The recap and debrief lane for polished session summaries and published room memory.',
    nav: 'module',
  },
  {
    id: 'among-us-archive',
    path: '/games/among-us/archive',
    label: 'Among Us Archive',
    shortLabel: 'Archive',
    section: 'games',
    shell: 'among-us',
    stateLabel: 'Archive',
    blurb: 'The long-tail memory layer for legends, incidents, and signal fragments that outlive a single night.',
    nav: 'module',
  },
  {
    id: 'ops',
    path: '/ops',
    label: 'Ops',
    shortLabel: 'Ops',
    section: 'ops',
    shell: 'hub',
    stateLabel: 'Ops',
    blurb: 'The broad operations layer for creating, editing, and publishing gamesnight memory.',
    nav: 'hidden',
  },
  {
    id: 'ops-session-new',
    path: '/ops/sessions/new',
    label: 'New Session',
    shortLabel: 'New Session',
    section: 'ops',
    shell: 'hub',
    stateLabel: 'New',
    blurb: 'A lightweight generic session entry point for hosts creating a new gamesnight record.',
    nav: 'hidden',
  },
  {
    id: 'ops-session-edit',
    path: '/ops/sessions/current',
    matchPath: /^\/ops\/sessions\/[^/]+$/,
    label: 'Session Editor',
    shortLabel: 'Session',
    section: 'ops',
    shell: 'hub',
    stateLabel: 'Edit',
    blurb: 'A calm, broad session editor for recap, attendance, and publish readiness across games.',
    nav: 'hidden',
  },
  {
    id: 'ops-among-us',
    path: '/ops/among-us',
    label: 'Among Us Ops',
    shortLabel: 'Among Us Ops',
    section: 'ops',
    shell: 'among-us',
    stateLabel: 'Ops',
    blurb: 'The Among Us session engine for structured host entry, recap drafting, and transmit flow.',
    nav: 'hidden',
  },
  {
    id: 'ops-among-us-session',
    path: '/ops/among-us/sessions/current',
    matchPath: /^\/ops\/among-us\/sessions\/[^/]+$/,
    label: 'Among Us Session Engine',
    shortLabel: 'Session Engine',
    section: 'ops',
    shell: 'among-us',
    stateLabel: 'Engine',
    blurb: 'The staged Among Us ops engine for match logging, outcomes, awards, recap drafting, and transmit flow.',
    nav: 'hidden',
  },
];

export const defaultAppPath = '/';

export const legacyHashRedirects: Record<string, string> = {
  '/prime-legends-archive': '/games/among-us/archive',
  '/incident-board': '/games/among-us/archive',
  '/transmission-reports': '/games/among-us/archive',
  '/ops-console': '/ops/among-us/sessions/session-09',
};

const routeByPath = new Map(appRoutes.map((route) => [route.path, route]));

export function normalizeAppPath(hash: string) {
  const cleaned = hash.replace(/^#/, '') || defaultAppPath;
  if (cleaned.includes('access_token=') || cleaned.includes('refresh_token=') || cleaned.includes('error=')) {
    return defaultAppPath;
  }

  const prefixed = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
  const redirected = legacyHashRedirects[prefixed] ?? prefixed;
  const direct = routeByPath.get(redirected);

  if (direct) {
    return direct.path;
  }

  const matched = appRoutes.find((route) => route.matchPath?.test(redirected));
  return matched ? redirected : defaultAppPath;
}

export function getRouteByPath(path: string) {
  return routeByPath.get(path) ?? appRoutes.find((route) => route.matchPath?.test(path)) ?? routeByPath.get(defaultAppPath)!;
}

export const bottomNavRoutes = appRoutes.filter((route) => route.nav === 'bottom');
export const amongUsModuleRoutes = appRoutes.filter((route) => route.nav === 'module');

export function getOpsSessionIdFromPath(path: string) {
  if (path === '/ops/sessions/new') {
    return null;
  }

  return path.match(/^\/ops\/sessions\/([^/]+)$/)?.[1] ?? null;
}

export function getAmongUsOpsSessionIdFromPath(path: string) {
  return path.match(/^\/ops\/among-us\/sessions\/([^/]+)$/)?.[1] ?? null;
}
