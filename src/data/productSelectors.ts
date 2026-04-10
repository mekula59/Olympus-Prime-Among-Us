import {
  awards,
  badges,
  incidents,
  matches,
  mediaUploads,
  players,
  quotes,
  recaps,
  rivalrySummaries,
  seasons,
  sessionParticipants,
  sessions,
  titles,
} from './productSource';

function byNewestDate<T extends { scheduledAt: string }>(left: T, right: T) {
  return new Date(right.scheduledAt).getTime() - new Date(left.scheduledAt).getTime();
}

export const playerMap = new Map(players.map((player) => [player.id, player]));
export const seasonMap = new Map(seasons.map((season) => [season.id, season]));
export const sessionMap = new Map(sessions.map((session) => [session.id, session]));
export const badgeMap = new Map(badges.map((badge) => [badge.id, badge]));
export const titleMap = new Map(titles.map((title) => [title.id, title]));
export const recapBySessionId = new Map(recaps.map((recap) => [recap.sessionId, recap]));

export function getPlayerById(playerId: string) {
  return playerMap.get(playerId);
}

export function getSeasonById(seasonId: string) {
  return seasonMap.get(seasonId);
}

export function getSessionById(sessionId: string) {
  return sessionMap.get(sessionId);
}

export function getBadgeById(badgeId: string | null) {
  return badgeId ? badgeMap.get(badgeId) ?? null : null;
}

export function getTitleById(titleId: string | null) {
  return titleId ? titleMap.get(titleId) ?? null : null;
}

export function getRecapBySessionId(sessionId: string) {
  return recapBySessionId.get(sessionId) ?? null;
}

export function getMatchesBySessionId(sessionId: string) {
  return matches
    .filter((match) => match.sessionId === sessionId)
    .sort((left, right) => left.sequence - right.sequence);
}

export function getParticipantsBySessionId(sessionId: string) {
  return sessionParticipants.filter((participant) => participant.sessionId === sessionId);
}

export function getAwardsBySessionId(sessionId: string) {
  return awards.filter((award) => award.sessionId === sessionId);
}

export function getQuotesByContext(context: (typeof quotes)[number]['context']) {
  return quotes.filter((quote) => quote.context === context);
}

export function getQuotesForPlayer(playerId: string) {
  return quotes.filter((quote) => quote.playerId === playerId);
}

export function getIncidentsBySessionId(sessionId: string) {
  return incidents.filter((incident) => incident.sessionId === sessionId);
}

export function getMediaBySessionId(sessionId: string) {
  return mediaUploads
    .filter((item) => item.sessionId === sessionId)
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

export function getRivalriesForPlayer(playerId: string) {
  return rivalrySummaries.filter(
    (rivalry) => rivalry.playerAId === playerId || rivalry.playerBId === playerId,
  );
}

export function getLatestPublishedSession() {
  return sessions
    .filter((session) => session.status === 'published')
    .sort(byNewestDate)[0];
}

export function getLatestOperationalSession() {
  return sessions
    .filter((session) => session.status === 'draft' || session.status === 'logged' || session.status === 'planned')
    .sort(byNewestDate)[0];
}

export function getLatestSessionForPlayer(playerId: string) {
  const playerSessionIds = sessionParticipants
    .filter((participant) => participant.playerId === playerId)
    .map((participant) => participant.sessionId);

  return sessions
    .filter((session) => playerSessionIds.includes(session.id))
    .sort(byNewestDate)[0];
}

export function getTitleNameForPlayer(playerId: string) {
  const player = getPlayerById(playerId);
  return player ? getTitleById(player.currentTitleId)?.name ?? 'Unassigned' : 'Unassigned';
}

export function getBadgeNameForPlayer(playerId: string) {
  const player = getPlayerById(playerId);
  return player ? getBadgeById(player.primaryBadgeId)?.name ?? 'Unassigned' : 'Unassigned';
}

export function getLegendMatches() {
  return matches.filter((match) => match.legendCandidate).sort((left, right) => {
    const leftSession = getSessionById(left.sessionId);
    const rightSession = getSessionById(right.sessionId);
    if (!leftSession || !rightSession) {
      return 0;
    }

    return byNewestDate(leftSession, rightSession);
  });
}
