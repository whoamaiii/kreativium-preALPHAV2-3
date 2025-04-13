import React from 'react';
import { Trophy, Zap, Star } from 'lucide-react';
import { Card } from './Card';
import { ComboMultiplier } from './ComboMultiplier';
import { DailyStreak } from './DailyStreak';
import { motion } from 'framer-motion';

interface GameStatusProps {
  score: number;
  level: number;
  streak: number;
  xp: number;
  dailyStreak: number;
  comboMultiplier: number;
}

export const GameStatus: React.FC<GameStatusProps> = ({
  score,
  level,
  streak,
  xp,
  dailyStreak,
  comboMultiplier,
}) => {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-wrap gap-4 justify-center">
        {dailyStreak > 0 && <DailyStreak streak={dailyStreak} />}
        {streak > 2 && <ComboMultiplier streak={streak} multiplier={comboMultiplier} />}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="text-center p-4">
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Poeng</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{score}</p>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="text-center p-4">
            <Star className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Nivå</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{level}</p>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="text-center p-4">
            <Zap className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Streak</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{streak}</p>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="text-center p-4">
            <div className="w-6 h-6 text-blue-500 mx-auto mb-2">XP</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Erfaring</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{xp}</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};