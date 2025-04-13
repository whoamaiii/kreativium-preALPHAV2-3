import React from 'react';
import { motion } from 'framer-motion';

interface XPBarProps {
  xp: number;
  level: number;
  xpPerLevel: number;
}

export const XPBar: React.FC<XPBarProps> = ({ xp, level, xpPerLevel }) => {
  const currentLevelXP = xp % xpPerLevel;
  const progress = (currentLevelXP / xpPerLevel) * 100;

  return (
    <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-white mix-blend-difference">
          {currentLevelXP} / {xpPerLevel} XP
        </span>
      </div>
    </div>
  );
};