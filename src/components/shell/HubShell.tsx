import { useState, type ReactNode } from 'react';
import { signOutOpsUser, useAuthState } from '../../auth/authStore';
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
  const auth = useAuthState();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const showOpsSignOut = currentRoute.section === 'ops' && auth.isAuthenticated;

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    try {
      await signOutOpsUser();
      if (typeof window !== 'undefined') {
        window.location.hash = '#/ops';
      }
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <>
      <div
        className={`hq-layout hq-layout--mobile hq-layout--${currentRoute.shell} zone-shell zone-shell--${currentRoute.section} zone-shell--${currentRoute.id}`}
      >
        <header className={`topbar topbar--${currentRoute.section}`}>
          <div className="topbar__identity">
            <a className="brand-mark" href="#/" aria-label="Olympus Prime Trade Play Build">
              <img src="/brand/selected/olympus-prime-mark.svg" alt="" />
              <span>
                <strong>Olympus Prime</strong>
                <small>Trade · Play · Build</small>
              </span>
            </a>

            <p className="topbar__subcopy">
              A Web3-native room for traders, gamers, and builders who actually show up.
            </p>
          </div>

          <div className="topbar__controls">
            <div className="topbar__status" aria-label="Current area">
              <span className="topbar__section">{sectionMarkers[currentRoute.section]}</span>
              <strong>{currentRoute.stateLabel}</strong>
            </div>
            {showOpsSignOut ? (
              <button className="topbar__sign-out" type="button" onClick={handleSignOut} disabled={isSigningOut}>
                {isSigningOut ? 'Signing out' : 'Sign out'}
              </button>
            ) : null}
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
