import { useState, useEffect } from 'react';
import { Skill, ActivityType, RecommendedActivity, ILPGoal } from '../types';
import { 
  fetchRecommendedActivities, 
  generateRecommendedActivities,
  fetchActivitiesForGoal
} from '../services/activityRecommendationService';

interface UseRecommendedActivitiesOptions {
  useFallback?: boolean; // Whether to use client-side fallback if API fails
  limit?: number; // Maximum number of recommendations to fetch
}

interface UseRecommendedActivitiesReturn {
  activities: RecommendedActivity[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook for fetching recommended activities based on skills
 */
export const useRecommendedActivities = (
  skills: Skill[],
  activityTypes?: ActivityType[],
  options: UseRecommendedActivitiesOptions = {}
): UseRecommendedActivitiesReturn => {
  const { useFallback = true, limit = 10 } = options;
  const [activities, setActivities] = useState<RecommendedActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshFlag, setRefreshFlag] = useState<number>(0);

  useEffect(() => {
    // Skip if no skills provided
    if (!skills || skills.length === 0) {
      setActivities([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Try to fetch from API first
        const data = await fetchRecommendedActivities(skills, activityTypes, limit);
        setActivities(data);
      } catch (err) {
        console.error('Error fetching recommended activities:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');

        // Use client-side fallback if enabled
        if (useFallback) {
          const fallbackData = generateRecommendedActivities(skills, activityTypes, limit);
          setActivities(fallbackData);
          setError(null); // Clear error since we have fallback data
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [skills, activityTypes, limit, useFallback, refreshFlag]);

  // Function to manually refresh recommendations
  const refresh = () => {
    setRefreshFlag(prev => prev + 1);
  };

  return {
    activities,
    isLoading,
    error,
    refresh
  };
};

/**
 * Hook for fetching recommended activities for a specific goal
 */
export const useGoalActivities = (
  goal: ILPGoal | null,
  options: UseRecommendedActivitiesOptions = {}
): UseRecommendedActivitiesReturn => {
  const { useFallback = true, limit = 5 } = options;
  const [activities, setActivities] = useState<RecommendedActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshFlag, setRefreshFlag] = useState<number>(0);

  useEffect(() => {
    // Skip if no goal provided
    if (!goal) {
      setActivities([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Try to fetch from API first using goal ID
        const data = await fetchActivitiesForGoal(goal.id, limit);
        setActivities(data);
      } catch (err) {
        console.error('Error fetching goal activities:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch activities for goal');

        // Use client-side fallback if enabled - generate based on goal's skill
        if (useFallback) {
          const fallbackData = generateRecommendedActivities(
            [goal.skill], 
            goal.preferredActivityTypes, 
            limit
          );
          setActivities(fallbackData);
          setError(null); // Clear error since we have fallback data
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [goal, limit, useFallback, refreshFlag]);

  // Function to manually refresh recommendations
  const refresh = () => {
    setRefreshFlag(prev => prev + 1);
  };

  return {
    activities,
    isLoading,
    error,
    refresh
  };
};

export default useRecommendedActivities; 