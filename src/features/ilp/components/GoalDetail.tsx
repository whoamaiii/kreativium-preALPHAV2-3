import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ILPGoal, ActivityType } from '../types';
import GoalProgressBar from './GoalProgressBar';
import GoalActivitiesSection from './GoalActivitiesSection';
import { cn } from '../../../utils/cn';
import { updateGoalProgress } from '../services/ilpDataService';

interface GoalDetailProps {
  goal: ILPGoal;
  onGoalUpdated?: (updatedGoal: ILPGoal) => void;
  className?: string;
  showActivities?: boolean;
}

export const GoalDetail: React.FC<GoalDetailProps> = ({
  goal,
  onGoalUpdated,
  className,
  showActivities = true
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [progressInput, setProgressInput] = useState(goal.progress?.toString() || '');
  const [notes, setNotes] = useState(goal.assessmentNotes || '');
  
  // Format date to a more readable format
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'No date set';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get the status display
  const getStatusDisplay = () => {
    switch(goal.status) {
      case 'pending':
        return <span className="text-yellow-600 bg-yellow-100 px-2.5 py-0.5 rounded-full text-xs font-medium">Pending</span>;
      case 'in-progress':
        return <span className="text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded-full text-xs font-medium">In Progress</span>;
      case 'completed':
        return <span className="text-green-600 bg-green-100 px-2.5 py-0.5 rounded-full text-xs font-medium">Completed</span>;
      default:
        return <span className="text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full text-xs font-medium">{goal.status}</span>;
    }
  };
  
  // Activity type display
  const getActivityTypeDisplay = (type: ActivityType) => {
    const colors: Record<ActivityType, string> = {
      quiz: 'bg-blue-100 text-blue-800',
      memory: 'bg-purple-100 text-purple-800',
      exercise: 'bg-green-100 text-green-800',
      reading: 'bg-amber-100 text-amber-800',
      game: 'bg-pink-100 text-pink-800'
    };
    
    return (
      <span className={`${colors[type]} px-2 py-0.5 rounded-full text-xs font-medium`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };
  
  // Update goal progress and notes
  const handleUpdateProgress = async () => {
    if (!onGoalUpdated) return;
    
    setIsUpdating(true);
    
    try {
      const progress = parseInt(progressInput);
      if (isNaN(progress) || progress < 0 || progress > 100) {
        throw new Error('Progress must be a number between 0 and 100');
      }
      
      const updatedGoal = await updateGoalProgress(goal.id, {
        progress,
        assessmentNotes: notes
      });
      
      onGoalUpdated(updatedGoal);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating goal progress:', error);
      // Here you would ideally show an error toast or message
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className={cn('bg-white rounded-lg shadow-sm border p-4', className)}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{goal.description}</h3>
          <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-500">
            <span>Skill: <strong>{goal.skill.charAt(0).toUpperCase() + goal.skill.slice(1)}</strong></span>
            {goal.targetDate && (
              <span>Target date: <strong>{formatDate(goal.targetDate)}</strong></span>
            )}
            <div>{getStatusDisplay()}</div>
          </div>
        </div>
        
        <Link
          to={`/ilp/${goal.ilpId}/goals/${goal.id}/edit`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Edit Goal
        </Link>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-gray-700">Progress</h4>
          {!editMode && onGoalUpdated && (
            <button 
              onClick={() => setEditMode(true)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Update Progress
            </button>
          )}
        </div>
        
        {!editMode ? (
          <>
            <GoalProgressBar progressPercent={goal.progress || 0} />
            {goal.lastUpdated && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {formatDate(goal.lastUpdated)}
              </p>
            )}
            {goal.assessmentNotes && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
                <h5 className="font-medium text-gray-700 mb-1">Notes:</h5>
                <p className="text-gray-600">{goal.assessmentNotes}</p>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-3">
            <div>
              <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-1">
                Progress (%)
              </label>
              <input
                type="number"
                id="progress"
                min="0"
                max="100"
                value={progressInput}
                onChange={(e) => setProgressInput(e.target.value)}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Assessment Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateProgress}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Progress'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {goal.preferredActivityTypes && goal.preferredActivityTypes.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-700 mb-2">Preferred Activity Types</h4>
          <div className="flex flex-wrap gap-2">
            {goal.preferredActivityTypes.map(type => (
              <div key={type}>
                {getActivityTypeDisplay(type)}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {showActivities && (
        <GoalActivitiesSection goal={goal} />
      )}
    </div>
  );
};

export default GoalDetail; 