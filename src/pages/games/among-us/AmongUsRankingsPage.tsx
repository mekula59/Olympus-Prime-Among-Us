import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { useAmongUsModuleData } from '../../../data/games/among-us/amongUsData';
import { ModuleFrame } from '../../../components/ModuleFrame';

const boardModes = [
  { id: 'reads', label: 'Reads' },
  { id: 'wins', label: 'Wins' },
  { id: 'heat', label: 'Heat' },
] as const;

export function AmongUsRankingsPage() {
  const { crewRankings, crewRibbons } = useAmongUsModuleData();
  const [boardMode, setBoardMode] = useState<(typeof boardModes)[number]['id']>('reads');
  const [focusId, setFocusId] = useState(crewRankings[0]?.id ?? '');

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
  const focusPlayer = sortedRankings.find((entry) => entry.id === focusId) ?? champion;

  useEffect(() => {
    if (!crewRankings.length) {
      return;
    }

    if (!focusId || !crewRankings.some((entry) => entry.id === focusId)) {
      setFocusId(crewRankings[0].id);
    }
  }, [crewRankings, focusId]);

  if (!champion || !focusPlayer) {
    return null;
  }

  function switchBoardMode(modeId: (typeof boardModes)[number]['id']) {
    setBoardMode(modeId);
  }

  function lockFocus(playerId: string) {
    setFocusId(playerId);
  }

  return (
    <div className="page page--crew-rankings">
      <section className="module-screen-header" aria-label="Among Us rankings">
        <p className="module-screen-header__eyebrow">Among Us</p>
        <h2>Room board</h2>
        <p className="module-screen-header__lede">Sort the room by reads, wins, and heat. The board keeps the receipts the lobby argues about.</p>

        <div className="module-utility-row" aria-label="Ranking summary">
          <article>
            <span>Mode</span>
            <strong>{boardMode}</strong>
          </article>
          <article>
            <span>Top</span>
            <strong>{champion.callsign}</strong>
          </article>
          <article>
            <span>Board</span>
            <strong>{sortedRankings.length} crew</strong>
          </article>
        </div>
      </section>

      <ModuleFrame className="rank-console module-screen-module">
        <div className="system-switcher" role="tablist" aria-label="Ranking modes">
          {boardModes.map((mode) => (
            <button
              aria-selected={mode.id === boardMode}
              className={`system-switch ${mode.id === boardMode ? 'system-switch--active' : ''}`}
              key={mode.id}
              onClick={() => switchBoardMode(mode.id)}
              role="tab"
              type="button"
            >
              <span>{mode.id === boardMode ? 'Active' : 'Load'}</span>
              <strong>{mode.label}</strong>
            </button>
          ))}
        </div>

        <div className="rank-console__grid">
          <div
            className="top-slot"
            key={`${boardMode}-${champion.id}`}
            style={{ '--player-color': champion.colorHex } as CSSProperties}
          >
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

          <div className="board-list" key={boardMode}>
            {sortedRankings.map((entry, index) => (
              <button
                className={`board-strip ${entry.id === focusPlayer.id ? 'board-strip--active' : ''}`}
                key={entry.id}
                onClick={() => lockFocus(entry.id)}
                style={{ '--player-color': entry.colorHex } as CSSProperties}
                type="button"
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
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

      <div className="rank-mobile-stack">
        <ModuleFrame tone={focusPlayer.tone} className="focus-panel module-screen-module">
          <div key={focusPlayer.id} className="focus-panel__content">
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
          </div>
        </ModuleFrame>

        <ModuleFrame tone="warm" className="ribbon-drops module-screen-module">
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
