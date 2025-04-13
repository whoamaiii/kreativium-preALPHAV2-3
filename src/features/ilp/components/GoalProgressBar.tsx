import React from 'react';
import { cn } from '../../../utils/cn';

interface GoalProgressBarProps {
  progressPercent: number; // Value from 0 to 100
  showPercentage?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: 'default' | 'success' | 'warning' | 'danger';
}

const GoalProgressBar: React.FC<GoalProgressBarProps> = ({
  progressPercent,
  showPercentage = true,
  className = '',
  size = 'md',
  colorScheme = 'default',
}) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progressPercent));
  
  // Calculate color based on progress and color scheme
  let colorClass = 'bg-blue-600';
  if (colorScheme === 'default') {
    if (clampedProgress < 30) colorClass = 'bg-red-500';
    else if (clampedProgress < 70) colorClass = 'bg-yellow-500';
    else colorClass = 'bg-green-500';
  } else if (colorScheme === 'success') {
    colorClass = 'bg-green-500';
  } else if (colorScheme === 'warning') {
    colorClass = 'bg-yellow-500';
  } else if (colorScheme === 'danger') {
    colorClass = 'bg-red-500';
  }
  
  // Determine height based on size
  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[size];
  
  // Generate aria label describing progress
  const ariaLabel = `Progress: ${clampedProgress}%`;
  
  return (
    <div className={cn("w-full", className)}>
      <div className={cn("flex items-center", showPercentage && "mb-1")}>
        {showPercentage && (
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium ml-auto">
            {Math.round(clampedProgress)}%
          </span>
        )}
      </div>
      <div 
        className={cn("w-full bg-gray-200 rounded-full dark:bg-gray-700", heightClass)}
        role="progressbar" 
        aria-valuenow={clampedProgress} 
        aria-valuemin={0} 
        aria-valuemax={100}
        aria-label={ariaLabel}
      >
        <div
          className={cn("rounded-full transition-all duration-300 ease-in-out", colorClass, heightClass)}
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default GoalProgressBar; 