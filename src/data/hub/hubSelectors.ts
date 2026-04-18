import { useMemo } from 'react';
import type { Tone } from '../../types/hq';
import { getRuntimeProductData, useRuntimeProductData } from '../runtimeProductStore';
import { getAmongUsModuleData } from '../games/among-us/amongUsData';
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
  shortName: string;
  summary: string;
  theme: string;
  latestLabel: string;
  href: string | null;
  isFlagship: boolean;
  tone: Tone;
}

export interface HubProfilePresenceItem {
  label: string;
  value: string;
}

export interface HubProfileMemoryItem {
  label: string;
  value: string;
}

export interface HubProfileTimelineItem {
  label: string;
  detail: string;
}

export interface HubViewModel {
  latestPublishedSession: ReturnType<typeof getLatestPublishedSession>;
  latestOperationalSession: ReturnType<typeof getLatestOperationalSession>;
  latestPublishedRecap: ReturnType<typeof getRecapBySessionId>;
  hubHomeFeatures: HubHomeFeature[];
  featuredPlayers: HubPlayerCard[];
  hubPlayerCards: HubPlayerCard[];
  currentProfilePlayer: HubPlayerCard | undefined;
  currentProfileMoments: HubProfileMemoryItem[];
  currentProfilePresence: HubProfilePresenceItem[];
  currentProfileTimeline: HubProfileTimelineItem[];
  hubSeasonCards: HubSeasonCard[];
  currentSeasonDetail: HubSeasonCard | undefined;
  currentSeasonSessions: Array<{ id: string; title: string; detail: string; href: string }>;
  yearbookEntries: HubYearbookEntry[];
  hubGameCards: HubGameCard[];
  hubHomeMemoryRail: Array<{ title: string; detail: string }>;
}

function getAttendanceCount(playerId: string) {
  return getRuntimeProductData().sessionParticipants.filter((participant) => participant.playerId === playerId).length;
}

function playerProfileSummary(playerId: string) {
  return (
    getQuotesForPlayer(playerId).find((quote) => quote.context === 'profile')?.text ??
    'A recurring Olympus Prime regular with enough room memory to stay in the conversation.'
  );
}

