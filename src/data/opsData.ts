import type {
  AwardAssignment,
  AwardTemplate,
  CorrectionItem,
  MediaPlaceholderItem,
  OpsPlayer,
  OpsRecapDraft,
  OpsSeason,
  OpsSessionDraft,
  OpsSummaryCard,
  OpsWorkflowStep,
} from '../types/ops';
import { players, seasons, sessions } from './productSource';
import {
  getAwardsBySessionId,
  getLatestOperationalSession,
  getLatestPublishedSession,
  getLatestSessionForPlayer,
  getParticipantsBySessionId,
  getMediaBySessionId,
  getPlayerById,
  getRecapBySessionId,
  getTitleById,
} from './productSelectors';

const latestPublishedSession = getLatestPublishedSession();
const latestOperationalSession = getLatestOperationalSession();
const latestOperationalRecap = latestOperationalSession
  ? getRecapBySessionId(latestOperationalSession.id)
  : null;

export const opsWorkflowSteps: OpsWorkflowStep[] = [
  {
    id: 'entry',
    title: 'Log the session',
    detail: 'Open one form, enter the basics, and save the night without hunting for fields.',
  },
  {
    id: 'players',
    title: 'Confirm players',
    detail: 'Keep names, roles, and active roster details clean before the recap starts.',
  },
  {
    id: 'awards',
    title: 'Assign titles',
    detail: 'Capture who owned the room while the session is still fresh.',
  },
  {
    id: 'recap',
    title: 'Draft and publish',
    detail: 'Turn the best moments into a publish-ready recap for HQ.',
  },
];

export const opsPlayers: OpsPlayer[] = players.map((player) => {
  const latestSeen = getLatestSessionForPlayer(player.id);

  return {
    id: player.id,
    name: player.fullName,
    callsign: player.callsign,
    colorName: player.colorName,
    colorHex: player.colorHex,
    role: player.roleLabel,
    status: player.status.charAt(0).toUpperCase() + player.status.slice(1),
    title: getTitleById(player.currentTitleId)?.name ?? 'Unassigned',
    lastSeen: latestSeen ? `Night ${String(latestSeen.sessionNumber).padStart(2, '0')}` : 'No session yet',
  };
});

export const opsSeasons: OpsSeason[] = seasons.map((season) => ({
  id: season.id,
  name: season.name,
  state: season.status,
  startDate: season.startDate,
  currentWeek: season.currentWeekLabel,
  sessionCount: sessions.filter((session) => session.seasonId === season.id).length,
  theme: season.theme,
}));

export const awardTemplates: AwardTemplate[] = players
  .map((player) => player.currentTitleId)
  .filter((titleId, index, list): titleId is string => Boolean(titleId) && list.indexOf(titleId) === index)
  .map((titleId) => {
    const title = getTitleById(titleId)!;
    return {
      id: title.id,
      title: title.name,
      detail: title.description,
    };
  });

export const awardAssignments: AwardAssignment[] = (latestPublishedSession
  ? getAwardsBySessionId(latestPublishedSession.id)
  : []
)
  .filter((award) => award.awardType === 'title')
  .map((award) => ({
    id: award.id,
    playerId: award.playerId,
    title: getTitleById(award.definitionId)?.name ?? 'Title',
    reason: award.reason,
    state: award.state === 'published' ? 'assigned' : award.state,
  }));

export const mediaPlaceholders: MediaPlaceholderItem[] = latestOperationalSession
  ? getMediaBySessionId(latestOperationalSession.id).map((item) => ({
      id: item.id,
      name: item.label,
      type:
        item.type === 'photo_set' ? 'Photo set' : item.type === 'clip' ? 'Clip placeholder' : 'Screenshot',
      state: item.status === 'placeholder' ? 'waiting' : 'ready',
      note: item.note,
    }))
  : [];

export const correctionItems: CorrectionItem[] = [
  {
    id: 'fix-recap-08',
    subject: latestPublishedSession?.label ?? 'Latest recap',
    area: 'Recap',
    issue: 'Winner title spelled incorrectly in paragraph two.',
    currentValue: 'Hallway Oarcle',
    status: 'Needs correction',
  },
  {
    id: 'fix-player-nova',
    subject: `${getPlayerById('nova')?.callsign ?? 'Nova'} player file`,
    area: 'Player title',
    issue: 'Current title needs the final approved wording.',
    currentValue: getTitleById(getPlayerById('nova')?.currentTitleId ?? null)?.name ?? 'Hallway reader',
    status: 'Reviewing',
  },
];

export const opsSessionDraft: OpsSessionDraft = latestOperationalSession
  ? {
      sessionName: latestOperationalSession.label,
      date: latestOperationalSession.scheduledAt.slice(0, 10),
      seasonId: latestOperationalSession.seasonId,
      host: getPlayerById(latestOperationalSession.hostPlayerId)?.fullName ?? 'Unassigned host',
      room: latestOperationalSession.venue,
      mode: latestOperationalSession.format,
      attendance: String(latestOperationalSession.attendanceCount),
      winnerId: latestOperationalSession.winningPlayerId ?? players[0]?.id ?? '',
      notes: latestOperationalSession.hostNotes,
      presentPlayerIds: getParticipantsBySessionId(latestOperationalSession.id)
        .filter((participant) => participant.attendanceStatus === 'present' || participant.attendanceStatus === 'host')
        .map((participant) => participant.playerId),
    }
  : {
      sessionName: 'New Olympus Prime session',
      date: '',
      seasonId: seasons[0]?.id ?? '',
      host: '',
      room: '',
      mode: 'Classic deduction',
      attendance: '0',
      winnerId: players[0]?.id ?? '',
      notes: '',
      presentPlayerIds: [],
    };

export const opsRecapDraft: OpsRecapDraft = latestOperationalRecap
  ? {
      headline: latestOperationalRecap.headline,
      summary: latestOperationalRecap.summary,
      highlight: latestOperationalRecap.highlight,
      publishNote: latestOperationalRecap.publishNote,
    }
  : {
      headline: '',
      summary: '',
      highlight: '',
      publishNote: '',
    };

export const opsSummaryCards: OpsSummaryCard[] = [
  {
    label: 'Next session',
    value: latestOperationalSession
      ? `${latestOperationalSession.label} // ${latestOperationalSession.venue}`
      : 'No draft open',
    detail: latestOperationalSession
      ? 'The draft shell is already open so hosts can log the night without rebuilding the structure later.'
      : 'Create the next session shell before the room fills up.',
    tone: 'cool',
  },
  {
    label: 'Recap state',
    value:
      latestOperationalRecap?.status === 'published'
        ? 'Published to HQ'
        : latestOperationalRecap?.status === 'ready'
          ? 'Ready for publish'
          : 'Draft open',
    detail:
      latestOperationalRecap?.publishNote ??
      'The latest night summary still needs a stronger final paragraph before publishing.',
    tone: 'warm',
  },
  {
    label: 'Correction queue',
    value: `${correctionItems.length} items`,
    detail: 'Keep small mistakes easy to spot and even easier to fix before they reach the public side.',
    tone: 'hot',
  },
];
