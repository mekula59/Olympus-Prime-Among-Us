import { useAuthState } from '../../auth/authStore';
import { ModuleFrame } from '../ModuleFrame';
import { PageIntro } from '../PageIntro';

export function OpsAccessGate() {
  const auth = useAuthState();

  if (auth.status === 'loading') {
    return (
      <div className="page page--ops-access-gate">
        <PageIntro
          eyebrow="Ops access"
          title="Checking workspace access."
          lede="Ops is limited to authenticated Olympus Prime workspace members. We’re confirming your session before opening the tools."
          tags={['Auth required', 'Workspace only']}
        />
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="page page--ops-access-gate">
        <PageIntro
          eyebrow="Ops access"
          title="Sign in to open Ops."
          lede="Public Hub and game pages stay open, but session creation, editing, and publish flows require an authenticated Olympus Prime workspace account."
          tags={['Sign in required', 'Public pages stay open']}
        />

        <ModuleFrame
          eyebrow="What to do next"
          title="Ops is members-only."
          lede="Use a workspace account to continue, or return to the public Hub."
          tone="cool"
        >
          <div className="hub-placeholder__actions">
            <a className="primary-link" href="#/">
              Return to Hub
            </a>
          </div>
        </ModuleFrame>
      </div>
    );
  }

  return (
    <div className="page page--ops-access-gate">
      <PageIntro
        eyebrow="Ops access"
        title="Workspace membership required."
        lede="Your account is signed in, but Ops is limited to active Olympus Prime editors and admins."
        tags={['Membership required', 'Editors and admins only']}
      />

      <ModuleFrame
        eyebrow="Current access"
        title="This account does not currently have Ops access."
        lede="If this looks wrong, ask an Olympus Prime admin to confirm your workspace membership."
        tone="warm"
      >
        <div className="hub-placeholder__actions">
          <a className="secondary-link" href="#/">
            Back to public Hub
          </a>
        </div>
      </ModuleFrame>
    </div>
  );
}
