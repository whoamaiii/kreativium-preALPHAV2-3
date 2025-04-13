import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';

interface CategoryBreakdownProps {
  data?: Array<{
    category: string;
    completed: number;
    accuracy: number;
  }>;
  isLoading?: boolean;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-[400px] w-full" />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Category Performance</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="category"
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
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar
              dataKey="completed"
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
              name="Completion"
            />
            <Bar
              dataKey="accuracy"
              fill="#82ca9d"
              radius={[4, 4, 0, 0]}
              name="Accuracy"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};