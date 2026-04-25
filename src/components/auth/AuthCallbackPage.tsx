import { useEffect } from 'react';
import { restoreOpsAuthReturnPath, useAuthState } from '../../auth/authStore';
import { PageIntro } from '../PageIntro';

export function AuthCallbackPage() {
  const auth = useAuthState();

  useEffect(() => {
    if (auth.status !== 'ready') {
      return;
    }

    const restored = restoreOpsAuthReturnPath();
    if (!restored) {
      window.history.replaceState(null, '', '#/ops');
    }
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
