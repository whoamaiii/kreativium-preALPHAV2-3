import React, { memo, useId } from 'react';
import { cn } from '../utils/cn';

interface AnimatedBackgroundProps {
  className?: string;
  bubbleCount?: number;
  variant?: 'default' | 'subtle' | 'colorful';
}

/**
 * Optimized animated background component that uses CSS animations for better performance
 * and will-change hint for better rendering
 */
export const AnimatedBackground = memo(({ 
  className, 
  bubbleCount = 15,
  variant = 'default'
}: AnimatedBackgroundProps) => {
  const uniqueId = useId().replace(/:/g, '');
  
  // Generate random bubble configurations
  const bubbles = Array.from({ length: bubbleCount }, (_, i) => ({
    id: i,
    size: Math.floor(Math.random() * 140) + 40,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 10 + 15,
    moveX: (Math.random() > 0.5 ? '-' : '') + (Math.floor(Math.random() * 20) + 10),
    moveY: (Math.random() > 0.5 ? '-' : '') + (Math.floor(Math.random() * 20) + 10),
    scale: Math.random() * 0.2 + 0.9,
    opacity: Math.random() * 0.3 + 0.3
  }));

  // Variant styles
  const getVariantColors = () => {
    switch (variant) {
      case 'subtle':
        return 'from-gray-100 to-gray-200 dark:from-gray-900/30 dark:to-gray-800/40';
      case 'colorful':
        return 'from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-900/30 dark:via-purple-900/30 dark:to-indigo-900/30';
      default:
        return 'from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30';
    }
  };

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden -z-10 opacity-60',
        className
      )}
      aria-hidden="true"
    >
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br',
        getVariantColors()
      )} />
      
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute rounded-full opacity-40 mix-blend-multiply dark:mix-blend-screen transform-gpu"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            background: variant === 'colorful' 
              ? `hsl(${(bubble.id * 40) % 360}, 70%, 80%)`
              : 'currentColor',
            willChange: 'transform',
            animation: `float-${uniqueId}-${bubble.id} ${bubble.duration}s ease-in-out ${bubble.delay}s infinite alternate`,
            '--move-x': `${bubble.moveX}px`,
            '--move-y': `${bubble.moveY}px`,
            '--scale': bubble.scale,
            '--opacity': bubble.opacity,
          } as React.CSSProperties}
        />
      ))}

      {/* Add CSS animation keyframes for each bubble */}
      <style>
        {`
          ${bubbles.map(bubble => `
            @keyframes float-${uniqueId}-${bubble.id} {
              0% {
                transform: translate(0, 0) scale(1);
                opacity: 0.3;
              }
              100% {
                transform: translate(${bubble.moveX}px, ${bubble.moveY}px) scale(${bubble.scale});
                opacity: ${bubble.opacity};
              }
            }
          `).join('')}
        `}
      </style>
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';