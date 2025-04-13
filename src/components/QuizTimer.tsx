import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface QuizTimerProps {
  duration: number;
  onTimeUp: () => void;
  isActive?: boolean;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({
  duration,
  onTimeUp,
  isActive = true,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, onTimeUp, isActive]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  const progress = (timeLeft / duration) * 100;
  const isWarning = timeLeft <= 10;

  return (
    <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1 }}
        className={`absolute inset-y-0 left-0 ${
          isWarning ? 'bg-red-500' : 'bg-green-500'
        }`}
      />
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-1">
        <Clock className={`w-4 h-4 ${isWarning ? 'text-red-500' : 'text-green-500'}`} />
        <span className={`text-sm font-medium ${isWarning ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
          {timeLeft}s
        </span>
      </div>
    </div>
  );
};