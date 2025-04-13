import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

interface ToggleProps {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  disabled?: boolean;
  'aria-label'?: string;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  pressed,
  onPressedChange,
  disabled,
  'aria-label': ariaLabel,
  className
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={pressed}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onPressedChange(!pressed)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        pressed ? 'bg-purple-500' : 'bg-gray-200 dark:bg-gray-700',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <motion.span
        initial={false}
        animate={{
          x: pressed ? 20 : 2,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg"
      />
    </button>
  );
};