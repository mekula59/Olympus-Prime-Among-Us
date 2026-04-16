import type { Tone } from '../../types/hq';
import { crewRankings } from '../games/among-us/amongUsData';
import {
  getAwardsBySessionId,
  getBadgeById,
  getGameById,
  getLatestOperationalSession,
  getLatestPublishedSession,
  getLatestPublishedSessionByGameId,
  getLatestSessionForPlayer,
  getMatchesBySessionId,
  getPlayerById,
  getQuotesByContext,
  getQuotesForPlayer,
  getRecapBySessionId,
  getTitleById,
} from '../productSelectors';
import { games, players, seasons, sessionParticipants, sessions } from '../productSource';

export interface HubHomeFeature {
  label: string;
  title: string;
  detail: string;
  href: string;
  tone: Tone;
}

export interface HubPlayerCard {
  id: string;
  name: string;
  callsign: string;
  colorName: string;
  colorHex: string;
  role: string;
  title: string;
  badge: string;
  attendanceCount: number;
  lastSeen: string;
  summary: string;
  tone: Tone;
}

export interface HubSeasonCard {
  id: string;
  name: string;
  code: string;
  status: string;
  currentWeek: string;
  theme: string;
  sessionCount: number;
  featuredGame: string;
}

export interface HubYearbookEntry {
  title: string;
  detail: string;
  note: string;
  tone: Tone;
}

export interface HubGameCard {
  id: string;
  slug: string;
  name: string;
  summary: string;
  theme: string;
  latestLabel: string;
  href: string;
  tone: Tone;
}

function getAttendanceCount(playerId: string) {
  return sessionParticipants.filter((participant) => participant.playerId === playerId).length;
}

function playerProfileSummary(playerId: string) {
  return (
    getQuotesForPlayer(playerId).find((quote) => quote.context === 'profile')?.text ??
    'A recurring Olympus Prime regular with enough room memory to stay in the conversation.'
  );
}

export const latestPublishedSession = getLatestPublishedSession();
export const latestOperationalSession = getLatestOperationalSession();
export const latestPublishedRecap = latestPublishedSession ? getRecapBySessionId(latestPublishedSession.id) : null;

export const hubHomeFeatures: HubHomeFeature[] = [
  {
    label: 'Latest recap',
    title: latestPublishedRecap?.headline ?? latestPublishedSession?.label ?? 'Latest recap pending',
    detail:
      latestPublishedRecap?.summary ??
      latestPublishedSession?.hostNotes ??
      'The next published gamesnight recap will land here once it is transmitted from Ops.',
    href: '#/games/among-us/reports',
    tone: 'warm',
  },
  {
    label: 'Next session',
    title: latestOperationalSession?.label ?? 'No draft session',
    detail:
      latestOperationalSession?.hostNotes ??
      'Discord is still where the live planning happens; this site keeps the memory once the night is logged.',
    href: '#/ops',
    tone: 'cool',
  },
  {
    label: 'Featured game',
    title: getGameById('among-us')?.name ?? 'Among Us',
    detail:
      getGameById('among-us')?.summary ??
      'The flagship social-deduction module inside Olympus Prime Gamesnight Hub.',
    href: '#/games/among-us',
    tone: 'hot',
  },
];

export const featuredPlayers: HubPlayerCard[] = crewRankings.slice(0, 4).flatMap((ranking) => {
  const player = getPlayerById(ranking.id);
  if (!player) {
    return [];
  }

  const lastSeen = getLatestSessionForPlayer(player.id);
  return [
    {
      id: player.id,
      name: player.fullName,
      callsign: player.callsign,
      colorName: player.colorName,
      colorHex: player.colorHex,
      role: player.roleLabel,
      title: getTitleById(player.currentTitleId)?.name ?? 'Unassigned',
      badge: getBadgeById(player.primaryBadgeId)?.name ?? 'Crew regular',
      attendanceCount: getAttendanceCount(player.id),
      lastSeen: lastSeen ? lastSeen.label : 'No session yet',
      summary: playerProfileSummary(player.id),
      tone: player.profileTone,
    },
  ];
});

