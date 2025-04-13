import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface ComboDisplayProps {
  streak: number;
  multiplier: number;
}

export const ComboDisplay: React.FC<ComboDisplayProps> = ({ streak, multiplier }) => {
  const { t } = useTranslation();
  if (streak <= 1) return null;
  
  return (
    <motion.div 
      className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full px-3 py-1 flex items-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <motion.span 
        className="text-white font-bold mr-1"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 0.3 }}
      >
        {streak}x
      </motion.span>
      <span className="text-xs text-white opacity-80">
        {multiplier.toFixed(1)}x {t('quiz.multiplier')}
      </span>
    </motion.div>
  );
}; 