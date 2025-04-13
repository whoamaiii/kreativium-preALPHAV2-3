import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  animate = false
}) => {
  const Component = animate ? motion.div : 'div';

  return (
    <Component
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden',
        onClick && 'cursor-pointer hover:shadow-xl transition-shadow',
        className
      )}
      onClick={onClick}
      {...(animate && {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        transition: { duration: 0.2 }
      })}
    >
      {children}
    </Component>
  );
};