import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Target, Zap } from 'lucide-react';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';

interface OverviewStatsProps {
  data?: {
    totalQuizzes: number;
    accuracy: number;
    timeSpent: number;
    streak: number;
  };
  isLoading?: boolean;
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({ data, isLoading }) => {
  const stats = [
    {
      label: 'Total Quizzes',
      value: data?.totalQuizzes || 0,
      icon: Trophy,
      color: 'text-yellow-500',
    },
    {
      label: 'Accuracy',
      value: `${Math.round((data?.accuracy || 0) * 100)}%`,
      icon: Target,
      color: 'text-green-500',
    },
    {
      label: 'Time Spent',
      value: `${Math.round((data?.timeSpent || 0) / 60)}m`,
      icon: Clock,
      color: 'text-blue-500',
    },
    {
      label: 'Current Streak',
      value: data?.streak || 0,
      icon: Zap,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className={`${stat.color}`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};