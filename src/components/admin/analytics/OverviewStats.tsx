import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Brain, Target } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Skeleton } from '../../ui/Skeleton';

interface OverviewStatsProps {
  data?: {
    totalUsers: number;
    totalQuizAttempts: number;
    totalMemoryGames: number;
    averageScore: number;
  };
  isLoading?: boolean;
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({ data, isLoading }) => {
  const stats = [
    {
      label: 'Total Users',
      value: data?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-500',
    },
    {
      label: 'Quiz Attempts',
      value: data?.totalQuizAttempts || 0,
      icon: Award,
      color: 'text-purple-500',
    },
    {
      label: 'Memory Games',
      value: data?.totalMemoryGames || 0,
      icon: Brain,
      color: 'text-pink-500',
    },
    {
      label: 'Avg. Score',
      value: `${Math.round((data?.averageScore || 0) * 100)}%`,
      icon: Target,
      color: 'text-green-500',
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
              <div className={stat.color}>
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