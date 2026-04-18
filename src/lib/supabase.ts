export interface SupabaseClientConfig {
  url: string;
  anonKey: string;
  schema: string;
}

export interface SupabaseClientScaffold {
  config: SupabaseClientConfig;
  ready: boolean;
}

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
