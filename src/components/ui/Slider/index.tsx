import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  className
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('relative w-full h-6 flex items-center', className)}>
      <div className="absolute w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
        <motion.div
          className="absolute h-full bg-purple-500 rounded-full"
          style={{ width: `${percentage}%` }}
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className={cn(
          'absolute w-full h-2 opacity-0 cursor-pointer',
          disabled && 'cursor-not-allowed'
        )}
      />
      <motion.div
        className={cn(
          'absolute w-4 h-4 bg-white border-2 border-purple-500 rounded-full',
          'shadow-lg transform -translate-x-1/2',
          disabled && 'opacity-50'
        )}
        style={{ left: `${percentage}%` }}
        initial={false}
        animate={{ x: '-50%', left: `${percentage}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    </div>
  );
};