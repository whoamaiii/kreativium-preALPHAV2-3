import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../types';
import { cn } from '../../../utils/cn';

interface BadgesListProps {
  badges: Badge[];
  className?: string;
  animateEntrance?: boolean;
}

export const BadgesList: React.FC<BadgesListProps> = ({
  badges,
  className,
  animateEntrance = true,
}) => {
  if (!badges || badges.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <p className="text-gray-500">No badges earned yet</p>
        <p className="text-gray-400 text-sm mt-2">Complete activities to earn badges!</p>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4', className)}>
      {badges.map((badge, index) => (
        <motion.div
          key={badge.id}
          className="flex flex-col items-center bg-white rounded-lg shadow-sm p-4 border border-gray-100"
          initial={animateEntrance ? { opacity: 0, y: 20 } : undefined}
          animate={animateEntrance ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <div className="w-16 h-16 mb-2 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {badge.imageUrl ? (
              <img
                src={badge.imageUrl}
                alt={badge.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-2xl text-gray-400">🏆</div>
            )}
          </div>
          
          <h3 className="text-sm font-semibold text-center">{badge.name}</h3>
          
          <p className="text-xs text-gray-500 text-center mt-1">
            {badge.description}
          </p>
          
          {badge.dateEarned && (
            <span className="text-xs text-gray-400 mt-2">
              Earned: {new Date(badge.dateEarned).toLocaleDateString()}
            </span>
          )}
          
          <div className="mt-2 text-xs py-1 px-2 rounded-full bg-gray-100 text-gray-600">
            {badge.type === 'skill' ? 'Skill' : badge.type === 'achievement' ? 'Achievement' : 'Milestone'}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default BadgesList; 