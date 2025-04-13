import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Flame } from 'lucide-react';
import { Card } from '../ui/Card';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  streak: number;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  currentQuestion,
  totalQuestions,
  score,
  streak,
}) => {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Score</p>
          <p className="text-2xl font-bold">{score}</p>
        </Card>

        <Card className="p-4 text-center">
          <Star className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
          <p className="text-2xl font-bold">{currentQuestion}/{totalQuestions}</p>
        </Card>

        <Card className="p-4 text-center">
          <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Streak</p>
          <p className="text-2xl font-bold">{streak}</p>
        </Card>
      </div>

      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};