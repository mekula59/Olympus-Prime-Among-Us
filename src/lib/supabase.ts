import { createClient } from '@supabase/supabase-js';

export interface SupabaseClientConfig {
  url: string;
  anonKey: string;
  schema: string;
}

export interface SupabaseClientScaffold {
  config: SupabaseClientConfig;
  ready: boolean;
}

let supabaseBrowserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseConfig(): SupabaseClientConfig {
  return {
    url: import.meta.env.VITE_SUPABASE_URL ?? '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
    schema: import.meta.env.VITE_SUPABASE_SCHEMA ?? 'public',
  };
}

export function isSupabaseConfigured() {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey);
}

export function createSupabaseClientScaffold(): SupabaseClientScaffold {
  const config = getSupabaseConfig();

  return {
    config,
    ready: isSupabaseConfigured(),
  };
}

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseBrowserClient) {
    const config = getSupabaseConfig();
    supabaseBrowserClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return supabaseBrowserClient;
}

export async function getSupabaseAccessToken() {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return null;
  }

  const {
    data: { session },
  } = await client.auth.getSession();

  return session?.access_token ?? null;
}
