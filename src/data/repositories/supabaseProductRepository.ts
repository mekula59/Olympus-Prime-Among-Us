import type { ProductRepository } from '../../types/productRepository';
import { createSupabaseClientScaffold, isSupabaseConfigured } from '../../lib/supabase';
import { localProductRepository } from './localProductRepository';
import { getRuntimeProductData } from '../runtimeProductStore';
import { fetchSupabaseCanonicalProductData } from './supabaseCanonicalData';

function notReadyError(method: string) {
  return new Error(
    `supabaseProductRepository.${method} is scaffolded but not implemented yet. Configure Supabase and replace this placeholder method before switching the repository driver.`,
  );
}

export const supabaseProductRepository: ProductRepository = {
  driver: 'supabase',
  createSessionDraftRecord(gameId) {
    throw notReadyError(`createSessionDraftRecord(${gameId ?? 'among-us'})`);
  },
  saveGenericSessionEditor() {
    throw notReadyError('saveGenericSessionEditor');
  },
  persistSessionEngineDraft() {
    throw notReadyError('persistSessionEngineDraft');
  },
  getDefaultHubOpsSessionId() {
    throw notReadyError('getDefaultHubOpsSessionId');
  },
  getCanonicalProductData() {
    void fetchSupabaseCanonicalProductData().catch(() => null);
    return getRuntimeProductData();
  },
};

export function getSupabaseRepositoryReadiness() {
  const client = createSupabaseClientScaffold();

  return {
    driver: supabaseProductRepository.driver,
    configured: isSupabaseConfigured(),
    client,
  };
}

export function getSupabaseFallbackRepository() {
  return localProductRepository;
}
