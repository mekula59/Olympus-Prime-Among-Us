import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type PropsWithChildren,
} from 'react';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '../lib/supabase';

const OPS_AUTH_RETURN_PATH_KEY = 'olympus-prime.ops-auth-return-path.v1';
const OPS_AUTH_RETURN_PATH_PARAM = 'returnTo';

export type WorkspaceRole = 'editor' | 'admin';

export interface ProfileRecord {
  id: string;
  displayName: string;
  discordHandle: string | null;
  status: string;
}

export interface WorkspaceMembershipRecord {
  userId: string;
  role: WorkspaceRole;
  isActive: boolean;
}

export interface AuthSnapshot {
  status: 'disabled' | 'loading' | 'ready';
  session: Session | null;
  user: User | null;
  profile: ProfileRecord | null;
  membership: WorkspaceMembershipRecord | null;
  isAuthenticated: boolean;
  isMember: boolean;
  isAdmin: boolean;
  error: string | null;
}

const defaultAuthSnapshot: AuthSnapshot = {
  status: isSupabaseConfigured() ? 'loading' : 'disabled',
  session: null,
  user: null,
  profile: null,
  membership: null,
  isAuthenticated: false,
  isMember: false,
  isAdmin: false,
  error: null,
};

const AuthContext = createContext<AuthSnapshot | null>(null);
const listeners = new Set<() => void>();

let authSnapshot: AuthSnapshot = defaultAuthSnapshot;
let authInitialized = false;
let authUnsubscribe: (() => void) | null = null;
let authRefreshSequence = 0;
let scheduledAuthRefreshId: number | null = null;

function emitAuthChange() {
  listeners.forEach((listener) => listener());
}

function setAuthSnapshot(next: AuthSnapshot) {
  authSnapshot = next;
  emitAuthChange();
}

function buildReadySnapshot(
  session: Session | null,
  profile: ProfileRecord | null,
  membership: WorkspaceMembershipRecord | null,
  error: string | null,
): AuthSnapshot {
  return {
    status: 'ready',
    session,
    user: session?.user ?? null,
    profile,
    membership,
    isAuthenticated: Boolean(session?.user),
    isMember: Boolean(membership?.isActive),
    isAdmin: membership?.isActive === true && membership.role === 'admin',
    error,
  };
}

async function loadProfile(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from('profiles')
    .select('id, display_name, discord_handle, status')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    displayName: data.display_name,
    discordHandle: data.discord_handle,
    status: data.status,
  } satisfies ProfileRecord;
}

async function loadMembership(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from('workspace_memberships')
    .select('user_id, role, is_active')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    userId: data.user_id,
    role: data.role,
    isActive: data.is_active,
  } satisfies WorkspaceMembershipRecord;
}

async function refreshAuthSnapshot(sessionOverride?: Session | null) {
  const refreshId = ++authRefreshSequence;
  const client = getSupabaseBrowserClient();
  if (!client) {
    const nextSnapshot = {
      ...defaultAuthSnapshot,
      status: 'disabled',
    } satisfies AuthSnapshot;

    if (refreshId === authRefreshSequence) {
      setAuthSnapshot(nextSnapshot);
    }

    return nextSnapshot;
  }

  if (authSnapshot.status !== 'ready') {
    setAuthSnapshot({
      ...authSnapshot,
      status: 'loading',
      error: null,
    });
  }

  let session: Session | null = null;
  try {
    if (sessionOverride !== undefined) {
      session = sessionOverride;
    } else {
      const { data, error } = await client.auth.getSession();
      if (error) {
        throw error;
      }
      session = data.session ?? null;
    }
  } catch (error) {
    const nextSnapshot = buildReadySnapshot(
      null,
      null,
      null,
      error instanceof Error ? error.message : 'Unable to restore Supabase auth session.',
    );

    if (refreshId === authRefreshSequence) {
      setAuthSnapshot(nextSnapshot);
    }

    return nextSnapshot;
  }

  if (!session?.user) {
    const nextSnapshot = buildReadySnapshot(null, null, null, null);
    if (refreshId === authRefreshSequence) {
      setAuthSnapshot(nextSnapshot);
    }
    return nextSnapshot;
  }

  try {
    const [profile, membership] = await Promise.all([
      loadProfile(client, session.user.id),
      loadMembership(client, session.user.id),
    ]);

    const nextSnapshot = buildReadySnapshot(session, profile, membership, null);
    if (refreshId === authRefreshSequence) {
      setAuthSnapshot(nextSnapshot);
    }
    return nextSnapshot;
  } catch (error) {
    const nextSnapshot = buildReadySnapshot(
      session,
      null,
      null,
      error instanceof Error ? error.message : 'Unable to load auth membership state.',
    );
    if (refreshId === authRefreshSequence) {
      setAuthSnapshot(nextSnapshot);
    }
    return nextSnapshot;
  }
}

