import { useState, useEffect, useCallback } from 'react';
import { EmotionLog, EmotionFilters, Emotion } from '../types/emotion';
import { EmotionDatabase } from '../lib/emotionDatabase';
import { useAuthContext } from './useAuthContext';

interface EmotionDataResult {
  logs: EmotionLog[];
  isLoading: boolean;
  error: Error | null;
  filters: EmotionFilters;
  updateFilters: (newFilters: Partial<EmotionFilters>) => void;
  addEmotionLog: (data: { emotion: Emotion; optionalNote?: string }) => Promise<EmotionLog | null>;
  isAddingLog: boolean;
  refetchLogs: () => Promise<void>;
}

/**
 * Hook for managing emotion data
 * Provides functions for fetching, filtering, and adding emotion logs
 */
export function useEmotionData(initialFilters: EmotionFilters = { timeframe: 'day' }): EmotionDataResult {
  const { user } = useAuthContext();
  const [logs, setLogs] = useState<EmotionLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAddingLog, setIsAddingLog] = useState<boolean>(false);
  const [filters, setFilters] = useState<EmotionFilters>(initialFilters);

  // Ensure filters always reflect the current user if they are a child
  useEffect(() => {
    if (user && user.role === 'child') {
      setFilters(f => ({ ...f, userId: user.id }));
    }
  }, [user]);

  // Function to fetch logs based on current filters
  const fetchLogs = useCallback(async () => {
    if (!user) {
      setLogs([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedLogs = await EmotionDatabase.getLogs(filters, user);
      setLogs(fetchedLogs);
    } catch (err) {
      console.error('Error fetching emotion logs:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch emotion logs'));
    } finally {
      setIsLoading(false);
    }
  }, [filters, user]);

  // Fetch logs when filters or user changes
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Function to update filters
  const updateFilters = useCallback((newFilters: Partial<EmotionFilters>) => {
    setFilters(prevFilters => {
      const updated = { ...prevFilters, ...newFilters };
      // Ensure child cannot override their userId filter
      if (user?.role === 'child') {
        updated.userId = user.id;
      }
      return updated;
    });
  }, [user]);

  // Function to add a new emotion log
  const addEmotionLog = useCallback(async (
    data: { emotion: Emotion; optionalNote?: string }
  ): Promise<EmotionLog | null> => {
    if (!user) return null;

    setIsAddingLog(true);
    try {
      const newLog = await EmotionDatabase.addLog(data, user);
      if (newLog) {
        // Refetch logs to include the new one
        await fetchLogs();
      }
      return newLog;
    } catch (err) {
      console.error('Error adding emotion log:', err);
      setError(err instanceof Error ? err : new Error('Failed to add emotion log'));
      return null;
    } finally {
      setIsAddingLog(false);
    }
  }, [user, fetchLogs]);

  return {
    logs,
    isLoading,
    error,
    filters,
    updateFilters,
    addEmotionLog,
    isAddingLog,
    refetchLogs: fetchLogs
  };
}
