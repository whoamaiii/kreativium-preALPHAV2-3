import { useState, useCallback } from 'react';
import { FeelingType, FeelingIntensity, FeelingEntry } from '../types';
import { createFeelingEntry } from '../services/feelingsDataService';
import { awardXP } from '../../gamification/services/userDataService';

// This hook assumes there's a way to get the current user's ID
// from an existing authentication system
const getCurrentUserId = (): string => {
  // This should be replaced with the proper implementation that gets the user ID
  // from your existing auth mechanism (e.g., context, localStorage, etc.)
  return localStorage.getItem('userId') || '';
};

interface UseFeelingsOptions {
  autoAwardXP?: boolean;
  xpAmount?: number;
}

interface UseFeelingsReturn {
  isLoading: boolean;
  error: string | null;
  logFeeling: (
    feeling: FeelingType,
    intensity: FeelingIntensity,
    notes?: string,
    context?: {
      activity?: string;
      location?: string;
      triggers?: string[];
    }
  ) => Promise<FeelingEntry | null>;
}

/**
 * Hook for logging and managing user feelings
 */
export const useFeelings = (options: UseFeelingsOptions = {}): UseFeelingsReturn => {
  const { autoAwardXP = true, xpAmount = 10 } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logFeeling = useCallback(
    async (
      feeling: FeelingType,
      intensity: FeelingIntensity,
      notes?: string,
      context?: {
        activity?: string;
        location?: string;
        triggers?: string[];
      }
    ): Promise<FeelingEntry | null> => {
      const userId = getCurrentUserId();
      if (!userId) {
        setError('User not authenticated');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Create a feeling entry
        const entry: Omit<FeelingEntry, 'id'> = {
          userId,
          type: feeling,
          intensity,
          notes,
          timestamp: new Date().toISOString(),
          activity: context?.activity,
          location: context?.location,
          triggers: context?.triggers,
        };

        const createdEntry = await createFeelingEntry(entry);

        // Award XP if enabled
        if (autoAwardXP) {
          try {
            await awardXP(userId, xpAmount, 'feelings_tracked', {
              feelingType: feeling,
              entryId: createdEntry.id,
            });
          } catch (xpError) {
            console.error('Error awarding XP for feeling tracking:', xpError);
            // Don't fail the overall operation if XP awarding fails
          }
        }

        return createdEntry;
      } catch (err) {
        console.error('Error logging feeling:', err);
        setError(err instanceof Error ? err.message : 'Failed to log feeling');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [autoAwardXP, xpAmount]
  );

  return {
    isLoading,
    error,
    logFeeling,
  };
};

export default useFeelings; 