import type {
  CommandStat,
  CrewProfile,
  CrewRanking,
  CrewRibbon,
  IncidentNote,
  LegendEntry,
  MissionLog,
  Readout,
  ReportMetric,
  Transmission,
  ZoneDebrief,
  ZoneFeature,
} from '../../../types/hq';
import {
  getAwardsBySessionId,
  getBadgeById,
  getIncidentsBySessionId,
  getLatestOperationalSession,
  getLatestPublishedSessionByGameId,
  getLegendMatches,
  getMatchesBySessionId,
  getPlayerById,
  getQuotesByContext,
  getQuotesForPlayer,
  getRecapBySessionId,
  getRivalriesForPlayer,
  getSessionById,
  getTitleById,
} from '../../productSelectors';

const amongUsGameId = 'among-us';
const latestPublishedSession = getLatestPublishedSessionByGameId(amongUsGameId);
const latestPublishedRecap = latestPublishedSession ? getRecapBySessionId(latestPublishedSession.id) : null;
const latestPublishedMatches = latestPublishedSession ? getMatchesBySessionId(latestPublishedSession.id) : [];
const latestPublishedIncidents = latestPublishedSession ? getIncidentsBySessionId(latestPublishedSession.id) : [];
const nextOperationalSession = getLatestOperationalSession(amongUsGameId);

const rankingSnapshots = [
  { playerId: 'nova', wins: 18, readScore: 96, streak: '4-night legend streak' },
  { playerId: 'quill', wins: 16, readScore: 92, streak: 'Never sounds rushed' },
  { playerId: 'sol', wins: 15, readScore: 90, streak: 'Three clutch endgames' },
  { playerId: 'ivy', wins: 13, readScore: 87, streak: 'Corridor memory monster' },
  { playerId: 'remy', wins: 11, readScore: 82, streak: 'Never loses the room' },
  { playerId: 'zeph', wins: 10, readScore: 79, streak: 'Wins when unnoticed' },
];

export const commandStats: CommandStat[] = [
  {
    label: 'Crew mood',
    value: 'Loudly confident',
    detail:
      latestPublishedRecap?.verdict ??
      'The exact tone people use when they are either definitely innocent or giving an all-time performance.',
    tone: 'hot',
  },
  {
    label: 'Suspicion drift',
    value: latestPublishedIncidents.length >= 3 ? 'Swinging fast' : 'Holding steady',
    detail:
      latestPublishedIncidents[0]?.summary ??
      'Every meeting introduces a new theory and at least one emotional overcorrection.',
    tone: 'warm',
  },
  {
    label: 'Memory index',
    value: getLegendMatches().length >= 4 ? 'High replay value' : 'Still forming',
    detail:
      latestPublishedMatches.at(-1)?.artifactLabel ??
      'Tonight already feels like the kind of session people will quote next week.',
    tone: 'cool',
  },
];

export const commandZones: ZoneFeature[] = [
  {
    name: 'Podium Gallery',
    mood: 'Warm rivalry',
    description: 'Where win streaks and social reads get framed like ship folklore.',
    destination: '/games/among-us/rankings',
    tone: 'warm',
  },
  {
    name: 'Records Pod',
    mood: 'Soft suspicion',
    description: 'Crew files, habits, and micro-tells sit under a rounded visor glow.',
    destination: '/games/among-us/players',
    tone: 'cool',
  },
  {
    name: 'Legend Vault',
    mood: 'Retold triumph',
    description: 'The rounds that grew larger in the telling now live here permanently.',
    destination: '/games/among-us/archive',
    tone: 'hot',
  },
  {
    name: 'Pinboard Bay',
    mood: 'Investigation theater',
    description: 'A thread-filled zone for accusations that still sound convincing in hindsight.',
    destination: '/games/among-us/archive',
    tone: 'warm',
  },
];

