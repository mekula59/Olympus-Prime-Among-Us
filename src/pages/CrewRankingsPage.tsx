import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { crewRankings, crewRibbons } from '../data/hqData';
import { ModuleFrame } from '../components/ModuleFrame';
import { PageIntro } from '../components/PageIntro';

const boardModes = [
  { id: 'reads', label: 'Reads' },
  { id: 'wins', label: 'Wins' },
  { id: 'heat', label: 'Heat' },
] as const;

export function CrewRankingsPage() {
  const [boardMode, setBoardMode] = useState<(typeof boardModes)[number]['id']>('reads');
  const [focusId, setFocusId] = useState(crewRankings[0]?.id ?? '');
  const [boardEvent, setBoardEvent] = useState('BOARD VERIFIED');

  const sortedRankings = useMemo(() => {
    const ranked = [...crewRankings];

    if (boardMode === 'wins') {
      ranked.sort((left, right) => right.wins - left.wins);
    } else if (boardMode === 'heat') {
      const score = { hot: 3, warm: 2, cool: 1, quiet: 0 } as const;
      ranked.sort((left, right) => score[right.tone] - score[left.tone] || right.readScore - left.readScore);
    } else {
      ranked.sort((left, right) => right.readScore - left.readScore);
    }

    return ranked;
  }, [boardMode]);

  const champion = sortedRankings[0];
  const risers = sortedRankings.slice(1);
  const focusPlayer = sortedRankings.find((entry) => entry.id === focusId) ?? champion;

  if (!champion || !focusPlayer) {
    return null;
  }

  function switchBoardMode(modeId: (typeof boardModes)[number]['id']) {
    setBoardMode(modeId);
    setBoardEvent(
      modeId === 'wins' ? 'WIN BOARD ACTIVE' : modeId === 'heat' ? 'HEAT BOARD FLAGGED' : 'READ BOARD ACTIVE',
    );
  }

  function lockFocus(playerId: string) {
    const player = sortedRankings.find((entry) => entry.id === playerId);
    setFocusId(playerId);
    setBoardEvent(`${player?.callsign.toUpperCase() ?? 'CREW'} LOCKED`);
  }

  return (
    <div className="page page--crew-rankings">
      <PageIntro
        eyebrow="Board"
        title="Set the board. See who owns the room."
        lede="This room should feel closer to a live vote board than a leaderboard page. Short labels, player colors, and one mode change away from a new top slot."
        tags={['BOARD LIVE', 'COLOR FIRST', 'ROOM HEAT']}
        aside={
          <div className="memory-orb memory-orb--compact memory-orb--system">
            <p className="memory-orb__label">Board mode</p>
            <strong>{boardMode.toUpperCase()}</strong>
            <span>The top slot changes with the question you ask the room.</span>
          </div>
        }
      />

      <ModuleFrame
        eyebrow="Board mode"
        title="Rank sim"
        lede="Switch the board and the room tells a different story."
        className="rank-console"
      >
        <div className="system-event-strip">
          <span>Board event</span>
          <strong>{boardEvent}</strong>
          <small>{focusPlayer.callsign} is the current focus target.</small>
        </div>

        <div className="system-switcher" role="tablist" aria-label="Ranking modes">
          {boardModes.map((mode) => (
            <button
              className={`system-switch ${mode.id === boardMode ? 'system-switch--active' : ''}`}
              key={mode.id}
              onClick={() => switchBoardMode(mode.id)}
              type="button"
            >
              <span>{mode.id === boardMode ? 'ACTIVE' : 'LOAD'}</span>
              <strong>{mode.label}</strong>
            </button>
          ))}
        </div>

        <div className="rank-console__grid">
          <div className="top-slot" style={{ '--player-color': champion.colorHex } as CSSProperties}>
            <span className="top-slot__eyebrow">Top slot</span>
            <div className="top-slot__token" />
            <strong>{champion.callsign}</strong>
            <small>{champion.colorName}</small>
            <p>{champion.signature}</p>
            <div className="top-slot__stats">
              <span>{champion.wins} wins</span>
              <span>{champion.readScore} read</span>
              <span>{champion.badge}</span>
            </div>
          </div>

          <div className="board-list">
            {sortedRankings.map((entry, index) => (
              <button
                className={`board-strip ${entry.id === focusPlayer.id ? 'board-strip--active' : ''}`}
                key={entry.id}
                onClick={() => lockFocus(entry.id)}
                style={{ '--player-color': entry.colorHex } as CSSProperties}
                type="button"
              >
                <span>0{index + 1}</span>
                <div>
                  <strong>{entry.callsign}</strong>
                  <p>{entry.badge}</p>
                </div>
                <small>{boardMode === 'wins' ? `${entry.wins}W` : `${entry.readScore}`}</small>
              </button>
            ))}
          </div>
        </div>
      </ModuleFrame>

      <div className="two-up-grid rank-two-up">
        <ModuleFrame
          eyebrow="Focus slot"
          title={`${focusPlayer.callsign} file`}
          lede="Press any player and the board reroutes the spotlight."
          tone={focusPlayer.tone}
          className="focus-panel"
        >
          <div className="focus-panel__head">
            <span
              className="focus-panel__token"
              style={{ '--player-color': focusPlayer.colorHex } as CSSProperties}
            />
            <div>
              <strong>{focusPlayer.name}</strong>
              <p>{focusPlayer.role}</p>
            </div>
          </div>
          <p className="focus-panel__quote">{focusPlayer.signature}</p>
          <div className="focus-panel__stats">
            <article>
              <span>Wins</span>
              <strong>{focusPlayer.wins}</strong>
            </article>
            <article>
              <span>Read</span>
              <strong>{focusPlayer.readScore}</strong>
            </article>
            <article>
              <span>Run</span>
              <strong>{focusPlayer.streak}</strong>
            </article>
          </div>
        </ModuleFrame>

        <ModuleFrame
          eyebrow="Drops"
          title="Night awards"
          lede="These should feel like round-end drops, not website badges."
          tone="warm"
          className="ribbon-drops"
        >
          <div className="ribbon-stack ribbon-stack--system">
            {crewRibbons.map((ribbon) => (
              <article className={`ribbon-card ribbon-card--${ribbon.tone}`} key={ribbon.title}>
                <span>{ribbon.winner}</span>
                <h4>{ribbon.title}</h4>
                <p>{ribbon.detail}</p>
              </article>
            ))}
          </div>
        </ModuleFrame>
      </div>
    </div>
  );
}
