import { useEffect, useState } from 'react';
import {
  refreshCurrentAuthSnapshot,
  restoreOpsAuthReturnPath,
  useAuthState,
} from '../../auth/authStore';
import { PageIntro } from '../PageIntro';

function hasAuthCallbackPayload() {
  return (
    window.location.search.includes('code=') ||
    window.location.hash.includes('access_token=') ||
    window.location.hash.includes('refresh_token=')
  );
}

export function AuthCallbackPage() {
  const auth = useAuthState();
  const [callbackTimedOut, setCallbackTimedOut] = useState(false);

  useEffect(() => {
    if (auth.status === 'loading') {
      return;
    }

    if (!auth.isAuthenticated && hasAuthCallbackPayload() && !callbackTimedOut) {
      return;
    }

    const restored = restoreOpsAuthReturnPath();
    if (!restored) {
      window.location.replace(`${window.location.origin}/#/ops`);
    }
  }, [auth.isAuthenticated, auth.status, callbackTimedOut]);

  useEffect(() => {
    if (auth.isAuthenticated || callbackTimedOut || !hasAuthCallbackPayload()) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void refreshCurrentAuthSnapshot().then((snapshot) => {
        if (snapshot.isAuthenticated) {
          return;
        }

        setCallbackTimedOut(true);
      });
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [auth.isAuthenticated, callbackTimedOut]);

  return (
    <div className="page page--ops-access-gate">
      <PageIntro
        eyebrow="Ops access"
        title="Completing sign-in."
        lede="We’re restoring your Olympus Prime session and returning you to the Ops page you opened."
        tags={['Auth callback', 'Returning to Ops']}
      />
    </div>
  );
}
