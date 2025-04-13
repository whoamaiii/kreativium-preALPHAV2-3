import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showValue?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className,
  showValue = false,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="relative">
      <div
        className={cn(
          'h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700',
          className
        )}
      >
        <motion.div
          className="h-full bg-purple-500"
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