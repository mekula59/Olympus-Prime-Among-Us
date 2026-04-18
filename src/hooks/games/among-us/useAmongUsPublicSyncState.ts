import { useMemo } from 'react';
import { useAmongUsModuleData } from '../../../data/games/among-us/amongUsData';
import { getPlayerById } from '../../../data/productSelectors';
import type {
  CommandStat,
  CrewRanking,
  MissionLog,
  Readout,
  ReportMetric,
  Transmission,
  ZoneDebrief,
} from '../../../types/hq';
import { useSessionEngine } from '../../useSessionEngine';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatStageStatus(status: string) {
  return status.replace(/-/g, ' ').toUpperCase();
}

export function useAmongUsPublicSyncState() {
  const seeded = useAmongUsModuleData();
  const engine = useSessionEngine();
  const { draft, derived, eventLabel } = engine;

  return useMemo(() => {
    const checkedInPlayers = derived.checkedInPlayers;
    const winner = draft.outcome.winnerPlayerId ? getPlayerById(draft.outcome.winnerPlayerId) : null;
    const isLiveSession =
      draft.session.status === 'logged' || draft.session.status === 'published' || draft.matches.length > 0;
    const isReportReady =
      draft.publishState.reportStatus === 'verified' || draft.publishState.reportStatus === 'transmitted';
    const isTransmitted = draft.publishState.publicStatus === 'transmitted';
    const runtimeEnabled = isLiveSession || isReportReady || isTransmitted;
    const phaseLabel = isTransmitted
      ? 'HQ TRANSMITTED'
      : isReportReady
        ? 'UPLINK READY'
        : isLiveSession
          ? 'SESSION LIVE'
          : 'ARCHIVE MEMORY';
    const phaseDetail = isTransmitted
      ? `${draft.session.label} is now feeding the public decks.`
      : isReportReady
        ? `${draft.session.label} has a verified report waiting for HQ.`
        : isLiveSession
          ? `${draft.session.label} is running through the session engine right now.`
          : 'HQ is holding on seeded records while the next room wakes up.';

    const roomRoster: CrewRanking[] = checkedInPlayers.length
      ? checkedInPlayers.map((player, index) => {
          const seededRank = seeded.crewRankings.find((entry) => entry.id === player.id);

          return {
            id: player.id,
            name: player.name,
            callsign: player.callsign,
            colorName: player.colorName,
            colorHex: player.colorHex,
            role: player.role,
            wins: seededRank?.wins ?? Math.max(1, draft.matches.length - index + 2),
            readScore: clamp(92 - index * 4 + draft.matches.length * 2, 68, 99),
            badge: player.title,
            streak: index === 0 ? 'Loaded into live session' : 'Crew verified on boot',
            signature: seededRank?.signature ?? 'Holding the room steady under pressure.',
            tone: seededRank?.tone ?? 'cool',
          };
        })
      : seeded.crewRankings.slice(0, 5);

    const commandStats: CommandStat[] = runtimeEnabled
      ? [
          {
            label: 'Session link',
            value: phaseLabel,
            detail: `${draft.session.label} // ${checkedInPlayers.length || draft.session.attendanceCount} crew loaded.`,
            tone: isTransmitted ? 'hot' : 'cool',
          },
          {
            label: 'Round log',
            value: `${draft.matches.length} rounds`,
            detail:
              draft.matches.at(-1)?.summary ??
              'No round is locked yet, so HQ is still listening for the first shift.',
            tone: draft.matches.length >= 3 ? 'warm' : 'cool',
          },
          {
            label: 'Outcome lock',
            value: winner ? `${winner.callsign} locked` : draft.outcome.status === 'resolved' ? 'Verdict ready' : 'Pending',
            detail:
              draft.outcome.flaggedSummary || draft.outcome.verdict || 'Resolve the room and HQ can stop guessing.',
            tone: draft.outcome.flaggedSummary ? 'hot' : 'warm',
          },
        ]
      : seeded.commandStats;

    const bridgeReadouts: Readout[] = runtimeEnabled
      ? [
          { title: 'Engine link', detail: phaseDetail },
          {
            title: 'Room load',
            detail:
              checkedInPlayers.length > 0
                ? `${checkedInPlayers.map((player) => player.callsign).slice(0, 4).join(', ')} ${checkedInPlayers.length > 4 ? 'and more' : ''} are loaded into the room.`
                : 'Crew load is still quiet, so HQ is reading the old bridge feed.',
          },
          {
            title: 'Transmit line',
            detail:
              draft.publishState.transmittedAt
                ? `HQ received the uplink at ${draft.publishState.transmittedAt.slice(11, 16)}.`
                : `Transmit lane is ${formatStageStatus(derived.statuses.transmit)}.`,
          },
        ]
      : seeded.bridgeReadouts;

    const commandWhispers: Readout[] = runtimeEnabled
      ? [
          ...draft.quotes
            .slice()
            .reverse()
            .slice(0, 3)
            .map((quote) => ({
              title: quote.channel ?? quote.locationLabel ?? quote.speakerLabel,
              detail: quote.text,
            })),
          { title: 'Engine event', detail: eventLabel },
        ].slice(0, 4)
      : seeded.commandWhispers;

    const missionLogs: MissionLog[] =
      runtimeEnabled && draft.matches.length > 0
        ? draft.matches.map((match) => ({
            stamp: `${String(19 + Math.floor((match.sequence - 1) / 2)).padStart(2, '0')}:${String(12 + (match.sequence - 1) * 11).padStart(2, '0')}`,
            title: match.title,
            location: match.locationLabel,
            tag: isTransmitted ? `HQ ${match.tagLabel}` : `LIVE ${match.tagLabel}`,
            summary: match.summary,
            detail:
              match.detail ||
              (match.legendCandidate
                ? 'Marked as a legend candidate and queued for archive review.'
                : 'Logged in the session engine and waiting on final transmit.'),
            tone: match.tone,
          }))
      : seeded.missionLogs;

    const reportMetrics: ReportMetric[] = runtimeEnabled
      ? [
          {
            label: 'Crew loaded',
            value: clamp(Math.round((checkedInPlayers.length / Math.max(derived.players.length, 1)) * 100), 18, 100),
            note: checkedInPlayers.length > 0 ? 'Verified participants are now feeding the public room state.' : 'Crew load has not been verified yet.',
            tone: 'cool',
          },
          {
            label: 'Round pressure',
            value: clamp(42 + draft.matches.length * 12, 42, 96),
            note: draft.matches.at(-1)?.summary ?? 'As rounds land in the engine, the pressure rail climbs with them.',
            tone: 'warm',
          },
          {
            label: 'Suspicion heat',
            value: clamp(draft.outcome.flaggedSummary ? 84 : 58 + draft.matches.length * 5, 48, 98),
            note:
              draft.outcome.flaggedSummary ||
              'No flagged outcome has been committed yet, so the room still feels unresolved.',
            tone: 'hot',
          },
          {
            label: 'HQ readiness',
            value: isTransmitted ? 100 : isReportReady ? 86 : 54,
            note: phaseDetail,
            tone: isTransmitted ? 'hot' : 'cool',
          },
        ]
      : seeded.reportMetrics;

    const zoneDebriefs: ZoneDebrief[] =
      runtimeEnabled && draft.matches.length > 0
        ? draft.matches.slice(0, 3).map((match, index) => ({
            zone: match.locationLabel,
            outcome:
              index === 0 ? 'Opening shift' : index === 1 ? 'Pressure climb' : 'Late-room swing',
            detail: match.summary,
            tone: match.tone,
          }))
      : seeded.zoneDebriefs;

    const reportReadouts: Readout[] = runtimeEnabled
      ? [
          {
            title: 'Night verdict',
            detail:
              draft.outcome.verdict ||
              'Outcome record is still open, so HQ is watching the room instead of closing the file.',
          },
          {
            title: 'Highlight line',
            detail:
              draft.recap.highlight ||
              draft.quotes.find((quote) => quote.context === 'recap')?.text ||
              'No recap line has been pushed into the public memory yet.',
          },
          {
            title: 'Next-night risk',
            detail:
              draft.recap.publishNote ||
              'Once the report verifies, this line becomes the thing everyone remembers on the way into the next night.',
          },
        ]
      : seeded.reportReadouts;

    const transmissions: Transmission[] = runtimeEnabled
      ? [
          {
            title: isTransmitted ? 'HQ uplink' : 'Engine status',
            stamp: draft.publishState.transmittedAt?.slice(11, 16) ?? '--:--',
            author: 'Session engine',
            channel: isTransmitted ? 'Post-round' : 'Command link',
            body: phaseDetail,
            tone: isTransmitted ? 'hot' : 'cool',
          },
          {
            title: winner ? 'Outcome lock' : 'Outcome pending',
            stamp: '--:--',
            author: winner?.callsign ?? 'HQ watch',
            channel: 'Command link',
            body:
              draft.outcome.verdict ||
              draft.outcome.flaggedSummary ||
              'The room has not committed a winner yet, so the console is still holding the line open.',
            tone: draft.outcome.flaggedSummary ? 'hot' : 'warm',
          },
          {
            title: draft.recap.headline || 'Draft relay',
            stamp: '--:--',
            author: 'Records pod',
            channel: isTransmitted ? 'Post-round' : 'Draft bay',
            body: draft.recap.summary || draft.recap.highlight || 'The recap shell is live, but the final note is still being shaped.',
            tone: 'warm',
          },
          ...seeded.transmissions,
        ]
      : seeded.transmissions;

    return {
      engine,
      sync: {
        runtimeEnabled,
        isLiveSession,
        isReportReady,
        isTransmitted,
        phaseLabel,
        phaseDetail,
      },
      shell: {
        title: draft.session.label,
        statusLabel: phaseLabel,
        detail: phaseDetail,
        activeStageLabel: engine.stages.find((stage) => stage.id === engine.activeStageId)?.label ?? 'Boot Session',
      },
      commandCenter: {
        commandStats,
        bridgeReadouts,
        commandWhispers,
        roomRoster,
      },
      missionLogs,
      missionReport: {
        headline: draft.recap.headline || draft.session.label,
        summary:
          draft.recap.summary ||
          'The debrief is waiting on a report draft before the room can settle into official memory.',
        verdict:
          draft.outcome.verdict ||
          'No verdict has been committed yet, so the room is still technically arguing with itself.',
        recommendation:
          draft.recap.publishNote ||
          'Keep the relay clear. Once the report verifies, this line becomes the night-after instruction.',
        metrics: reportMetrics,
        readouts: reportReadouts,
        zoneDebriefs,
      },
      transmissions,
    };
  }, [derived, draft, engine, eventLabel, seeded]);
}
