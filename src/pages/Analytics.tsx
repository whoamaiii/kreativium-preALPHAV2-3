import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { DateRangePicker } from '../components/DateRangePicker';
import { OverviewStats } from '../components/analytics/OverviewStats';
import { ProgressChart } from '../components/analytics/ProgressChart';
import { CategoryBreakdown } from '../components/analytics/CategoryBreakdown';
import { AchievementsList } from '../components/analytics/AchievementsList';
import { useAnalytics } from '../hooks/useAnalytics';
import { addDays, subDays } from 'date-fns';

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data, isLoading } = useAnalytics(dateRange);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your learning progress and performance
          </p>
        </div>

        <DateRangePicker
          from={dateRange.from}
          to={dateRange.to}
          onSelect={(range) => {
            if (range?.from && range?.to) {
              setDateRange({ from: range.from, to: range.to });
            }
          }}
        />
      </div>

      <OverviewStats data={data?.overview} isLoading={isLoading} />

      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-6">
          <ProgressChart data={data?.progress} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryBreakdown data={data?.categories} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementsList achievements={data?.achievements} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;