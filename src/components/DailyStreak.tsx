import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface DailyStreakProps {
  streak: number;
}

export const DailyStreak: React.FC<DailyStreakProps> = ({ streak }) => {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
    >
      <Calendar className="w-5 h-5 text-white" />
      <span className="font-bold text-white">{streak} Day Streak!</span>
    </motion.div>
  );
};