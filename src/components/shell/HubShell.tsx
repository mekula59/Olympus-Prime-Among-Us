import type { ReactNode } from 'react';
import type { AppRoute } from '../../config/routes';
import { HubBottomNav } from './HubBottomNav';

interface HubShellProps {
  currentPath: string;
  currentRoute: AppRoute;
  shellTitle: string;
  shellDetail: string;
  shellStatus: string;
  noteTitle: string;
  noteDetail: string;
  moduleHeader?: ReactNode;
  children: ReactNode;
}

export function HubShell({
  currentPath,
  currentRoute,
  shellTitle,
  shellDetail,
  shellStatus,
  noteTitle,
  noteDetail,
  moduleHeader,
  children,
}: HubShellProps) {
  return (
    <>
      <div className="hq-layout hq-layout--mobile">
        <header className="mobile-shell">
          <div className="mobile-shell__bar">
            <a className="brand-mark" href="#/" aria-label="Olympus Prime Gamesnight Hub">
              <img src="/assets/olympus-signal.svg" alt="" />
              <span>
                Olympus Prime
                <strong>Gamesnight Hub</strong>
              </span>
            </a>

            <div className="mobile-shell__status">
              <span>{currentRoute.section}</span>
              <strong>{currentRoute.stateLabel}</strong>
            </div>
          </div>

          <div className="mobile-shell__hero">
            <div>
              <p className="section-kicker">Hub status</p>
              <h1>{currentRoute.label}</h1>
              <p>{shellDetail}</p>
            </div>

            <div className="mobile-shell__signals" aria-label="Current route details">
              <article>
                <span>Live record</span>
                <strong>{shellTitle}</strong>
              </article>
              <article>
                <span>State</span>
                <strong>{shellStatus}</strong>
              </article>
            </div>
          </div>

          <div className="mobile-shell__whisper">
            <span>{noteTitle}</span>
            <p>{noteDetail}</p>
          </div>
        </header>

        {moduleHeader}

        <main className="page-stage page-stage--mobile" key={currentPath}>
          {children}
        </main>
      </div>

      <HubBottomNav currentPath={currentPath} />
    </>
  );
}