export function getHubViewModel(): HubViewModel {
  const { players, seasons, sessions, games } = getRuntimeProductData();
  const amongUsData = getAmongUsModuleData();
  const latestPublishedSession = getLatestPublishedSession();
  const latestOperationalSession = getLatestOperationalSession();
  const latestPublishedRecap = latestPublishedSession ? getRecapBySessionId(latestPublishedSession.id) : null;

  const hubHomeFeatures: HubHomeFeature[] = [
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
      label: 'Flagship world',
      title: getGameById('among-us')?.name ?? 'Among Us',
      detail:
        'Among Us leads the live module layer right now, with Leap of Legends now represented beside it as a core Olympus Prime world.',
      href: '#/games/among-us',
      tone: 'hot',
    },
  ];

  const featuredPlayers: HubPlayerCard[] = amongUsData.crewRankings.slice(0, 4).flatMap((ranking) => {
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

  const hubPlayerCards: HubPlayerCard[] = players.map((player) => {
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

  const defaultProfilePlayerId =
    latestPublishedSession?.winningPlayerId ?? featuredPlayers[0]?.id ?? players[0]?.id ?? '';
  const currentProfilePlayer =
    hubPlayerCards.find((player) => player.id === defaultProfilePlayerId) ?? hubPlayerCards[0];

  const currentProfileMoments = currentProfilePlayer
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

  const currentProfilePresence = currentProfilePlayer
    ? [
        {
          label: 'Presence',
          value: `${currentProfilePlayer.attendanceCount} nights logged`,
        },
        {
          label: 'Last seen',
          value: currentProfilePlayer.lastSeen,
        },
        {
          label: 'Shared world',
          value: 'Among Us leads this history',
        },
      ]
    : [];

  const currentProfileTimeline = currentProfilePlayer
    ? [
        {
          label: 'How they show up',
          detail: getPlayerById(currentProfilePlayer.id)?.statusNote ?? currentProfilePlayer.summary,
        },
        {
          label: 'Known for',
          detail: getPlayerById(currentProfilePlayer.id)?.signatureMove ?? currentProfilePlayer.summary,
        },
        {
          label: 'Still remembered with',
          detail:
            getPlayerById(currentProfilePlayer.id)?.allyIds
              .map((allyId) => getPlayerById(allyId)?.callsign)
              .filter((callsign): callsign is string => Boolean(callsign))
              .join(' · ') || 'No recurring allies logged yet',
        },
      ]
    : [];

  const hubSeasonCards: HubSeasonCard[] = seasons.map((season) => {
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

  const currentSeasonDetail = hubSeasonCards.find((season) => season.status === 'active') ?? hubSeasonCards[0];

  const currentSeasonSessions = currentSeasonDetail
    ? sessions
        .filter((session) => session.seasonId === currentSeasonDetail.id)
        .sort((left, right) => right.sessionNumber - left.sessionNumber)
        .map((session) => ({
          id: session.id,
          title: session.label,
          detail: getRecapBySessionId(session.id)?.summary ?? session.hostNotes,
          href: '#/games/among-us/reports',
        }))
    : [];

  const yearbookEntries: HubYearbookEntry[] = [
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

  const hubGameCards: HubGameCard[] = games.map((game) => {
    const latestGameSession = getLatestPublishedSessionByGameId(game.id);
    const latestGameRecap = latestGameSession ? getRecapBySessionId(latestGameSession.id) : null;

    return {
      id: game.id,
      slug: game.slug,
      name: game.name,
      shortName: game.shortName,
      summary: game.summary,
      theme: game.theme,
      latestLabel: latestGameRecap?.headline ?? latestGameSession?.label ?? 'No published session yet',
      href: game.modulePath ? `#${game.modulePath}` : null,
      isFlagship: game.isFlagship,
      tone: game.id === 'among-us' ? 'hot' : game.isFlagship ? 'warm' : 'cool',
    };
  });

  const hubHomeMemoryRail = [
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

  return {
    latestPublishedSession,
    latestOperationalSession,
    latestPublishedRecap,
    hubHomeFeatures,
    featuredPlayers,
    hubPlayerCards,
    currentProfilePlayer,
    currentProfileMoments,
    currentProfilePresence,
    currentProfileTimeline,
    hubSeasonCards,
    currentSeasonDetail,
    currentSeasonSessions,
    yearbookEntries,
    hubGameCards,
    hubHomeMemoryRail,
  };
}

export function useHubViewModel() {
  const { revision } = useRuntimeProductData();

  return useMemo(() => getHubViewModel(), [revision]);
}

const initialHubViewModel = getHubViewModel();

export const latestPublishedSession = initialHubViewModel.latestPublishedSession;
export const latestOperationalSession = initialHubViewModel.latestOperationalSession;
export const latestPublishedRecap = initialHubViewModel.latestPublishedRecap;
export const hubHomeFeatures = initialHubViewModel.hubHomeFeatures;
export const featuredPlayers = initialHubViewModel.featuredPlayers;
export const hubPlayerCards = initialHubViewModel.hubPlayerCards;
export const currentProfilePlayer = initialHubViewModel.currentProfilePlayer;
export const currentProfileMoments = initialHubViewModel.currentProfileMoments;
export const currentProfilePresence = initialHubViewModel.currentProfilePresence;
export const currentProfileTimeline = initialHubViewModel.currentProfileTimeline;
export const hubSeasonCards = initialHubViewModel.hubSeasonCards;
export const currentSeasonDetail = initialHubViewModel.currentSeasonDetail;
export const currentSeasonSessions = initialHubViewModel.currentSeasonSessions;
export const yearbookEntries = initialHubViewModel.yearbookEntries;
export const hubGameCards = initialHubViewModel.hubGameCards;
export const hubHomeMemoryRail = initialHubViewModel.hubHomeMemoryRail;
