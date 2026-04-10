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
  RouteConfig,
  RouteGroup,
  RouteId,
  Transmission,
  ZoneDebrief,
  ZoneFeature,
} from '../types/hq';
import {
  getAwardsBySessionId,
  getBadgeById,
  getIncidentsBySessionId,
  getLatestOperationalSession,
  getLatestPublishedSession,
  getLegendMatches,
  getMatchesBySessionId,
  getPlayerById,
  getQuotesByContext,
  getQuotesForPlayer,
  getRecapBySessionId,
  getRivalriesForPlayer,
  getSessionById,
  getTitleById,
} from './productSelectors';

export const routeOrder: RouteId[] = [
  'command-center',
  'crew-rankings',
  'crew-file',
  'mission-logs',
  'mission-report',
  'prime-legends-archive',
  'incident-board',
  'transmission-reports',
  'ops-console',
];

export const navigationGroups: RouteGroup[] = ['HQ', 'Records', 'Ops'];

export const routes: RouteConfig[] = [
  {
    id: 'command-center',
    label: 'Command Center',
    shortLabel: 'Command',
    group: 'HQ',
    deck: 'Bridge Deck',
    eyebrow: 'Lobby pulse',
    blurb: 'The warmest room in the ship: a memory-soaked bridge where the night starts, the banter spikes, and nobody sounds fully innocent.',
    cue: 'Best entered before the first emergency meeting.',
  },
  {
    id: 'crew-rankings',
    label: 'Crew Rankings',
    shortLabel: 'Rankings',
    group: 'HQ',
    deck: 'Podium Gallery',
    eyebrow: 'Clout board',
    blurb: 'A glowing gallery for the people who read the room best, escaped cleanest, or simply made the loudest case at the perfect time.',
    cue: 'Respectfully dramatic. Mildly biased.',
  },
  {
    id: 'crew-file',
    label: 'Crew File',
    shortLabel: 'Crew File',
    group: 'HQ',
    deck: 'Records Pod',
    eyebrow: 'Profile vault',
    blurb: 'A selector wall of personalities, habits, trusted allies, and the tiny tells that make each crew member unforgettable by round three.',
    cue: 'Read the file, then pretend you always knew.',
  },
  {
    id: 'mission-logs',
    label: 'Mission Logs',
    shortLabel: 'Logs',
    group: 'Records',
    deck: 'Archive Corridor',
    eyebrow: 'Round history',
    blurb: 'A corridor of timestamped moments: suspicious walks, skipped votes, hot mic recoveries, and the exact second a room turned.',
    cue: 'Best consumed in sequence with a knowing nod.',
  },
  {
    id: 'mission-report',
    label: 'Mission Report',
    shortLabel: 'Report',
    group: 'Records',
    deck: 'Debrief Dome',
    eyebrow: 'Night summary',
    blurb: 'A calm-looking report space that quietly admits the crew was nowhere near calm once the final reveal hit.',
    cue: 'Official enough to frame. Messy enough to believe.',
  },
  {
    id: 'prime-legends-archive',
    label: 'Prime Legends Archive',
    shortLabel: 'Legends',
    group: 'Records',
    deck: 'Legend Vault',
    eyebrow: 'Retold rounds',
    blurb: 'The trophy room for impossible reads, betrayal masterclasses, and the rounds still quoted word-for-word in the hallway.',
    cue: 'Legends are verified by loud retelling.',
  },
  {
    id: 'incident-board',
    label: 'Incident Board',
    shortLabel: 'Incidents',
    group: 'Records',
    deck: 'Pinboard Bay',
    eyebrow: 'Evidence wall',
    blurb: 'A thread-heavy board of accusations, room-temperature proof, and notes pinned at the exact angle of escalating suspicion.',
    cue: 'Everything is annotated. Nothing is fully settled.',
  },
  {
    id: 'transmission-reports',
    label: 'Transmission Reports',
    shortLabel: 'Transmit',
    group: 'HQ',
    deck: 'Relay Lounge',
    eyebrow: 'Signal lounge',
    blurb: 'Half announcement feed, half remembered lobby chatter. This is where the ship talks to itself before, during, and after the chaos.',
    cue: 'Volume rises with every questionable alibi.',
  },
  {
    id: 'ops-console',
    label: 'Ops Console',
    shortLabel: 'Ops',
    group: 'Ops',
    deck: 'Quiet Console',
    eyebrow: 'Admin tools',
    blurb: 'A simpler, practical operations shell for scheduling, moderation, and report handling without losing the rounded ship-room language.',
    cue: 'Less sparkle. More control.',
  },
];

const latestPublishedSession = getLatestPublishedSession();
const latestPublishedRecap = latestPublishedSession ? getRecapBySessionId(latestPublishedSession.id) : null;
const latestPublishedMatches = latestPublishedSession ? getMatchesBySessionId(latestPublishedSession.id) : [];
const latestPublishedIncidents = latestPublishedSession ? getIncidentsBySessionId(latestPublishedSession.id) : [];
const nextOperationalSession = getLatestOperationalSession();

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
    destination: 'crew-rankings',
    tone: 'warm',
  },
  {
    name: 'Records Pod',
    mood: 'Soft suspicion',
    description: 'Crew files, habits, and micro-tells sit under a rounded visor glow.',
    destination: 'crew-file',
    tone: 'cool',
  },
  {
    name: 'Legend Vault',
    mood: 'Retold triumph',
    description: 'The rounds that grew larger in the telling now live here permanently.',
    destination: 'prime-legends-archive',
    tone: 'hot',
  },
  {
    name: 'Pinboard Bay',
    mood: 'Investigation theater',
    description: 'A thread-filled zone for accusations that still sound convincing in hindsight.',
    destination: 'incident-board',
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
