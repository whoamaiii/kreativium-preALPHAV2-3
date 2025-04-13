import { UseQueryOptions } from '@tanstack/react-query';

/**
 * Default query options for React Query
 * Uses standardized stale time, garbage collection time, and retry settings
 */
export const DEFAULT_QUERY_OPTIONS: Partial<UseQueryOptions> = {
  staleTime: 1000 * 60 * 5, // 5 minutes
  gcTime: 1000 * 60 * 30, // 30 minutes
  retry: 2,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
};

/**
 * Long-lived query options for infrequently changing data
 */
export const LONG_LIVED_QUERY_OPTIONS: Partial<UseQueryOptions> = {
  staleTime: 1000 * 60 * 60, // 1 hour
  gcTime: 1000 * 60 * 60 * 24, // 24 hours
  retry: 2,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
};

/**
 * Real-time query options for frequently changing data
 */
export const REAL_TIME_QUERY_OPTIONS: Partial<UseQueryOptions> = {
  staleTime: 1000 * 30, // 30 seconds
  gcTime: 1000 * 60 * 5, // 5 minutes
  retry: 3,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  refetchInterval: 1000 * 60, // 1 minute
};

/**
 * Creates query options with a custom stale time
 * @param staleTimeMs Custom stale time in milliseconds
 * @returns Query options with custom stale time
 */
export function createQueryOptions(staleTimeMs: number): Partial<UseQueryOptions> {
  return {
    ...DEFAULT_QUERY_OPTIONS,
    staleTime: staleTimeMs,
  };
} 