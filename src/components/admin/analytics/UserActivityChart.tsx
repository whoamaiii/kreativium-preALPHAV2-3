import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card } from '../../ui/Card';
import { Skeleton } from '../../ui/Skeleton';

interface UserActivityChartProps {
  data?: Array<{
    date: string;
    activeUsers: number;
    quizAttempts: number;
    memoryGames: number;
  }>;
  isLoading?: boolean;
}

export const UserActivityChart: React.FC<UserActivityChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-[400px] w-full" />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">User Activity</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
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
            <Legend />
            <Line
              type="monotone"
              dataKey="activeUsers"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              name="Active Users"
            />
            <Line
              type="monotone"
              dataKey="quizAttempts"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={false}
              name="Quiz Attempts"
            />
            <Line
              type="monotone"
              dataKey="memoryGames"
              stroke="#EC4899"
              strokeWidth={2}
              dot={false}
              name="Memory Games"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};