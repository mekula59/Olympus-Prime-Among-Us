import type {
  AwardRecord,
  BadgeRecord,
  GameRecord,
  IncidentRecord,
  MatchRecord,
  MediaUploadRecord,
  OutcomeRecord,
  PlayerRecord,
  PublishStateRecord,
  QuoteRecord,
  RecapRecord,
  RivalrySummaryRecord,
  SeasonRecord,
  SessionParticipantRecord,
  SessionRecord,
  TitleRecord,
} from '../../types/product';
import type { RuntimeProductData } from '../runtimeProductStore';
import { isSupabaseConfigured } from '../../lib/supabase';
import { fetchSupabaseTable } from './supabaseRest';

type SupabaseRow = Record<string, unknown>;

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function asNullableString(value: unknown) {
  return typeof value === 'string' ? value : null;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' ? value : fallback;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === 'boolean' ? value : fallback;
}

function mapGames(rows: SupabaseRow[]): GameRecord[] {
  return rows.map((row) => ({
    id: asString(row.id),
    slug: asString(row.slug),
    name: asString(row.name),
    shortName: asString(row.short_name),
    status: row.status as GameRecord['status'],
    isFlagship: asBoolean(row.is_flagship),
    modulePath: asNullableString(row.module_path),
    summary: asString(row.summary),
    theme: asString(row.theme),
  }));
}

function mapPlayers(
  rows: SupabaseRow[],
  allyRows: SupabaseRow[],
  habitRows: SupabaseRow[],
  tellRows: SupabaseRow[],
): PlayerRecord[] {
  return rows.map((row) => {
    const playerId = asString(row.id);

    return {
      id: playerId,
      callsign: asString(row.callsign),
      fullName: asString(row.full_name),
      colorName: asString(row.color_name),
      colorHex: asString(row.color_hex),
      roleLabel: asString(row.role_label),
      status: row.status as PlayerRecord['status'],
      statusNote: asString(row.status_note),
      profileTone: row.profile_tone as PlayerRecord['profileTone'],
      bio: asString(row.bio),
      signatureMove: asString(row.signature_move),
      alibiStyle: asString(row.alibi_style),
      currentTitleId: asNullableString(row.current_title_id),
      primaryBadgeId: asNullableString(row.primary_badge_id),
      joinedSeasonId: asString(row.joined_season_id),
      allyIds: allyRows
        .filter((allyRow) => asString(allyRow.player_id) === playerId)
        .map((allyRow) => asString(allyRow.ally_player_id)),
      habitNotes: habitRows
        .filter((habitRow) => asString(habitRow.player_id) === playerId)
        .sort((left, right) => asNumber(left.sort_order) - asNumber(right.sort_order))
        .map((habitRow) => asString(habitRow.note)),
      tellNotes: tellRows
        .filter((tellRow) => asString(tellRow.player_id) === playerId)
        .sort((left, right) => asNumber(left.sort_order) - asNumber(right.sort_order))
        .map((tellRow) => asString(tellRow.note)),
    };
  });
}

function mapSeasons(rows: SupabaseRow[]): SeasonRecord[] {
  return rows.map((row) => ({
    id: asString(row.id),
    name: asString(row.name),
    code: asString(row.code),
    status: row.status as SeasonRecord['status'],
    startDate: asString(row.start_date),
    endDate: asNullableString(row.end_date),
    currentWeekLabel: asString(row.current_week_label),
    theme: asString(row.theme),
  }));
}

function mapBadges(rows: SupabaseRow[]): BadgeRecord[] {
  return rows.map((row) => ({
    id: asString(row.id),
    name: asString(row.name),
    category: row.category as BadgeRecord['category'],
    description: asString(row.description),
    tone: row.tone as BadgeRecord['tone'],
  }));
}

function mapTitles(rows: SupabaseRow[]): TitleRecord[] {
  return rows.map((row) => ({
    id: asString(row.id),
    name: asString(row.name),
    description: asString(row.description),
    tone: row.tone as TitleRecord['tone'],
  }));
}

