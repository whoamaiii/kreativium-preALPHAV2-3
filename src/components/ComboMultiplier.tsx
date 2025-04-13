import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface ComboMultiplierProps {
  streak: number;
  multiplier: number;
}

export const ComboMultiplier: React.FC<ComboMultiplierProps> = ({ streak, multiplier }) => {
  const isActive = multiplier > 1;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: isActive ? [1, 1.1, 1] : 1,
        opacity: 1
      }}
      transition={{
        scale: {
          duration: 0.5,
          repeat: isActive ? Infinity : 0,
          repeatType: "reverse"
        }
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded-full ${
        isActive ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <Flame className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
      <span className={`font-bold ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
        {streak}x Combo!
      </span>
    </motion.div>
  );
};