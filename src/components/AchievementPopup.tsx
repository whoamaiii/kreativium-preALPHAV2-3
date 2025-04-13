import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';

interface AchievementPopupProps {
  achievement: {
    type: string;
    description: string;
  } | null;
}

export const AchievementPopup: React.FC<AchievementPopupProps> = ({ achievement }) => {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center gap-3"
        >
          <Award className="w-6 h-6 text-yellow-500" />
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Achievement Unlocked!</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};