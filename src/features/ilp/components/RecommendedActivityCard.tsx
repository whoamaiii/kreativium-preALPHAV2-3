import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RecommendedActivity } from '../types';
import { cn } from '../../../utils/cn';
import { recordActivityCompletionForGoal } from '../services/ilpDataService';

// Maps activity types to background colors
const activityTypeColors: Record<string, string> = {
  quiz: 'bg-blue-50 border-blue-200',
  memory: 'bg-purple-50 border-purple-200',
  exercise: 'bg-green-50 border-green-200',
  reading: 'bg-amber-50 border-amber-200',
  game: 'bg-pink-50 border-pink-200'
};

// Maps activity types to icons (using emoji as placeholder)
const activityTypeIcons: Record<string, string> = {
  quiz: '❓',
  memory: '🎴',
  exercise: '🏃',
  reading: '📚',
  game: '🎮'
};

interface RecommendedActivityCardProps {
  activity: RecommendedActivity;
  goalId?: string;
  onActivityCompleted?: (goalId: string, activityId: string) => void;
  className?: string;
}

export const RecommendedActivityCard: React.FC<RecommendedActivityCardProps> = ({
  activity,
  goalId,
  onActivityCompleted,
  className
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const typeColor = activityTypeColors[activity.type] || 'bg-gray-50 border-gray-200';
  const typeIcon = activityTypeIcons[activity.type] || '📋';

  // Record activity completion
  const handleActivityCompletion = async (e: React.MouseEvent) => {
    // If there's no goalId or callback, just navigate to the activity
    if (!goalId || !onActivityCompleted) return;
    
    e.preventDefault(); // Prevent default link action
    setIsRecording(true);
    
    try {
      // Call API to record completion
      await recordActivityCompletionForGoal(goalId, activity.id);
      // Call parent callback to update UI
      onActivityCompleted(goalId, activity.id);
    } catch (err) {
      console.error('Error recording activity completion:', err);
      // Ideally show an error message to the user
    } finally {
      setIsRecording(false);
      // Now navigate programmatically
      window.location.href = activity.url;
    }
  };
  
  return (
    <motion.div
      className={cn(
        'border rounded-lg overflow-hidden shadow-sm transition-all',
        typeColor,
        className
      )}
      whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {activity.imageUrl ? (
          <img 
            src={activity.imageUrl} 
            alt={activity.title} 
            className="w-full h-32 object-cover"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-3xl">
            {typeIcon}
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium uppercase">
          {activity.type}
        </div>
        <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs">
          {activity.difficulty}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-lg mb-1">{activity.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
        
        <div className="mb-3">
          <div className="text-xs font-medium uppercase text-gray-500 mb-1">Skills:</div>
          <div className="flex flex-wrap gap-1">
            {activity.skillsAddressed.map(skill => (
              <span
                key={skill}
                className="text-xs bg-gray-100 rounded-full px-2 py-1"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <Link
          to={activity.url}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
          onClick={goalId && onActivityCompleted ? handleActivityCompletion : undefined}
        >
          {isRecording ? 'Recording...' : 'Start Activity'}
        </Link>
      </div>
    </motion.div>
  );
};

export default RecommendedActivityCard; 