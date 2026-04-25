import { useMemo } from 'react';
import type {
  AwardAssignment,
  AwardTemplate,
  CorrectionItem,
  MediaPlaceholderItem,
  OpsPlayer,
  OpsSeason,
  OpsWorkflowStep,
} from '../../../types/ops';
import { getRuntimeProductData, useRuntimeProductData } from '../../runtimeProductStore';
import {
  getAwardsBySessionId,
  getLatestOperationalSession,
  getLatestPublishedSessionByGameId,
  getLatestSessionForPlayer,
  getMediaBySessionId,
  getPlayerById,
  getTitleById,
} from '../../productSelectors';

const amongUsGameId = 'among-us';

export interface AmongUsOpsDataView {
  currentAmongUsOpsSessionId: string;
  opsWorkflowSteps: OpsWorkflowStep[];
  opsPlayers: OpsPlayer[];
  opsSeasons: OpsSeason[];
  awardTemplates: AwardTemplate[];
  awardAssignments: AwardAssignment[];
  mediaPlaceholders: MediaPlaceholderItem[];
  correctionItems: CorrectionItem[];
}

export function getAmongUsOpsData(sessionId?: string): AmongUsOpsDataView {
  const latestPublishedSession = getLatestPublishedSessionByGameId(amongUsGameId);
  const latestOperationalSession = getLatestOperationalSession(amongUsGameId);
  const activeSessionId = sessionId ?? latestOperationalSession?.id ?? 'session-09';
  const { players, seasons, sessions } = getRuntimeProductData();

  const opsWorkflowSteps: OpsWorkflowStep[] = [
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

  const opsPlayers: OpsPlayer[] = players.map((player) => {
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

  const opsSeasons: OpsSeason[] = seasons.map((season) => ({
    id: season.id,
    name: season.name,
    state: season.status,
    startDate: season.startDate,
    currentWeek: season.currentWeekLabel,
    sessionCount: sessions.filter((session) => session.seasonId === season.id && session.gameId === amongUsGameId)
      .length,
    theme: season.theme,
  }));

  const awardTemplates: AwardTemplate[] = players
    .map((player) => player.currentTitleId)
    .filter((titleId, index, list): titleId is string => Boolean(titleId) && list.indexOf(titleId) === index)
    .flatMap((titleId) => {
      const title = getTitleById(titleId);
      return title
        ? [
            {
              id: title.id,
              title: title.name,
              detail: title.description,
            },
          ]
        : [];
    });

  const awardAssignments: AwardAssignment[] = (latestPublishedSession
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

  const mediaPlaceholders: MediaPlaceholderItem[] = getMediaBySessionId(activeSessionId).map((item) => ({
    id: item.id,
    name: item.label,
    type: item.type === 'photo_set' ? 'Photo set' : item.type === 'clip' ? 'Clip placeholder' : 'Screenshot',
    state: item.status === 'placeholder' ? 'waiting' : 'ready',
    note: item.note,
  }));

  const correctionItems: CorrectionItem[] = [
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

  return {
    currentAmongUsOpsSessionId: activeSessionId,
    opsWorkflowSteps,
    opsPlayers,
    opsSeasons,
    awardTemplates,
    awardAssignments,
    mediaPlaceholders,
    correctionItems,
  };
}

export function useAmongUsOpsData(sessionId?: string) {
  const { revision } = useRuntimeProductData();

  return useMemo(() => getAmongUsOpsData(sessionId), [revision, sessionId]);
}

const initialAmongUsOpsData = getAmongUsOpsData();

export const currentAmongUsOpsSessionId = initialAmongUsOpsData.currentAmongUsOpsSessionId;
export const opsWorkflowSteps = initialAmongUsOpsData.opsWorkflowSteps;
export const opsPlayers = initialAmongUsOpsData.opsPlayers;
export const opsSeasons = initialAmongUsOpsData.opsSeasons;
export const awardTemplates = initialAmongUsOpsData.awardTemplates;
export const awardAssignments = initialAmongUsOpsData.awardAssignments;
export const mediaPlaceholders = initialAmongUsOpsData.mediaPlaceholders;
export const correctionItems = initialAmongUsOpsData.correctionItems;
