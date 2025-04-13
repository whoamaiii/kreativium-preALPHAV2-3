import React from 'react';
import { motion } from 'framer-motion';
import { LoadingProps } from '../../types/components';
import { cn } from '../../utils/cn';

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
};

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  color = 'currentColor',
  className
}) => {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <motion.div
        className={cn(
          'border-2 rounded-full',
          sizes[size],
          'border-t-transparent'
        )}
        style={{ borderColor: `${color} transparent transparent transparent` }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
};

export const LoadingScreen: React.FC<LoadingProps> = (props) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <Loading {...props} />
    </div>
  );
};