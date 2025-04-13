import React, { useEffect, useState } from 'react';
import { useIlps } from '../../context/ILPContext';
import { ILPProgress } from '../../types/ilp';

interface ProgressChartsProps {
  ilpId: string;
  className?: string;
}

/**
 * Component for visualizing ILP progress with various charts and graphs
 */
export const ProgressCharts: React.FC<ProgressChartsProps> = ({ ilpId, className = '' }) => {
  const { getProgressForILP, getOverallProgress } = useIlps();
  const [progressData, setProgressData] = useState<ILPProgress[]>([]);
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch progress data and overall progress in parallel
        const [progress, overall] = await Promise.all([
          getProgressForILP(ilpId),
          getOverallProgress(ilpId)
        ]);
        
        setProgressData(progress);
        setOverallProgress(overall);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [ilpId, getProgressForILP, getOverallProgress]);
  
  // Group progress data by activity type for the pie chart
  const activityTypeData = progressData.reduce((acc, item) => {
    acc[item.activityType] = (acc[item.activityType] || 0) + item.progressPercentageContribution;
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate average score
  const averageScore = progressData.length > 0
    ? progressData.reduce((sum, item) => sum + (item.score || 0), 0) / progressData.length
    : 0;
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };
  
  if (isLoading) {
    return (
      <div className={`rounded-lg bg-white shadow p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-24 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`rounded-lg bg-white shadow p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Progress Tracking</h2>
      
      {/* Overall Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-green-600 h-2.5 rounded-full" 
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Activities Completed</p>
          <p className="text-2xl font-bold">
            {progressData.filter(p => p.completionStatus).length}
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Average Score</p>
          <p className="text-2xl font-bold">
            {averageScore.toFixed(1)}%
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Last Activity</p>
          <p className="text-lg font-bold">
            {progressData.length > 0 
              ? formatDate(progressData[progressData.length - 1].timestamp) 
              : 'No activities yet'}
          </p>
        </div>
      </div>
      
      {/* Activity Type Distribution */}
      {Object.keys(activityTypeData).length > 0 && (
        <div className="mb-8">
          <h3 className="text-md font-semibold mb-2">Progress by Activity Type</h3>
          <div className="space-y-2">
            {Object.entries(activityTypeData).map(([type, value]) => (
              <div key={type}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm capitalize">{type}</span>
                  <span className="text-sm font-medium">{value.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Recent Activity List */}
      <div>
        <h3 className="text-md font-semibold mb-2">Recent Activities</h3>
        {progressData.length === 0 ? (
          <p className="text-sm text-gray-500">No activities recorded yet.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...progressData]
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .slice(0, 5)
                  .map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm">{formatDate(item.timestamp)}</td>
                      <td className="px-4 py-2 text-sm capitalize">{item.activityType}</td>
                      <td className="px-4 py-2 text-sm">{item.score || '-'}%</td>
                      <td className="px-4 py-2 text-sm">+{item.progressPercentageContribution.toFixed(1)}%</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}; 