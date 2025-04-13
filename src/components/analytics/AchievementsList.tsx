import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { format } from 'date-fns';

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string;
  icon: string;
}

interface AchievementsListProps {
  achievements?: Achievement[];
  isLoading?: boolean;
}

export const AchievementsList: React.FC<AchievementsListProps> = ({
  achievements,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Achievements</h3>
      <div className="space-y-4">
        {achievements?.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex-shrink-0">
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="flex-grow">
              <h4 className="font-medium dark:text-white">{achievement.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {achievement.description}
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(achievement.unlockedAt), 'MMM d, yyyy')}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};