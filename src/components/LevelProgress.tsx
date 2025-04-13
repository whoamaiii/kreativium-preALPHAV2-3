import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';

interface LevelProgressProps {
  level: number;
  xp: number;
  totalXp: number;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({ level, xp, totalXp }) => {
  const progress = (xp % totalXp) / totalXp * 100;

  return (
    <Card className="mb-8 p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="flex items-center gap-4 mb-2">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500" />
          <span className="text-lg font-bold text-white">Level {level}</span>
        </div>
        <div className="text-sm text-gray-400">
          {xp % totalXp} / {totalXp} XP
        </div>
      </div>

      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </Card>
  );
};