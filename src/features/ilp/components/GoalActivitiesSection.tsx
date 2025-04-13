import React, { useState } from 'react';
import { ILPGoal, ActivityType } from '../types';
import { RecommendedActivitiesList } from './RecommendedActivitiesList';
import GoalProgressBar from './GoalProgressBar';
import { recordActivityCompletionForGoal } from '../services/ilpDataService';
import { Button } from '../../../components/ui/Button';
import { RefreshCw } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface GoalActivitiesSectionProps {
  goal: ILPGoal;
  onGoalUpdated?: (updatedGoal: ILPGoal) => void;
  className?: string;
}

const GoalActivitiesSection: React.FC<GoalActivitiesSectionProps> = ({ 
  goal, 
  onGoalUpdated,
  className = ''
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Count of completed activities
  const completedCount = goal.completedActivities?.length || 0;
  const totalCount = goal.recommendedActivityIds?.length || 0;
  
  // Function to handle activity completion
  const handleActivityCompletion = async (activityId: string, activityType: ActivityType, score?: number) => {
    setError(null);
    
    try {
      // Record the activity completion
      const updatedGoal = await recordActivityCompletionForGoal(goal.id, {
        activityId,
        activityType,
        score
      });
      
      // Call the onGoalUpdated callback with the updated goal
      if (onGoalUpdated) {
        onGoalUpdated(updatedGoal);
      }
    } catch (err) {
      console.error('Error completing activity:', err);
      setError('Failed to record activity completion. Please try again.');
    }
  };
  
  // Function to refresh recommended activities
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      // Here you would typically call an API to refresh recommendations
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Notify parent that we need fresh data
      if (onGoalUpdated) {
        // This would normally be an API call to refresh recommendations
        onGoalUpdated({...goal});
      }
    } catch (err) {
      console.error('Error refreshing activities:', err);
      setError('Failed to refresh activities. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Display message if all activities are completed
  if (totalCount > 0 && completedCount === totalCount) {
    return (
      <div className={cn("mt-4 p-4 bg-green-50 text-green-800 rounded-lg", className)}>
        <p className="font-medium">
          All activities for this goal have been completed! 🎉
        </p>
      </div>
    );
  }
  
  return (
    <div className={cn("mt-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-medium">Activities for this goal</h4>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}
      
      {completedCount > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">
            Completed {completedCount} of {totalCount} activities
          </p>
          <GoalProgressBar 
            progressPercent={totalCount > 0 ? (completedCount / totalCount) * 100 : 0}
            showPercentage={false}
            size="sm"
          />
        </div>
      )}
      
      {goal.recommendedActivityIds && goal.recommendedActivityIds.length > 0 ? (
        <RecommendedActivitiesList 
          activities={goal.recommendedActivityIds.map(id => ({ id }))}
          completedActivityIds={goal.completedActivities || []}
          goalId={goal.id}
          onActivityCompleted={(goalId, activityId) => {
            // Adapter function to match the expected interface
            handleActivityCompletion(activityId, 'quiz');
          }}
        />
      ) : (
        <p className="text-gray-500 italic">
          No activities recommended at this time.
        </p>
      )}
    </div>
  );
};

export default GoalActivitiesSection; 