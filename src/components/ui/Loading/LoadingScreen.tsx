import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

interface LoadingScreenProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4'
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  size = 'lg',
  className
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
      <motion.div
        className={cn(
          'rounded-full border-purple-500 border-t-transparent',
          sizes[size],
          className
        )}
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