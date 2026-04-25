import { useEffect } from 'react';
import {
  refreshCurrentAuthSnapshot,
  restoreOpsAuthReturnPath,
  useAuthState,
} from '../../auth/authStore';
import { PageIntro } from '../PageIntro';

export function AuthCallbackPage() {
  const auth = useAuthState();

  useEffect(() => {
    if (auth.status === 'loading') {
      return;
    }

    const restored = restoreOpsAuthReturnPath();
    if (!restored) {
      window.location.replace(`${window.location.origin}/#/ops`);
    }
  }, [auth.status]);

  useEffect(() => {
    if (auth.status !== 'loading') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void refreshCurrentAuthSnapshot().then((snapshot) => {
        if (snapshot.status === 'loading') {
          return;
        }

        const restored = restoreOpsAuthReturnPath();
        if (!restored) {
          window.location.replace(`${window.location.origin}/#/ops`);
        }
      });
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [auth.status]);

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
