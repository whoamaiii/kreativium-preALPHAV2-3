import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { queryClient } from './queryClient';

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'ADMIN_CACHE',
  throttleTime: 1000,
  serialize: (data) => JSON.stringify(data),
  deserialize: (data) => JSON.parse(data),
});

export const setupQueryPersistence = () => {
  persistQueryClient({
    queryClient,
    persister,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    buster: '1.0.0', // Version of the cache, increment when making breaking changes
  });
};