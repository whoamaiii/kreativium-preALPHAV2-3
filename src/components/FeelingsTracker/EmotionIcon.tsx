import React from 'react';
import { Emotion, EMOTION_ICONS, EMOTION_COLORS } from '../../types/emotion';

interface EmotionIconProps {
  emotion: Emotion;
  size?: number;
  onClick?: () => void;
  isSelected?: boolean;
  showLabel?: boolean;
  labelPosition?: 'top' | 'bottom';
}

/**
 * EmotionIcon component
 * Displays an emoji representation of an emotion with optional label and selection state
 */
export const EmotionIcon: React.FC<EmotionIconProps> = ({
  emotion,
  size = 48,
  onClick,
  isSelected = false,
  showLabel = false,
  labelPosition = 'bottom'
}) => {
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      onClick();
    }
  };

  return (
    <div
      className={`
        inline-flex 
        ${labelPosition === 'bottom' ? 'flex-col' : 'flex-col-reverse'}
        items-center justify-center 
        w-[${size}px] h-[${size}px]
        cursor-${onClick ? 'pointer' : 'default'}
        ${isSelected ? `ring-4 ring-offset-2 ring-offset-zinc-800 ring-${getColorClass(emotion)}` : ''}
        rounded-full 
        transition-all duration-300 ease-in-out
        transform hover:scale-110 active:scale-95
        ${isSelected ? `bg-${getColorClass(emotion)}/20` : 'bg-transparent'}
      `}
      onClick={onClick}
      onKeyPress={handleKeyPress}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${emotion} emotion`}
      aria-pressed={isSelected}
      title={emotion}
      data-testid={`emotion-icon-${emotion}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        padding: `${size * 0.1}px`,
        // We'll use style for the custom color and size properties
        borderColor: isSelected ? EMOTION_COLORS[emotion] : 'transparent',
        boxShadow: isSelected ? `0 0 10px ${EMOTION_COLORS[emotion]}50` : 'none'
      }}
    >
      <span 
        className="leading-none text-4xl select-none"
        style={{ fontSize: `${size * 0.6}px` }}
      >
        {EMOTION_ICONS[emotion]}
      </span>
      
      {showLabel && (
        <span 
          className="capitalize mt-2 text-zinc-200 font-medium"
          style={{ fontSize: `${size * 0.25}px` }}
        >
          {emotion}
        </span>
      )}
    </div>
  );
};

// Helper function to get Tailwind color class from emotion
function getColorClass(emotion: Emotion): string {
  switch(emotion) {
    case 'happy': return 'green-500';
    case 'sad': return 'blue-500';
    case 'anxious': return 'yellow-500';
    case 'angry': return 'red-500';
    case 'calm': return 'cyan-500';
    case 'excited': return 'orange-500';
    case 'tired': return 'gray-500';
    case 'frustrated': return 'purple-500';
    default: return 'white';
  }
}
