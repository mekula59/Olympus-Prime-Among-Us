/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PRODUCT_REPOSITORY_DRIVER?: 'local' | 'supabase';
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_SUPABASE_SCHEMA?: string;
  readonly VITE_OLYMPUS_X_PROFILE_URL?: string;
  readonly VITE_OLYMPUS_X_FEATURED_POST_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
