import { getActiveProductRepositoryDriver } from '../../data/productRepository';
import { useRuntimeSessionSyncState } from '../../data/runtimeProductStore';

interface OpsSyncStatusProps {
  sessionId?: string;
  className?: string;
}

function formatSyncTime(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function OpsSyncStatus({ sessionId, className }: OpsSyncStatusProps) {
  const { syncState } = useRuntimeSessionSyncState(sessionId);
  const driver = getActiveProductRepositoryDriver();

  let label = 'Local ready';
  let detail = 'Changes stay on this device in local mode.';
  let tone: 'draft' | 'ready' | 'published' | 'failed' = 'draft';

  if (!sessionId) {
    label = 'Waiting for session';
    detail = 'A session record needs to exist before sync state can be tracked.';
  } else if (driver === 'supabase') {
    if (syncState?.status === 'pending') {
      label = 'Saving';
      detail = 'Changes are queued and syncing to Supabase now.';
      tone = 'ready';
    } else if (syncState?.status === 'failed') {
      const failedAt = formatSyncTime(syncState.lastFailureAt);
      label = 'Sync failed';
      detail = syncState.lastError
        ? `${syncState.lastError}${failedAt ? ` Last attempt ${failedAt}.` : ''}`
        : failedAt
          ? `The last remote sync failed at ${failedAt}. Your local draft is still preserved.`
          : 'The last remote sync failed. Your local draft is still preserved.';
      tone = 'failed';
    } else if (syncState?.lastSuccessAt) {
      const savedAt = formatSyncTime(syncState.lastSuccessAt);
      label = 'Saved';
      detail = savedAt
        ? `Remote sync completed at ${savedAt}.`
        : 'Changes are synced to Supabase.';
      tone = 'published';
    } else {
      label = 'Ready to sync';
      detail = 'Remote sync will begin after the first saved change.';
      tone = 'draft';
    }
  }

  return (
    <div className={`ops-sync-status ${className ?? ''}`.trim()}>
      <div className="ops-sync-status__header">
        <span>Save state</span>
        <strong className={`ops-chip-status ops-chip-status--${tone}`}>{label}</strong>
      </div>
      <p>{detail}</p>
    </div>
  );
}
