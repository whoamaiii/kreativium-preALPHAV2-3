import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { LoadingProps } from '../../types/components';

/**
 * Accessible loading spinner component
 * 
 * @example
 * <LoadingSpinner size="md" />
 * <LoadingSpinner size="lg" color="#4f46e5" fullPage />
 */
export const LoadingSpinner: React.FC<LoadingProps & { fullPage?: boolean }> = ({
  size = 'md',
  color = 'currentColor',
  className = '',
  fullPage = false,
  ariaLabel = 'Loading content, please wait'
}) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const spinner = (
    <div 
      className={cn(
        'relative flex items-center justify-center',
        fullPage ? 'h-full w-full min-h-[200px]' : '',
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <motion.div
        className={cn(
          'rounded-full',
          sizeMap[size],
          'border-t-transparent'
        )}
        style={{ 
          borderColor: `transparent transparent transparent ${color}`,
          borderRightColor: color
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}; 