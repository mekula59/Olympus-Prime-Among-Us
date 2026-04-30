import type { RuntimeProductData } from '../data/runtimeProductStore';
import type { SessionRecord } from './product';
import type { SessionEngineDraft } from './sessionEngine';

export type ProductRepositoryDriver = 'local' | 'supabase';

export interface SaveGenericSessionEditorPayload {
  sessionName: string;
  date: string;
  room: string;
  mode: string;
  notes: string;
  headline: string;
  summary: string;
  highlight: string;
  publishNote: string;
}

export interface ProductRepository {
  readonly driver: ProductRepositoryDriver;
  createSessionDraftRecord(gameId?: string): SessionRecord | Promise<SessionRecord>;
  saveGenericSessionEditor(
    sessionId: string,
    payload: SaveGenericSessionEditorPayload,
  ): void | Promise<void>;
  persistSessionEngineDraft(draft: SessionEngineDraft): void | Promise<void>;
  getDefaultHubOpsSessionId(): string;
  getCanonicalProductData(): RuntimeProductData;
}
