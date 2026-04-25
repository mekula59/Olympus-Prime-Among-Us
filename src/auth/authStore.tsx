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
  const client = getSupabaseBrowserClient();
  if (!client) {
    setAuthSnapshot({
      ...defaultAuthSnapshot,
      status: 'disabled',
    });
    return defaultAuthSnapshot;
  }

  setAuthSnapshot({
    ...authSnapshot,
    status: 'loading',
    error: null,
  });

  const session =
    sessionOverride !== undefined
      ? sessionOverride
      : (await client.auth.getSession()).data.session ?? null;

  if (!session?.user) {
    const nextSnapshot = buildReadySnapshot(null, null, null, null);
    setAuthSnapshot(nextSnapshot);
    return nextSnapshot;
  }

  try {
    const [profile, membership] = await Promise.all([
      loadProfile(client, session.user.id),
      loadMembership(client, session.user.id),
    ]);

    const nextSnapshot = buildReadySnapshot(session, profile, membership, null);
    setAuthSnapshot(nextSnapshot);
    return nextSnapshot;
  } catch (error) {
    const nextSnapshot = buildReadySnapshot(
      session,
      null,
      null,
      error instanceof Error ? error.message : 'Unable to load auth membership state.',
    );
    setAuthSnapshot(nextSnapshot);
    return nextSnapshot;
  }
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
    void refreshAuthSnapshot(session);
  });

  authUnsubscribe = () => {
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

function getAuthCallbackRedirectUrl() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const callbackUrl = new URL(window.location.href);
  callbackUrl.hash = '';
  callbackUrl.search = '';
  callbackUrl.pathname = '/auth/callback';
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

  return storedPath?.startsWith('/ops') ? storedPath : null;
}

export function restoreOpsAuthReturnPath() {
  const returnPath = consumeOpsAuthReturnPath();
  if (!returnPath || typeof window === 'undefined') {
    return false;
  }

  window.history.replaceState(null, '', `#${returnPath}`);
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
