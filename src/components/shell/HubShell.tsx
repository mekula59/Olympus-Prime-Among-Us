import type { ReactNode } from 'react';
import type { AppRoute } from '../../config/routes';
import { HubBottomNav } from './HubBottomNav';

interface HubShellProps {
  currentPath: string;
  currentRoute: AppRoute;
  moduleHeader?: ReactNode;
  children: ReactNode;
}

export function HubShell({ currentPath, currentRoute, moduleHeader, children }: HubShellProps) {
  return (
    <>
      <div className={`hq-layout hq-layout--mobile hq-layout--${currentRoute.shell}`}>
        <header className={`topbar topbar--${currentRoute.section}`}>
          <div className="topbar__identity">
            <a className="brand-mark" href="#/" aria-label="Olympus Prime Gamesnight Hub">
              <img src="/assets/olympus-signal.svg" alt="" />
              <span>
                Olympus Prime
                <strong>Gamesnight Hub</strong>
              </span>
            </a>

            <p className="topbar__subcopy">Discord runs the night. This HUD keeps the world readable after it.</p>
          </div>

          <div className="topbar__status" aria-label="Current layer">
            <span className="topbar__section">Zone // {currentRoute.section}</span>
            <strong>{currentRoute.stateLabel}</strong>
          </div>
        </header>

        {moduleHeader}

        <main className={`page-stage page-stage--mobile page-stage--${currentRoute.shell}`} key={currentPath}>
          {children}
        </main>
      </div>

      <HubBottomNav currentPath={currentPath} />
    </>
  );
}
