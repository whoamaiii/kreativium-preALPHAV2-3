import React from 'react';
import { Emotion, StressZone, EMOTION_TO_ZONE, ZONE_COLORS, ZONE_DESCRIPTIONS } from '../types/emotion';

interface StressZoneIndicatorProps {
  emotion?: Emotion;
  showDescription?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StressZoneIndicator: React.FC<StressZoneIndicatorProps> = ({
  emotion,
  showDescription = true,
  size = 'md',
  className = ''
}) => {
  // Default to green zone if no emotion provided
  const zone: StressZone = emotion ? EMOTION_TO_ZONE[emotion] : 'green';
  const zoneColor = ZONE_COLORS[zone];
  const description = ZONE_DESCRIPTIONS[zone];
  
  // Size mappings
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };
  
  // Name mapping for display
  const zoneNames = {
    green: 'Green Zone',
    yellow: 'Yellow Zone',
    red: 'Red Zone'
  };

  return (
    <div className={`${className}`}>
      {/* Zone bars visualization */}
      <div className="flex gap-1 mb-1">
        <div className={`w-full rounded-full ${sizeClasses[size]} bg-gray-200`}>
          <div 
            className={`rounded-full ${sizeClasses[size]} transition-all duration-500`}
            style={{ 
              width: zone === 'green' ? '100%' : '0%',
              backgroundColor: ZONE_COLORS.green
            }}
          />
        </div>
        <div className={`w-full rounded-full ${sizeClasses[size]} bg-gray-200`}>
          <div 
            className={`rounded-full ${sizeClasses[size]} transition-all duration-500`}
            style={{ 
              width: zone === 'yellow' ? '100%' : '0%',
              backgroundColor: ZONE_COLORS.yellow
            }}
          />
        </div>
        <div className={`w-full rounded-full ${sizeClasses[size]} bg-gray-200`}>
          <div 
            className={`rounded-full ${sizeClasses[size]} transition-all duration-500`}
            style={{ 
              width: zone === 'red' ? '100%' : '0%',
              backgroundColor: ZONE_COLORS.red
            }}
          />
        </div>
      </div>
      
      {/* Current zone indicator */}
      <div className="flex items-center">
        <div 
          className="w-3 h-3 rounded-full mr-2"
          style={{ backgroundColor: zoneColor }}
        />
        <span className="text-sm font-medium" style={{ color: zoneColor }}>
          {zoneNames[zone]}
        </span>
      </div>
      
      {/* Description (optional) */}
      {showDescription && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      )}
    </div>
  );
};

// Alternative version that shows as a traffic light
export const StressZoneTrafficLight: React.FC<StressZoneIndicatorProps> = ({
  emotion,
  showDescription = true,
  size = 'md',
  className = ''
}) => {
  // Default to green zone if no emotion provided
  const zone: StressZone = emotion ? EMOTION_TO_ZONE[emotion] : 'green';
  const description = ZONE_DESCRIPTIONS[zone];
  
  // Size mappings
  const sizeClasses = {
    sm: 'w-8 h-20',
    md: 'w-10 h-24',
    lg: 'w-12 h-32'
  };
  
  const lightSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`${sizeClasses[size]} bg-gray-800 rounded-lg flex flex-col items-center justify-between py-1`}>
        {/* Red light */}
        <div 
          className={`${lightSizeClasses[size]} rounded-full transition-opacity duration-300`}
          style={{ 
            backgroundColor: ZONE_COLORS.red,
            opacity: zone === 'red' ? 1 : 0.3
          }}
        />
        
        {/* Yellow light */}
        <div 
          className={`${lightSizeClasses[size]} rounded-full transition-opacity duration-300`}
          style={{ 
            backgroundColor: ZONE_COLORS.yellow,
            opacity: zone === 'yellow' ? 1 : 0.3
          }}
        />
        
        {/* Green light */}
        <div 
          className={`${lightSizeClasses[size]} rounded-full transition-opacity duration-300`}
          style={{ 
            backgroundColor: ZONE_COLORS.green,
            opacity: zone === 'green' ? 1 : 0.3
          }}
        />
      </div>
      
      {/* Description (optional) */}
      {showDescription && (
        <div className="mt-2 text-center">
          <p className="text-sm font-medium" style={{ color: ZONE_COLORS[zone] }}>
            {zone.charAt(0).toUpperCase() + zone.slice(1)} Zone
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}; 