function mapSessions(rows: SupabaseRow[]): SessionRecord[] {
  return rows.map((row) => ({
    id: asString(row.id),
    gameId: asString(row.game_id),
    seasonId: asString(row.season_id),
    label: asString(row.label),
    sessionNumber: asNumber(row.session_number),
    scheduledAt: asString(row.scheduled_at),
    venue: asString(row.venue),
    format: asString(row.format),
    hostPlayerId: asString(row.host_player_id),
    status: row.status as SessionRecord['status'],
    attendanceCount: asNumber(row.attendance_count),
    winningPlayerId: asNullableString(row.winning_player_id),
    hostNotes: asString(row.host_notes),
    ownerUserId: asNullableString(row.owner_user_id),
    lastEditedByUserId: asNullableString(row.last_edited_by_user_id),
    createdAt: asNullableString(row.created_at),
    updatedAt: asNullableString(row.updated_at),
  }));
}

function mapSessionParticipants(rows: SupabaseRow[]): SessionParticipantRecord[] {
  return rows.map((row) => ({
    id: asString(row.id),
    sessionId: asString(row.session_id),
    playerId: asString(row.player_id),
    attendanceStatus: row.attendance_status as SessionParticipantRecord['attendanceStatus'],
    finishStatus: row.finish_status as SessionParticipantRecord['finishStatus'],
    playedMatches: asNumber(row.played_matches),
    winCount: asNumber(row.win_count),
    note: asString(row.note),
  }));
}

function mapMatches(rows: SupabaseRow[]): MatchRecord[] {
  return rows.map((row) => ({
    id: asString(row.id),
    sessionId: asString(row.session_id),
    sequence: asNumber(row.sequence),
    title: asString(row.title),
    locationLabel: asString(row.location_label),
    tagLabel: asString(row.tag_label),
    resultLabel: asString(row.result_label),
    summary: asString(row.summary),
    detail: asString(row.detail),
    artifactLabel: asString(row.artifact_label),
    tone: row.tone as MatchRecord['tone'],
    legendCandidate: asBoolean(row.legend_candidate),
  }));
}

function mapOutcomes(rows: SupabaseRow[]): OutcomeRecord[] {
  return rows.map((row) => ({
    id: asString(row.id),
    sessionId: asString(row.session_id),
    winnerPlayerId: asNullableString(row.winner_player_id),
    verdict: asString(row.verdict),
    flaggedSummary: asString(row.flagged_summary),
    status: row.status as OutcomeRecord['status'],
  }));
}

function mapAwards(rows: SupabaseRow[]): AwardRecord[] {
  return rows.map((row) => ({
    id: asString(row.id),
    sessionId: asString(row.session_id),
    playerId: asString(row.player_id),
    awardType: row.award_type as AwardRecord['awardType'],
    definitionId: asString(row.definition_id),
    reason: asString(row.reason),
    state: row.state as AwardRecord['state'],
  }));
}

function mapQuotes(rows: SupabaseRow[]): QuoteRecord[] {
  return rows.map((row) => ({
    id: asString(row.id),
    speakerLabel: asString(row.speaker_label),
    playerId: asNullableString(row.player_id),
    sessionId: asNullableString(row.session_id),
    matchId: asNullableString(row.match_id),
    context: row.context as QuoteRecord['context'],
    channel: asNullableString(row.channel),
    locationLabel: asNullableString(row.location_label),
    stamp: asNullableString(row.stamp),
    text: asString(row.text),
    tone: row.tone as QuoteRecord['tone'],
  }));
}

function mapIncidents(rows: SupabaseRow[]): IncidentRecord[] {
  return rows.map((row) => ({
    id: asString(row.id),
    sessionId: asString(row.session_id),
    matchId: asNullableString(row.match_id),
    title: asString(row.title),
    severityLabel: asString(row.severity_label),
    statusLabel: asString(row.status_label),
    summary: asString(row.summary),
    threadLabel: asString(row.thread_label),
    reporterPlayerId: asNullableString(row.reporter_player_id),
    visibility: row.visibility as IncidentRecord['visibility'],
    tone: row.tone as IncidentRecord['tone'],
  }));
}