export const bridgeReadouts: Readout[] = [
  {
    title: 'Lobby opener',
    detail: nextOperationalSession
      ? `${nextOperationalSession.label} is staged for ${nextOperationalSession.venue.toLowerCase()} and the room is already pretending it will stay calm.`
      : 'Snack trays docked. First bluff already detected before the first round.',
  },
  {
    title: 'Prime advice',
    detail:
      latestPublishedIncidents[1]?.summary ??
      'Never trust the calmest person in the room right after a dramatic vote.',
  },
  {
    title: 'Last-round prophecy',
    detail:
      latestPublishedRecap?.recommendation ??
      'Someone will say “one more” and everyone will instantly agree, even though nobody means it.',
  },
];

export const railRumors: Readout[] = [
  {
    title: 'Bridge chatter',
    detail:
      latestPublishedIncidents[0]?.summary ??
      'Current rumor says the calmest person in the room already knows too much.',
  },
  {
    title: 'Vent gossip',
    detail:
      getRivalriesForPlayer('quill')[0]?.summary ??
      'Nobody saw anything suspicious yet, which is exactly why the room is suspicious.',
  },
  {
    title: 'Host note',
    detail:
      nextOperationalSession?.hostNotes ??
      'If someone says “trust me” before the first vote, write it down immediately.',
  },
];

export const commandWhispers: Readout[] = getQuotesByContext('whisper').map((quote) => ({
  title: quote.locationLabel ?? quote.speakerLabel,
  detail: quote.text,
}));

export const crewRankings: CrewRanking[] = rankingSnapshots
  .map((snapshot) => {
    const player = getPlayerById(snapshot.playerId);
    if (!player) {
      return null;
    }

    return {
      id: player.id,
      name: player.fullName,
      callsign: player.callsign,
      colorName: player.colorName,
      colorHex: player.colorHex,
      role: player.roleLabel,
      wins: snapshot.wins,
      readScore: snapshot.readScore,
      badge: getBadgeById(player.primaryBadgeId)?.name ?? 'Crew favorite',
      streak: snapshot.streak,
      signature: player.signatureMove,
      tone: player.profileTone,
    };
  })
  .filter((entry): entry is CrewRanking => entry !== null);

export const crewRibbons: CrewRibbon[] = (latestPublishedSession
  ? getAwardsBySessionId(latestPublishedSession.id)
  : []
)
  .filter((award) => award.awardType === 'badge')
  .map((award) => {
    const player = getPlayerById(award.playerId);
    const badge = getBadgeById(award.definitionId);

    return {
      title: badge?.name ?? 'Night ribbon',
      winner: player?.callsign ?? 'Crew',
      detail: award.reason,
      tone: badge?.tone ?? 'quiet',
    };
  });

export const crewProfiles: CrewProfile[] = rankingSnapshots.flatMap((snapshot) => {
  const player = getPlayerById(snapshot.playerId);
  if (!player) {
    return [];
  }

  const profileQuote =
    getQuotesForPlayer(player.id).find((quote) => quote.context === 'profile')?.text ??
    '“The room already decided something. I just want to know what.”';

  return [
    {
      id: player.id,
      name: player.fullName,
      callsign: player.callsign,
      colorName: player.colorName,
      colorHex: player.colorHex,
      role: player.roleLabel,
      rank: getTitleById(player.currentTitleId)?.name ?? 'Crew file',
      status: player.statusNote,
      quote: profileQuote,
      bio: player.bio,
      signatureMove: player.signatureMove,
      alibiStyle: player.alibiStyle,
      trustCircle: player.allyIds
        .map((allyId) => getPlayerById(allyId)?.callsign)
        .filter((callsign): callsign is string => Boolean(callsign)),
      habits: player.habitNotes,
      tells: player.tellNotes,
      tone: player.profileTone,
    },
  ];
});

