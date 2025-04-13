import React from 'react';
import { motion } from 'framer-motion';
import { RecommendedActivity } from '../types';
import RecommendedActivityCard from './RecommendedActivityCard';
import { cn } from '../../../utils/cn';

interface RecommendedActivitiesListProps {
  activities: RecommendedActivity[];
  isLoading?: boolean;
  error?: string | null;
  title?: string;
  className?: string;
  onRefresh?: () => void;
  goalId?: string;
  onActivityCompleted?: (goalId: string, activityId: string) => void;
  completedActivityIds?: string[];
}

export const RecommendedActivitiesList: React.FC<RecommendedActivitiesListProps> = ({
  activities,
  isLoading = false,
  error = null,
  title = "Recommended Activities",
  className,
  onRefresh,
  goalId,
  onActivityCompleted,
  completedActivityIds = []
}) => {
  // Filter out completed activities if specified
  const displayActivities = completedActivityIds.length > 0
    ? activities.filter(activity => !completedActivityIds.includes(activity.id))
    : activities;
  
  if (isLoading) {
    return (
      <div className={cn('p-4 rounded-lg bg-white shadow-sm', className)}>
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('p-4 rounded-lg bg-white shadow-sm', className)}>
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          <p className="flex items-center">
            <span className="mr-2">⚠️</span>
            Error loading recommended activities
          </p>
          <p className="text-sm mt-1">{error}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="mt-2 text-sm bg-white hover:bg-red-50 border border-red-300 px-3 py-1 rounded-md transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!displayActivities || displayActivities.length === 0) {
    const allActivitiesCompleted = activities.length > 0 && displayActivities.length === 0;
    
    return (
      <div className={cn('p-4 rounded-lg bg-white shadow-sm', className)}>
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-gray-500 text-center">
          {allActivitiesCompleted ? (
            <p>All activities for this goal have been completed! 🎉</p>
          ) : (
            <p>No activities recommended at this time.</p>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="mt-2 text-sm bg-white hover:bg-gray-100 border border-gray-300 px-3 py-1 rounded-md transition-colors"
            >
              Refresh
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('p-4 rounded-lg bg-white shadow-sm', className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {onRefresh && (
          <button 
            onClick={onRefresh}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Refresh
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <RecommendedActivityCard 
              activity={activity}
              goalId={goalId}
              onActivityCompleted={onActivityCompleted}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Show completed activities count if any */}
      {completedActivityIds.length > 0 && activities.length > 0 && (
        <p className="text-sm text-gray-500 mt-4 text-center">
          Completed {completedActivityIds.length} of {activities.length} activities
        </p>
      )}
    </div>
  );
};

export default RecommendedActivitiesList; 