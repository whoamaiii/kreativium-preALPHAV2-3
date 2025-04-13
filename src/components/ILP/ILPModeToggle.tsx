import React from 'react';
import useIlpsWithEnhancedFunctionality from '../../hooks/useIlps';
import { Switch } from '../ui/Switch';
import { Target } from 'lucide-react';

interface ILPModeToggleProps {
  className?: string;
  showLabel?: boolean;
}

/**
 * Toggle component for enabling/disabling ILP mode
 * When enabled, only activities relevant to active ILPs will be shown
 */
export const ILPModeToggle: React.FC<ILPModeToggleProps> = ({
  className = '',
  showLabel = false,
}) => {
  const { ilpModeActive, toggleILPMode } = useIlpsWithEnhancedFunctionality();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Switch
        checked={ilpModeActive}
        onCheckedChange={toggleILPMode}
        aria-label="Toggle ILP mode"
        className={`${ilpModeActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
      />
      
      {showLabel && (
        <div className="flex items-center text-sm">
          <Target
            className={`w-4 h-4 mr-1.5 ${
              ilpModeActive ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'
            }`}
          />
          <span className={ilpModeActive ? 'font-medium' : ''}>
            {ilpModeActive
              ? 'ILP Mode: Active'
              : 'ILP Mode: Inactive'}
          </span>
          {ilpModeActive && (
            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
              (Filtering by learning plans)
            </span>
          )}
        </div>
      )}
    </div>
  );
}; 