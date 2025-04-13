import React from 'react';
import { Tag, Target } from 'lucide-react';
import { Badge } from '../ui/Badge';
import useIlpsWithEnhancedFunctionality from '../../hooks/useIlps';
import { ILP, ActivityType } from '../../types/ilp';
import { Tooltip } from '../ui/Tooltip';

interface ILPActivityTagProps {
  activityType: ActivityType;
  activityId: string;
  categoryId?: string;
  className?: string;
}

/**
 * Component that shows which ILPs are relevant for the current activity
 */
export const ILPActivityTag: React.FC<ILPActivityTagProps> = ({
  activityType,
  activityId,
  categoryId,
  className = '',
}) => {
  const { getRelevantILPsForActivity } = useIlpsWithEnhancedFunctionality();
  
  // Get relevant ILPs based on activity type and category
  const relevantILPs = getRelevantILPsForActivity(activityType, categoryId);
  
  if (relevantILPs.length === 0) {
    return null;
  }
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {relevantILPs.length > 0 ? (
        <Tooltip
          content={
            <div className="max-w-xs">
              <p className="font-medium mb-2">Connected to Learning Plans:</p>
              <ul className="space-y-1 text-sm">
                {relevantILPs.map((ilp: ILP) => (
                  <li key={ilp.id} className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2" />
                    <span>{ilp.goalDescription}</span>
                  </li>
                ))}
              </ul>
            </div>
          }
        >
          <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 cursor-help">
            <Target className="w-3.5 h-3.5 mr-1" />
            <span>
              {relevantILPs.length === 1
                ? '1 ILP'
                : `${relevantILPs.length} ILPs`}
            </span>
          </Badge>
        </Tooltip>
      ) : null}
    </div>
  );
}; 