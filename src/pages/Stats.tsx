import React from 'react';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';

const Stats: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Statistics & Progress</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your learning progress and performance
        </p>
      </div>

      <AnalyticsDashboard />
    </div>
  );
};

export default Stats;