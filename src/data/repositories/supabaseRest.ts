import { getSupabaseAccessToken, getSupabaseConfig } from '../../lib/supabase';

async function buildBaseHeaders() {
  const config = getSupabaseConfig();
  const accessToken = await getSupabaseAccessToken();

  return {
    apikey: config.anonKey,
    Authorization: `Bearer ${accessToken ?? config.anonKey}`,
    Accept: 'application/json',
    'Accept-Profile': config.schema,
    'Content-Profile': config.schema,
  };
}

export async function upsertSupabaseRows<T extends Record<string, unknown>>(
  table: string,
  rows: T[],
  onConflict = 'id',
) {
  const config = getSupabaseConfig();
  const headers = await buildBaseHeaders();
  const response = await fetch(
    `${config.url}/rest/v1/${table}?on_conflict=${encodeURIComponent(onConflict)}`,
    {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify(rows),
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase upsert failed for ${table}: ${response.status}`);
  }

  return response.json();
}

export async function fetchSupabaseTable(table: string) {
  const config = getSupabaseConfig();
  const headers = await buildBaseHeaders();
  const response = await fetch(`${config.url}/rest/v1/${table}?select=*`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`Supabase read failed for ${table}: ${response.status}`);
  }

  return response.json();
}

export async function deleteSupabaseRowsByColumn(
  table: string,
  column: string,
  value: string,
) {
  const config = getSupabaseConfig();
  const headers = await buildBaseHeaders();
  const response = await fetch(
    `${config.url}/rest/v1/${table}?${encodeURIComponent(column)}=eq.${encodeURIComponent(value)}`,
    {
      method: 'DELETE',
      headers: {
        ...headers,
        Prefer: 'return=minimal',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase delete failed for ${table}: ${response.status}`);
  }
}
