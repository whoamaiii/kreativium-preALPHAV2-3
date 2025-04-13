import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3'
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className,
  showValue = false,
  size = 'md'
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="relative">
      <div
        className={cn(
          "w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700",
          sizes[size],
          className
        )}
      >
        <motion.div
          className="bg-purple-500 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      {showValue && (
        <div className="absolute right-0 -top-6 text-sm text-gray-600 dark:text-gray-400">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};