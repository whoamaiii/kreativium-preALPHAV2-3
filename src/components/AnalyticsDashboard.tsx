import React from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Card } from './Card';
import { useAnalytics } from '../hooks/useAnalytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const AnalyticsDashboard: React.FC = () => {
  const { userStats, getDailyProgress, getAverageTimePerQuestion } = useAnalytics();
  const dailyProgress = getDailyProgress(7);
  const avgTime = getAverageTimePerQuestion();

  const progressData = {
    labels: dailyProgress.map((d) => d.date),
    datasets: [
      {
        label: 'Daily Score (%)',
        data: dailyProgress.map((d) => d.score),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(userStats.categoryProgress),
    datasets: [
      {
        label: 'Category Progress (%)',
        data: Object.values(userStats.categoryProgress).map((v) => Math.round(v * 100)),
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        borderColor: 'rgb(147, 51, 234)',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Total Quizzes</h3>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {userStats.totalQuizzes}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Accuracy</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {Math.round(userStats.averageScore * 100)}%
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Avg Time/Question</h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(avgTime)}s
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Streak</h3>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {userStats.streakDays} days
            </p>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Progress Over Time</h3>
            <Line
              data={progressData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                  },
                },
              }}
            />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Category Performance</h3>
            <Bar
              data={categoryData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                  },
                },
              }}
            />
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Achievements</h3>
          <div className="space-y-4">
            {userStats.achievements.slice(-5).map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <h4 className="font-medium dark:text-white">{achievement.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};