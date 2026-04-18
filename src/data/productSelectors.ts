import type { QuoteContext } from '../types/product';
import { getRuntimeProductData } from './runtimeProductStore';

function byNewestDate<T extends { scheduledAt: string }>(left: T, right: T) {
  return new Date(right.scheduledAt).getTime() - new Date(left.scheduledAt).getTime();
}

export function getPlayerById(playerId: string) {
  return getRuntimeProductData().players.find((player) => player.id === playerId);
}

export function getGameById(gameId: string) {
  return getRuntimeProductData().games.find((game) => game.id === gameId);
}

export function getSeasonById(seasonId: string) {
  return getRuntimeProductData().seasons.find((season) => season.id === seasonId);
}

export function getSessionById(sessionId: string) {
  return getRuntimeProductData().sessions.find((session) => session.id === sessionId);
}

export function getBadgeById(badgeId: string | null) {
  if (!badgeId) {
    return null;
  }

  return getRuntimeProductData().badges.find((badge) => badge.id === badgeId) ?? null;
}

export function getTitleById(titleId: string | null) {
  if (!titleId) {
    return null;
  }

  return getRuntimeProductData().titles.find((title) => title.id === titleId) ?? null;
}

export function getRecapBySessionId(sessionId: string) {
  return getRuntimeProductData().recaps.find((recap) => recap.sessionId === sessionId) ?? null;
}

export function getOutcomeBySessionId(sessionId: string) {
  return getRuntimeProductData().outcomes.find((outcome) => outcome.sessionId === sessionId) ?? null;
}

export function getPublishStateBySessionId(sessionId: string) {
  return getRuntimeProductData().publishStates.find((publishState) => publishState.sessionId === sessionId) ?? null;
}

export function getMatchesBySessionId(sessionId: string) {
  return getRuntimeProductData()
    .matches.filter((match) => match.sessionId === sessionId)
    .sort((left, right) => left.sequence - right.sequence);
}

export function getParticipantsBySessionId(sessionId: string) {
  return getRuntimeProductData().sessionParticipants.filter(
    (participant) => participant.sessionId === sessionId,
  );
}

export function getAwardsBySessionId(sessionId: string) {
  return getRuntimeProductData().awards.filter((award) => award.sessionId === sessionId);
}

export function getQuotesByContext(context: QuoteContext) {
  return getRuntimeProductData().quotes.filter((quote) => quote.context === context);
}

export function getQuotesBySessionId(sessionId: string) {
  return getRuntimeProductData().quotes.filter((quote) => quote.sessionId === sessionId);
}

export function getQuotesForPlayer(playerId: string) {
  return getRuntimeProductData().quotes.filter((quote) => quote.playerId === playerId);
}

export function getIncidentsBySessionId(sessionId: string) {
  return getRuntimeProductData().incidents.filter((incident) => incident.sessionId === sessionId);
}

export function getMediaBySessionId(sessionId: string) {
  return getRuntimeProductData()
    .mediaUploads.filter((item) => item.sessionId === sessionId)
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

export function getRivalriesForPlayer(playerId: string) {
  return getRuntimeProductData().rivalrySummaries.filter(
    (rivalry) => rivalry.playerAId === playerId || rivalry.playerBId === playerId,
  );
}

export function getLatestPublishedSession() {
  return getRuntimeProductData()
    .sessions.filter((session) => session.status === 'published')
    .sort(byNewestDate)[0];
}

export function getLatestPublishedSessionByGameId(gameId: string) {
  return getRuntimeProductData()
    .sessions.filter((session) => session.gameId === gameId && session.status === 'published')
    .sort(byNewestDate)[0];
}

export function getLatestOperationalSession(gameId?: string) {
  return getRuntimeProductData()
    .sessions.filter(
      (session) =>
        (!gameId || session.gameId === gameId) &&
        (session.status === 'draft' || session.status === 'logged' || session.status === 'planned'),
    )
    .sort(byNewestDate)[0];
}

export function getSessionsByGameId(gameId: string) {
  return getRuntimeProductData().sessions.filter((session) => session.gameId === gameId).sort(byNewestDate);
}

export function getLatestSessionForPlayer(playerId: string) {
  const playerSessionIds = getRuntimeProductData()
    .sessionParticipants.filter((participant) => participant.playerId === playerId)
    .map((participant) => participant.sessionId);

  return getRuntimeProductData()
    .sessions.filter((session) => playerSessionIds.includes(session.id))
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
  return getRuntimeProductData().matches.filter((match) => match.legendCandidate).sort((left, right) => {
    const leftSession = getSessionById(left.sessionId);
    const rightSession = getSessionById(right.sessionId);
    if (!leftSession || !rightSession) {
      return 0;
    }

    return byNewestDate(leftSession, rightSession);
  });
}
