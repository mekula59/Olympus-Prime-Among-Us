import type { ReactNode } from 'react';
import type { AppRoute } from '../../config/routes';
import { HubBottomNav } from './HubBottomNav';

interface HubShellProps {
  currentPath: string;
  currentRoute: AppRoute;
  moduleHeader?: ReactNode;
  children: ReactNode;
}

const sectionMarkers: Record<AppRoute['section'], string> = {
  hub: 'HUB',
  games: 'REALM',
  ops: 'COMMAND',
};

export function HubShell({ currentPath, currentRoute, moduleHeader, children }: HubShellProps) {
  return (
    <>
      <div
        className={`hq-layout hq-layout--mobile hq-layout--${currentRoute.shell} zone-shell zone-shell--${currentRoute.section} zone-shell--${currentRoute.id}`}
      >
        <header className={`topbar topbar--${currentRoute.section}`}>
          <div className="topbar__identity">
            <a className="brand-mark" href="#/" aria-label="Olympus Prime World Layer">
              <img src="/brand/selected/olympus-prime-mark.svg" alt="" />
              <span>
                <strong>Olympus Prime</strong>
                <small>World Layer</small>
              </span>
            </a>

            <p className="topbar__subcopy">The room starts in Discord. Olympus Prime keeps the wins, reads, rivalries, and receipts.</p>
          </div>

          <div className="topbar__status" aria-label="Current layer">
            <span className="topbar__section">{sectionMarkers[currentRoute.section]}</span>
            <strong>{currentRoute.stateLabel}</strong>
          </div>
        </header>

        {moduleHeader}

        <main
          className={`page-stage page-stage--mobile page-stage--${currentRoute.shell} zone-stage zone-stage--${currentRoute.section} zone-stage--${currentRoute.id}`}
          key={currentPath}
        >
          <div className="zone-entry" aria-hidden="true">
            <span>{sectionMarkers[currentRoute.section]}</span>
            <strong>{currentRoute.stateLabel}</strong>
          </div>
          {children}
        </main>
      </div>

      <HubBottomNav currentPath={currentPath} />
    </>
  );
}
