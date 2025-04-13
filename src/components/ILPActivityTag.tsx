import React from 'react';
import { Target } from 'lucide-react';
import { ActivityType, ILP } from '../types/ilp';
import { useILPActivityIntegration } from '../hooks/useILPActivityIntegration';

interface ILPActivityTagProps {
  activityType: ActivityType;
  activityId: string;
  skill?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * A component that displays a tag indicating that an activity
 * contributes to one or more active ILP goals
 */
const ILPActivityTag: React.FC<ILPActivityTagProps> = ({ 
  activityType, 
  activityId,
  skill,
  className = '',
  size = 'md'
}) => {
  const { relevantILPs, hasRelevantILPs } = useILPActivityIntegration({
    activityType,
    activityId,
    skill
  });

  // If no relevant ILPs, don't render anything
  if (!hasRelevantILPs) return null;
  
  // Get size classes based on the size prop
  const sizeClasses = {
    sm: 'text-xs p-2',
    md: 'text-sm p-3',
    lg: 'text-base p-4'
  }[size];
  
  // If there are multiple ILPs, show a count
  const showMultiple = relevantILPs.length > 1;

  return (
    <div className={`bg-green-100 text-green-800 rounded-lg ${sizeClasses} ${className}`}>
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4" />
        <span className="font-medium">
          {showMultiple 
            ? `Supports ${relevantILPs.length} learning plans`
            : 'Supports learning goal:'}
        </span>
      </div>
      
      {showMultiple ? (
        <ul className="mt-1 ml-6 space-y-1">
          {relevantILPs.map(ilp => (
            <li key={ilp.id} className="text-xs">
              {truncateText(ilp.goalDescription, 60)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 ml-6 text-xs">
          {truncateText(relevantILPs[0].goalDescription, 80)}
        </p>
      )}
    </div>
  );
};

// Helper function to truncate long text
function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

export default ILPActivityTag; 