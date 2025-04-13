import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Calendar, Award } from 'lucide-react';
import { Card } from './ui/Card';
import { Progress } from './ui/Progress';
import { useProgress } from '../hooks/useProgress';
import { format } from 'date-fns';

export const ProgressStats: React.FC = () => {
  const { level, xp, stats, achievements } = useProgress();

  const accuracy = stats.totalQuestions > 0
    ? (stats.totalCorrect / stats.totalQuestions) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
          <h3 className="text-sm text-gray-600 dark:text-gray-400">Level</h3>
          <p className="text-2xl font-bold">{level}</p>
        </Card>

        <Card className="p-4">
          <Star className="w-8 h-8 text-purple-500 mb-2" />
          <h3 className="text-sm text-gray-600 dark:text-gray-400">XP</h3>
          <p className="text-2xl font-bold">{xp}</p>
        </Card>

        <Card className="p-4">
          <Calendar className="w-8 h-8 text-blue-500 mb-2" />
          <h3 className="text-sm text-gray-600 dark:text-gray-400">Streak</h3>
          <p className="text-2xl font-bold">{stats.streakDays} days</p>
        </Card>

        <Card className="p-4">
          <Award className="w-8 h-8 text-green-500 mb-2" />
          <h3 className="text-sm text-gray-600 dark:text-gray-400">Accuracy</h3>
          <p className="text-2xl font-bold">{Math.round(accuracy)}%</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
        <div className="space-y-4">
          {achievements.slice(-3).map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div>
                <h4 className="font-medium">{achievement.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {achievement.description}
                </p>
              </div>
              <span className="text-sm text-gray-500">
                {format(new Date(achievement.unlockedAt), 'MMM d')}
              </span>
            </motion.div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Progress to Next Level</h3>
        <Progress
          value={(xp % 100)}
          max={100}
          className="mb-2"
          showValue
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {100 - (xp % 100)} XP needed for level {level + 1}
        </p>
      </Card>
    </div>
  );
};