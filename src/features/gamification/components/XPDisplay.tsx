import React from 'react';
import { motion } from 'framer-motion';
import { UserXP } from '../types';
import { cn } from '../../../utils/cn';

interface XPDisplayProps {
  userXP: UserXP;
  showLevel?: boolean;
  showProgress?: boolean;
  className?: string;
  onXPAnimationComplete?: () => void;
}

export const XPDisplay: React.FC<XPDisplayProps> = ({
  userXP,
  showLevel = true,
  showProgress = true,
  className,
  onXPAnimationComplete,
}) => {
  const { total, level, currentLevelXp, nextLevelXp } = userXP;
  const progressPercentage = Math.min(
    100,
    Math.round((currentLevelXp / nextLevelXp) * 100)
  );

  return (
    <div className={cn('flex flex-col', className)}>
      {showLevel && (
        <div className="flex items-center mb-1">
          <div className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2">
            {level}
          </div>
          <span className="text-sm font-medium">Level {level}</span>
        </div>
      )}
      
      {showProgress && (
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onAnimationComplete={onXPAnimationComplete}
          />
        </div>
      )}
      
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-600">
          {currentLevelXp} / {nextLevelXp} XP
        </span>
        <span className="text-xs font-medium text-gray-800">
          Total: {total} XP
        </span>
      </div>
    </div>
  );
};

export default XPDisplay; 