export const missionLogs: MissionLog[] = latestPublishedMatches.map((match, index) => ({
  stamp: `${String(19 + Math.floor(index / 2)).padStart(2, '0')}:${String(18 + index * 14).padStart(2, '0')}`,
  title: match.title,
  location: match.locationLabel,
  tag: match.tagLabel,
  summary: match.summary,
  detail: match.detail,
  tone: match.tone,
}));

export const reportMetrics: ReportMetric[] = [
  {
    label: 'Meeting heat',
    value: 88,
    note: 'Several discussions became theatrical long before they became orderly.',
    tone: 'hot',
  },
  {
    label: 'Trust collapse',
    value: 74,
    note: 'Strong friendships remained intact, but only barely after the third dramatic vote.',
    tone: 'warm',
  },
  {
    label: 'Route discipline',
    value: 67,
    note: 'Respectable on paper, suspicious in motion.',
    tone: 'cool',
  },
  {
    label: 'Retell potential',
    value: 95,
    note: 'Multiple rounds qualified immediately for hallway re-enactment.',
    tone: 'hot',
  },
];

export const zoneDebriefs: ZoneDebrief[] = [
  {
    zone: 'Snack Airlock',
    outcome: 'Morale anchor',
    detail: 'The room reset here after every brutal reveal, which is why the laughter never stayed gone for long.',
    tone: 'warm',
  },
  {
    zone: 'Meeting Pod',
    outcome: 'Truth-adjacent theater',
    detail: 'Useful evidence appeared often, but only after surviving waves of performance, panic, and loyal over-defending.',
    tone: 'hot',
  },
  {
    zone: 'Last-Round Deck',
    outcome: 'Legend generator',
    detail: 'Every unresolved feeling of the night got poured into the last round, making the finish feel bigger than it had any right to be.',
    tone: 'cool',
  },
];

export const reportReadouts: Readout[] = [
  {
    title: 'Final-vote mood',
    detail:
      getQuotesByContext('legend').find((quote) => quote.matchId === latestPublishedMatches.at(-1)?.id)?.text ??
      'The room was quiet for exactly one second, which is how everyone knew the next reveal would be loud.',
  },
  {
    title: 'Host assessment',
    detail:
      latestPublishedSession?.hostNotes ??
      'No one crossed the line. Several people danced very close to it with elite dramatic timing.',
  },
  {
    title: 'Next-night risk',
    detail:
      nextOperationalSession?.hostNotes ??
      'Multiple players are now entering the next session with reputations too strong to ignore.',
  },
];

export const legendEntries: LegendEntry[] = getLegendMatches().map((match) => {
  const session = getSessionById(match.sessionId);
  const witness = getQuotesByContext('legend').find((quote) => quote.matchId === match.id);

  return {
    title: match.title,
    season: session ? `Prime Night ${String(session.sessionNumber).padStart(2, '0')}` : 'Prime Night',
    result: match.resultLabel,
    myth: match.summary,
    witness: witness?.text ?? '“The room got quiet in exactly the wrong way.”',
    relic: match.artifactLabel,
    tone: match.tone,
  };
});

export const incidentNotes: IncidentNote[] = latestPublishedIncidents.map((incident) => ({
  title: incident.title,
  severity: incident.severityLabel,
  state: incident.statusLabel,
  detail: incident.summary,
  thread: incident.threadLabel,
  owner: incident.reporterPlayerId ? `Filed by ${getPlayerById(incident.reporterPlayerId)?.callsign}` : 'Filed by HQ',
  tone: incident.tone,
}));

export const transmissions: Transmission[] = getQuotesByContext('transmission').map((quote) => ({
  title:
    quote.channel === 'Open lobby'
      ? 'Docking call'
      : quote.channel === 'Crew chatter'
        ? 'Midnight relay'
        : quote.channel === 'Post-round'
          ? 'Records ping'
          : 'Afterglow note',
  stamp: quote.stamp ?? '--:--',
  author: quote.speakerLabel,
  channel: quote.channel ?? 'Open line',
  body: quote.text,
  tone: quote.tone,
}));
