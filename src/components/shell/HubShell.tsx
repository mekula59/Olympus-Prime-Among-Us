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
      <div className="hq-layout hq-layout--mobile">
        <header className="topbar">
          <a className="brand-mark" href="#/" aria-label="Olympus Prime Gamesnight Hub">
            <img src="/assets/olympus-signal.svg" alt="" />
            <span>
              Olympus Prime
              <strong>Gamesnight Hub</strong>
            </span>
          </a>

          <span className="topbar__section">{currentRoute.section}</span>
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
