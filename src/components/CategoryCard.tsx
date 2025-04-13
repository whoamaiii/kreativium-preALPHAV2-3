import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Card } from './ui/Card';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isLocked?: boolean;
  unlockLevel?: number;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  icon,
  isLocked,
  unlockLevel,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={!isLocked ? { scale: 1.05 } : undefined}
      whileTap={!isLocked ? { scale: 0.95 } : undefined}
    >
      <Card
        onClick={!isLocked ? onClick : undefined}
        className={`
          relative p-6 overflow-hidden
          bg-gray-900/50 backdrop-blur-sm
          ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="relative">
          {icon}
          {isLocked && (
            <Lock className="absolute top-0 right-0 w-6 h-6 text-gray-400" />
          )}
        </div>
        
        <h3 className="text-xl font-bold text-white mt-4 mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
        
        {isLocked && unlockLevel && (
          <p className="text-sm text-red-400 mt-2">
            Unlocks at level {unlockLevel}
          </p>
        )}
      </Card>
    </motion.div>
  );
};