function scheduleAuthSnapshotRefresh(session: Session | null) {
  if (scheduledAuthRefreshId !== null) {
    window.clearTimeout(scheduledAuthRefreshId);
  }

  scheduledAuthRefreshId = window.setTimeout(() => {
    scheduledAuthRefreshId = null;
    void refreshAuthSnapshot(session);
  }, 0);
}

function ensureAuthStoreInitialized() {
  if (authInitialized || !isSupabaseConfigured()) {
    return authUnsubscribe;
  }

  const client = getSupabaseBrowserClient();
  if (!client) {
    return null;
  }

  authInitialized = true;
  void refreshAuthSnapshot();

  const {
    data: { subscription },
  } = client.auth.onAuthStateChange((_event, session) => {
    scheduleAuthSnapshotRefresh(session);
  });

  authUnsubscribe = () => {
    if (scheduledAuthRefreshId !== null) {
      window.clearTimeout(scheduledAuthRefreshId);
      scheduledAuthRefreshId = null;
    }

    subscription.unsubscribe();
    authInitialized = false;
    authUnsubscribe = null;
  };

  return authUnsubscribe;
}

function getCurrentAppPath() {
  if (typeof window === 'undefined') {
    return '/ops';
  }

  const rawHash = window.location.hash.replace(/^#/, '');
  return rawHash.startsWith('/ops') ? rawHash : '/ops';
}

function sanitizeOpsReturnPath(value: string | null | undefined) {
  return value?.startsWith('/ops') ? value : null;
}

function getAuthCallbackRedirectUrl() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const returnPath = getCurrentAppPath();
  const callbackUrl = new URL('/auth/callback', window.location.origin);
  callbackUrl.searchParams.set(OPS_AUTH_RETURN_PATH_PARAM, returnPath);
  return callbackUrl.toString();
}

function storeOpsAuthReturnPath() {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(OPS_AUTH_RETURN_PATH_KEY, getCurrentAppPath());
}

function consumeOpsAuthReturnPath() {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedPath = window.sessionStorage.getItem(OPS_AUTH_RETURN_PATH_KEY);
  window.sessionStorage.removeItem(OPS_AUTH_RETURN_PATH_KEY);

  return sanitizeOpsReturnPath(storedPath);
}

function getCallbackReturnPath() {
  if (typeof window === 'undefined') {
    return null;
  }

  const callbackUrl = new URL(window.location.href);
  return sanitizeOpsReturnPath(callbackUrl.searchParams.get(OPS_AUTH_RETURN_PATH_PARAM));
}

export function restoreOpsAuthReturnPath() {
  const returnPath = getCallbackReturnPath() ?? consumeOpsAuthReturnPath();
  if (!returnPath || typeof window === 'undefined') {
    return false;
  }

  window.location.replace(`${window.location.origin}/#${returnPath}`);
  return true;
}

export function subscribeAuthStore(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getAuthSnapshot() {
  return authSnapshot;
}

export async function refreshCurrentAuthSnapshot() {
  return refreshAuthSnapshot();
}

export async function requestPasswordlessSignIn(email: string) {
  const client = getSupabaseBrowserClient();
  if (!client) {
    throw new Error('Supabase auth is not configured for this environment.');
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    throw new Error('Enter an email address to continue.');
  }

  storeOpsAuthReturnPath();

  const { error } = await client.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      emailRedirectTo: getAuthCallbackRedirectUrl(),
    },
  });

  if (error) {
    throw error;
  }
}

export async function signOutOpsUser() {
  const client = getSupabaseBrowserClient();
  if (!client) {
    throw new Error('Supabase auth is not configured for this environment.');
  }

  const { error } = await client.auth.signOut();
  if (error) {
    throw error;
  }

  return refreshAuthSnapshot(null);
}

export function requireAuthenticatedWorkspaceMember() {
  const snapshot = getAuthSnapshot();

  if (snapshot.status === 'loading') {
    throw new Error('Supabase auth is still loading. Retry the Ops action once the session is ready.');
  }

  if (!snapshot.user) {
    throw new Error('Authenticated workspace member required for Ops writes.');
  }

  if (!snapshot.isMember) {
    throw new Error('Active workspace membership required for Ops writes.');
  }

  return {
    userId: snapshot.user.id,
    role: snapshot.membership?.role ?? null,
  };
}

export function useAuthState() {
  const contextValue = useContext(AuthContext);
  const snapshot = useSyncExternalStore(
    subscribeAuthStore,
    getAuthSnapshot,
    getAuthSnapshot,
  );

  return contextValue ?? snapshot;
}

export function AuthProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const unsubscribe = ensureAuthStoreInitialized();
    return () => unsubscribe?.();
  }, []);

  const snapshot = useSyncExternalStore(
    subscribeAuthStore,
    getAuthSnapshot,
    getAuthSnapshot,
  );

  const value = useMemo(() => snapshot, [snapshot]);

  return createElement(AuthContext.Provider, { value }, children);
}
