import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card } from '../../ui/Card';
import { Skeleton } from '../../ui/Skeleton';

interface ContentMetricsProps {
  data?: {
    quizzes: number;
    memoryGames: number;
    categories: number;
    mediaFiles: number;
  };
  isLoading?: boolean;
}

export const ContentMetrics: React.FC<ContentMetricsProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-[400px] w-full" />
      </Card>
    );
  }

  const chartData = data ? [
    { name: 'Quizzes', value: data.quizzes },
    { name: 'Memory Games', value: data.memoryGames },
    { name: 'Categories', value: data.categories },
    { name: 'Media Files', value: data.mediaFiles },
  ] : [];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Content Distribution</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Bar
              dataKey="value"
              fill="#8B5CF6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};