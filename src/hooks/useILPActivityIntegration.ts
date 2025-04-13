import { useState, useEffect } from 'react';
import { useIlps } from '../context/ILPContext';
import { ActivityType, ILP } from '../types/ilp';

interface UseILPActivityIntegrationProps {
  activityType: ActivityType;
  activityId: string;
  skill?: string;
}

interface UseILPActivityIntegrationResult {
  relevantILPs: ILP[];
  recordActivityCompletion: (score: number, isCompleted: boolean) => Promise<void>;
  hasRelevantILPs: boolean;
  isILPModeActive: boolean;
}

/**
 * Hook for integrating ILP functionality into activity components
 * 
 * This hook provides:
 * 1. Relevant ILPs for the current activity based on type and skill
 * 2. Function to record activity completion for progress tracking
 * 3. Indicator if ILP mode is active
 */
export function useILPActivityIntegration({
  activityType,
  activityId,
  skill
}: UseILPActivityIntegrationProps): UseILPActivityIntegrationResult {
  const { 
    getRelevantILPsForActivity, 
    recordProgress, 
    ilpModeActive 
  } = useIlps();
  
  const [relevantILPs, setRelevantILPs] = useState<ILP[]>([]);
  
  // Find ILPs that are relevant to this activity
  useEffect(() => {
    const ilps = getRelevantILPsForActivity(activityType, skill);
    setRelevantILPs(ilps);
  }, [activityType, skill, getRelevantILPsForActivity]);
  
  // Function to record progress when activity is completed
  const recordActivityCompletion = async (score: number, isCompleted: boolean) => {
    if (relevantILPs.length === 0) return;
    
    // Record progress for each relevant ILP
    const progressPromises = relevantILPs.map(ilp => 
      recordProgress({
        ilpId: ilp.id,
        activityId,
        activityType,
        score,
        completionStatus: isCompleted
      })
    );
    
    try {
      await Promise.all(progressPromises);
      console.log(`Progress recorded for ${progressPromises.length} ILPs`);
    } catch (error) {
      console.error('Error recording ILP progress:', error);
    }
  };
  
  return {
    relevantILPs,
    recordActivityCompletion,
    hasRelevantILPs: relevantILPs.length > 0,
    isILPModeActive: ilpModeActive
  };
} 