export const hubPlayerCards: HubPlayerCard[] = players.map((player) => {
  const lastSeen = getLatestSessionForPlayer(player.id);

  return {
    id: player.id,
    name: player.fullName,
    callsign: player.callsign,
    colorName: player.colorName,
    colorHex: player.colorHex,
    role: player.roleLabel,
    title: getTitleById(player.currentTitleId)?.name ?? 'Unassigned',
    badge: getBadgeById(player.primaryBadgeId)?.name ?? 'Crew regular',
    attendanceCount: getAttendanceCount(player.id),
    lastSeen: lastSeen ? lastSeen.label : 'No session yet',
    summary: player.bio,
    tone: player.profileTone,
  };
});

export const defaultProfilePlayerId =
  latestPublishedSession?.winningPlayerId ?? featuredPlayers[0]?.id ?? players[0]?.id ?? '';

export const currentProfilePlayer =
  hubPlayerCards.find((player) => player.id === defaultProfilePlayerId) ?? hubPlayerCards[0];

export const currentProfileMoments = currentProfilePlayer
  ? [
      {
        label: 'Latest title',
        value: currentProfilePlayer.title,
      },
      {
        label: 'Signature badge',
        value: currentProfilePlayer.badge,
      },
      {
        label: 'Known for',
        value: getPlayerById(currentProfilePlayer.id)?.signatureMove ?? currentProfilePlayer.summary,
      },
    ]
  : [];

export const hubSeasonCards: HubSeasonCard[] = seasons.map((season) => {
  const seasonSessions = sessions.filter((session) => session.seasonId === season.id);
  const featuredGameId = seasonSessions[0]?.gameId ?? 'among-us';

  return {
    id: season.id,
    name: season.name,
    code: season.code,
    status: season.status,
    currentWeek: season.currentWeekLabel,
    theme: season.theme,
    sessionCount: seasonSessions.length,
    featuredGame: getGameById(featuredGameId)?.name ?? 'Among Us',
  };
});

export const currentSeasonDetail =
  hubSeasonCards.find((season) => season.status === 'active') ?? hubSeasonCards[0];

export const currentSeasonSessions = currentSeasonDetail
  ? sessions
      .filter((session) => session.seasonId === currentSeasonDetail.id)
      .sort((left, right) => right.sessionNumber - left.sessionNumber)
      .map((session) => ({
        id: session.id,
        title: session.label,
        detail:
          getRecapBySessionId(session.id)?.summary ??
          session.hostNotes,
        href: '#/games/among-us/reports',
      }))
  : [];

export const yearbookEntries: HubYearbookEntry[] = [
  {
    title: 'Best room read',
    detail:
      latestPublishedSession
        ? getAwardsBySessionId(latestPublishedSession.id).find((award) => award.awardType === 'badge')?.reason ??
          'The room is still deciding which read deserves the loudest retelling.'
        : 'The next published session will write the first yearbook moment.',
    note: featuredPlayers[0]?.callsign ?? 'Olympus Prime regular',
    tone: 'cool',
  },
  {
    title: 'Line everyone remembered',
    detail:
      getQuotesByContext('legend')[0]?.text ??
      'The next loud reveal is waiting for the yearbook page.',
    note: 'Pulled from replay-worthy moments',
    tone: 'warm',
  },
  {
    title: 'Session of the season',
    detail:
      latestPublishedSession
        ? `${latestPublishedSession.label} still leads the retell index.`
        : 'No season-leading session has been published yet.',
    note: latestPublishedRecap?.publishNote ?? 'Will update after the next transmitted recap.',
    tone: 'hot',
  },
];

export const hubGameCards: HubGameCard[] = games.map((game) => {
  const latestGameSession = getLatestPublishedSessionByGameId(game.id);
  const latestGameRecap = latestGameSession ? getRecapBySessionId(latestGameSession.id) : null;

  return {
    id: game.id,
    slug: game.slug,
    name: game.name,
    summary: game.summary,
    theme: game.theme,
    latestLabel: latestGameRecap?.headline ?? latestGameSession?.label ?? 'No published session yet',
    href: `#/games/${game.slug}`,
    tone: game.id === 'among-us' ? 'hot' : 'cool',
  };
});

export const hubHomeMemoryRail = [
  {
    title: 'Latest room',
    detail:
      latestPublishedSession?.label ??
      'The latest published room will appear here once a session is transmitted from Ops.',
  },
  {
    title: 'Next on deck',
    detail:
      latestOperationalSession?.label ??
      'Discord planning is still the live source for the next gamesnight.',
  },
  {
    title: 'Top memory',
    detail:
      getMatchesBySessionId(latestPublishedSession?.id ?? '').at(-1)?.summary ??
      'The next replay-worthy moment will land here after the next published report.',
  },
];