function mapRecaps(rows: SupabaseRow[]): RecapRecord[] {
  return rows.map((row) => ({
    id: asString(row.id),
    sessionId: asString(row.session_id),
    headline: asString(row.headline),
    summary: asString(row.summary),
    highlight: asString(row.highlight),
    publishNote: asString(row.publish_note),
    verdict: asString(row.verdict),
    recommendation: asString(row.recommendation),
    status: row.status as RecapRecord['status'],
  }));
}

function mapPublishStates(rows: SupabaseRow[]): PublishStateRecord[] {
  return rows.map((row) => ({
    id: asString(row.id),
    sessionId: asString(row.session_id),
    reportStatus: row.report_status as PublishStateRecord['reportStatus'],
    awardsStatus: row.awards_status as PublishStateRecord['awardsStatus'],
    mediaStatus: row.media_status as PublishStateRecord['mediaStatus'],
    publicStatus: row.public_status as PublishStateRecord['publicStatus'],
    transmittedAt: asNullableString(row.transmitted_at),
  }));
}

function mapMediaUploads(rows: SupabaseRow[]): MediaUploadRecord[] {
  return rows.map((row) => ({
    id: asString(row.id),
    sessionId: asString(row.session_id),
    recapId: asNullableString(row.recap_id),
    label: asString(row.label),
    type: row.type as MediaUploadRecord['type'],
    status: row.status as MediaUploadRecord['status'],
    note: asString(row.note),
    sortOrder: asNumber(row.sort_order),
  }));
}

function mapRivalries(rows: SupabaseRow[]): RivalrySummaryRecord[] {
  return rows.map((row) => ({
    id: asString(row.id),
    playerAId: asString(row.player_a_id),
    playerBId: asString(row.player_b_id),
    seasonId: asNullableString(row.season_id),
    summary: asString(row.summary),
    heatLabel: asString(row.heat_label),
    stateLabel: asString(row.state_label),
    tone: row.tone as RivalrySummaryRecord['tone'],
  }));
}

export async function fetchSupabaseCanonicalProductData(): Promise<RuntimeProductData | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const [
    gameRows,
    seasonRows,
    badgeRows,
    titleRows,
    playerRows,
    allyRows,
    habitRows,
    tellRows,
    sessionRows,
    sessionParticipantRows,
    matchRows,
    outcomeRows,
    awardRows,
    quoteRows,
    incidentRows,
    recapRows,
    publishStateRows,
    mediaRows,
    rivalryRows,
  ] = await Promise.all([
    fetchSupabaseTable('games'),
    fetchSupabaseTable('seasons'),
    fetchSupabaseTable('badges'),
    fetchSupabaseTable('titles'),
    fetchSupabaseTable('players'),
    fetchSupabaseTable('player_allies'),
    fetchSupabaseTable('player_habits'),
    fetchSupabaseTable('player_tells'),
    fetchSupabaseTable('sessions'),
    fetchSupabaseTable('session_participants'),
    fetchSupabaseTable('matches'),
    fetchSupabaseTable('outcomes'),
    fetchSupabaseTable('awards'),
    fetchSupabaseTable('quotes'),
    fetchSupabaseTable('incidents'),
    fetchSupabaseTable('recaps'),
    fetchSupabaseTable('publish_states'),
    fetchSupabaseTable('media_uploads'),
    fetchSupabaseTable('rivalry_summaries'),
  ]);

  if (!gameRows.length || !playerRows.length || !seasonRows.length) {
    return null;
  }

  return {
    games: mapGames(gameRows),
    players: mapPlayers(playerRows, allyRows, habitRows, tellRows),
    seasons: mapSeasons(seasonRows),
    badges: mapBadges(badgeRows),
    titles: mapTitles(titleRows),
    incidents: mapIncidents(incidentRows),
    rivalrySummaries: mapRivalries(rivalryRows),
    sessions: mapSessions(sessionRows),
    sessionParticipants: mapSessionParticipants(sessionParticipantRows),
    matches: mapMatches(matchRows),
    outcomes: mapOutcomes(outcomeRows),
    awards: mapAwards(awardRows),
    quotes: mapQuotes(quoteRows),
    recaps: mapRecaps(recapRows),
    publishStates: mapPublishStates(publishStateRows),
    mediaUploads: mapMediaUploads(mediaRows),
  };
}
