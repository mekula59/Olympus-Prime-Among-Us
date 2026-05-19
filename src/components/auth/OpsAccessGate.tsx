import { useState, type FormEvent } from 'react';
import { requestPasswordlessSignIn, useAuthState } from '../../auth/authStore';
import { ModuleFrame } from '../ModuleFrame';
import { PageIntro } from '../PageIntro';

export function OpsAccessGate() {
  const auth = useAuthState();
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  if (auth.status === 'loading') {
    return (
      <div className="page page--ops-access-gate">
        <PageIntro
          eyebrow="Ops access"
          title="Checking workspace access."
          lede="Ops is for Olympus Prime members. We’re checking your session before opening the command room."
          tags={['Auth required', 'Workspace only']}
        />
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    const signInAvailable = auth.status !== 'disabled';

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();

      if (!signInAvailable || submitState === 'sending') {
        return;
      }

      setSubmitState('sending');
      setSubmitMessage(null);

      try {
        await requestPasswordlessSignIn(email);
        setSubmitState('sent');
        setSubmitMessage('Check your email for the Olympus Prime sign-in link, then return to this Ops page.');
      } catch (error) {
        setSubmitState('idle');
        setSubmitMessage(
          error instanceof Error ? error.message : 'Unable to start sign-in right now.',
        );
      }
    }

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
          lede={
            signInAvailable
              ? 'Use your Olympus Prime workspace email to continue, or return to the public Hub.'
              : 'Supabase auth is not configured in this environment yet, so Ops sign-in is unavailable here.'
          }
          tone="cool"
        >
          {signInAvailable ? (
            <form className="ops-access-form" onSubmit={handleSubmit}>
              <label className="ops-field">
                <span>Workspace email</span>
                <input
                  autoComplete="email"
                  inputMode="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="captain@olympusprime.gg"
                  type="email"
                  value={email}
                />
              </label>

              {submitMessage ? (
                <p
                  className={`ops-access-form__message ops-access-form__message--${submitState === 'sent' ? 'success' : 'error'}`}
                >
                  {submitMessage}
                </p>
              ) : null}

              <div className="hub-placeholder__actions">
                <button
                  className="primary-link"
                  disabled={submitState === 'sending'}
                  type="submit"
                >
                  {submitState === 'sending' ? 'Sending link…' : 'Email me a sign-in link'}
                </button>
                <a className="secondary-link" href="#/">
                  Return to Hub
                </a>
              </div>
            </form>
          ) : (
            <div className="hub-placeholder__actions">
              <a className="primary-link" href="#/">
                Return to Hub
              </a>
            </div>
          )}
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
