import type {
  ProductRepository,
  ProductRepositoryDriver,
  SaveGenericSessionEditorPayload,
} from '../types/productRepository';
import type { SessionEngineDraft } from '../types/sessionEngine';
import { isSupabaseConfigured } from '../lib/supabase';
import { localProductRepository } from './repositories/localProductRepository';
import { supabaseProductRepository } from './repositories/supabaseProductRepository';

function getConfiguredRepositoryDriver(): ProductRepositoryDriver {
  const requestedDriver = import.meta.env.VITE_PRODUCT_REPOSITORY_DRIVER;

  if (requestedDriver === 'supabase' && isSupabaseConfigured()) {
    return 'supabase';
  }

  return 'local';
}

function getRepository(): ProductRepository {
  const driver = getConfiguredRepositoryDriver();
  return driver === 'supabase' ? supabaseProductRepository : localProductRepository;
}

export function getProductRepository() {
  return getRepository();
}

export function getActiveProductRepositoryDriver() {
  return getRepository().driver;
}

export async function createSessionDraftRecord(gameId = 'among-us') {
  return getRepository().createSessionDraftRecord(gameId);
}

export function saveGenericSessionEditor(
  sessionId: string,
  payload: SaveGenericSessionEditorPayload,
) {
  return getRepository().saveGenericSessionEditor(sessionId, payload);
}

export function persistSessionEngineDraft(draft: SessionEngineDraft) {
  return getRepository().persistSessionEngineDraft(draft);
}

export function getDefaultHubOpsSessionId() {
  return getRepository().getDefaultHubOpsSessionId();
}

export function getCanonicalProductData() {
  return getRepository().getCanonicalProductData();
}
