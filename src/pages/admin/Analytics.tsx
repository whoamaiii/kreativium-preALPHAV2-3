import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DateRangePicker } from '../../components/admin/DateRangePicker';
import { OverviewStats } from '../../components/admin/analytics/OverviewStats';
import { UserActivityChart } from '../../components/admin/analytics/UserActivityChart';
import { ContentMetrics } from '../../components/admin/analytics/ContentMetrics';
import { CategoryBreakdown } from '../../components/admin/analytics/CategoryBreakdown';
import { useAnalytics } from '../../hooks/useAnalytics';
import { addDays, subDays } from 'date-fns';

export const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data, isLoading } = useAnalytics(dateRange);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">
            Track user engagement and content performance
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

      <div className="space-y-8">
        <OverviewStats data={data?.overview} isLoading={isLoading} />

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <UserActivityChart
              data={data?.userActivity}
              isLoading={isLoading}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ContentMetrics
              data={data?.contentMetrics}
              isLoading={isLoading}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CategoryBreakdown
            data={data?.categoryBreakdown}
            isLoading={isLoading}
          />
        </motion.div>
      </div>
    </div>
  );
};