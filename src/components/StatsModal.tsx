import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { BarChart, Clock, Award, Calendar } from 'lucide-react';

interface StatsModalProps {
  stats: {
    totalAnswers: number;
    correctAnswers: number;
    timeSpent: number;
    lastPlayed: string;
    streakRecord: number;
    categoryProgress: Record<string, number>;
  };
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, onClose }) => {
  const accuracy = stats.totalAnswers > 0 
    ? ((stats.correctAnswers / stats.totalAnswers) * 100).toFixed(1)
    : '0';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full dark:bg-dark-secondary">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold dark:text-white">Din Statistikk</h2>
            <Button variant="secondary" size="sm" onClick={onClose}>
              Lukk
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-purple-100 dark:bg-dark-primary">
              <BarChart className="w-6 h-6 text-purple-500 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">Nøyaktighet</p>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{accuracy}%</p>
            </div>

            <div className="p-4 rounded-lg bg-blue-100 dark:bg-dark-primary">
              <Clock className="w-6 h-6 text-blue-500 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">Tid Brukt</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {Math.floor(stats.timeSpent / 60)}m
              </p>
            </div>

            <div className="p-4 rounded-lg bg-yellow-100 dark:bg-dark-primary">
              <Award className="w-6 h-6 text-yellow-500 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">Beste Streak</p>
              <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.streakRecord}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-green-100 dark:bg-dark-primary">
              <Calendar className="w-6 h-6 text-green-500 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">Sist Spilt</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {new Date(stats.lastPlayed).toLocaleDateString('nb-NO')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold dark:text-white">Kategori Fremgang</h3>
            {Object.entries(stats.categoryProgress).map(([category, progress]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between text-sm dark:text-gray-300">
                  <span>{category}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-dark-primary">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};