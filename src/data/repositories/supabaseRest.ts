import { getSupabaseConfig } from '../../lib/supabase';

function buildBaseHeaders() {
  const config = getSupabaseConfig();

  return {
    apikey: config.anonKey,
    Authorization: `Bearer ${config.anonKey}`,
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
  const response = await fetch(
    `${config.url}/rest/v1/${table}?on_conflict=${encodeURIComponent(onConflict)}`,
    {
      method: 'POST',
      headers: {
        ...buildBaseHeaders(),
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
  const response = await fetch(`${config.url}/rest/v1/${table}?select=*`, {
    headers: buildBaseHeaders(),
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
  const response = await fetch(
    `${config.url}/rest/v1/${table}?${encodeURIComponent(column)}=eq.${encodeURIComponent(value)}`,
    {
      method: 'DELETE',
      headers: {
        ...buildBaseHeaders(),
        Prefer: 'return=minimal',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase delete failed for ${table}: ${response.status}`);
  }
}
