import { useState, useEffect, useCallback } from 'react';
import { UserXP, XPEventType } from '../types';
import { getUserXP, awardXP } from '../services/userDataService';

// This hook assumes there's a way to get the current user's ID
// from an existing authentication system
const getCurrentUserId = (): string => {
  // This should be replaced with the proper implementation that gets the user ID
  // from your existing auth mechanism (e.g., context, localStorage, etc.)
  return localStorage.getItem('userId') || '';
};

interface UseUserXPOptions {
  autoFetch?: boolean;
}

interface UseUserXPReturn {
  userXP: UserXP | null;
  isLoading: boolean;
  error: string | null;
  fetchUserXP: () => Promise<void>;
  awardUserXP: (amount: number, eventType: XPEventType, metadata?: Record<string, unknown>) => Promise<void>;
}

/**
 * Hook for managing user XP and levels
 */
export const useUserXP = (options: UseUserXPOptions = {}): UseUserXPReturn => {
  const { autoFetch = true } = options;
  const [userXP, setUserXP] = useState<UserXP | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserXP = useCallback(async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getUserXP(userId);
      setUserXP(data);
    } catch (err) {
      console.error('Error fetching user XP:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user XP data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const awardUserXP = useCallback(async (
    amount: number,
    eventType: XPEventType,
    metadata?: Record<string, unknown>
  ) => {
    const userId = getCurrentUserId();
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await awardXP(userId, amount, eventType, metadata);
      
      // Update the local state with the new XP/level
      if (userXP) {
        setUserXP({
          ...userXP,
          total: result.updatedXp,
          level: result.updatedLevel,
          // currentLevelXp and nextLevelXp would need to be calculated or returned by the API
        });
      } else {
        // If we don't have the user's XP data yet, fetch it
        await fetchUserXP();
      }
    } catch (err) {
      console.error('Error awarding XP:', err);
      setError(err instanceof Error ? err.message : 'Failed to award XP');
    } finally {
      setIsLoading(false);
    }
  }, [userXP, fetchUserXP]);

  useEffect(() => {
    if (autoFetch) {
      fetchUserXP();
    }
  }, [autoFetch, fetchUserXP]);

  return {
    userXP,
    isLoading,
    error,
    fetchUserXP,
    awardUserXP,
  };
};

export default useUserXP; 