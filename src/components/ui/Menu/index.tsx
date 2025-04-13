import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

interface MenuProps {
  items: MenuItem[];
  className?: string;
}

export const Menu: React.FC<MenuProps> = ({ items, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'py-1 rounded-lg shadow-lg',
        'bg-white dark:bg-gray-800',
        className
      )}
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          disabled={item.disabled}
          className={cn(
            'w-full px-4 py-2 text-sm text-left',
            'flex items-center gap-2',
            'hover:bg-gray-100 dark:hover:bg-gray-700',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </motion.div>
  );
};