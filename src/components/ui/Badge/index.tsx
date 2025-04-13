import React from 'react';
import { cn } from '../../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variants = {
  default: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  outline: 'border border-purple-200 text-purple-800 dark:border-purple-700 dark:text-purple-300',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-base',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};