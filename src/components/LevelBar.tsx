import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface LevelBarProps {
  level: number;
  score: number;
}

export const LevelBar: React.FC<LevelBarProps> = ({ level, score }) => {
  const progress = (score % 400) / 4; // 400 XP per level, convert to percentage

  return (
    <div className="bg-[#1a1625]/50 backdrop-blur-sm rounded-lg p-4 mb-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500" />
          <span className="text-lg font-bold text-white">Level {level}</span>
        </div>
        <span className="text-sm text-gray-400">Score: {score}</span>
      </div>
      
      <div className="h-2 bg-[#2d2b3d] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};