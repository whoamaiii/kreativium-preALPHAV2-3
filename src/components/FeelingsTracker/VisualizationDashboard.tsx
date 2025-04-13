import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chart.js/auto';
import { Bar, Pie } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { useEmotionData } from '../../hooks/useEmotionData';
import { usePatternAnalysis } from '../../hooks/usePatternAnalysis';
import { useAuthContext } from '../../hooks/useAuthContext';
import { EMOTION_COLORS, EMOTIONS, Emotion } from '../../types/emotion';
import { TimeFilter } from './TimeFilter';
import EmotionLearningCorrelation from './EmotionLearningCorrelation';
import { StressZoneIndicator } from '../StressZoneIndicator';
import { EMOTION_TO_ZONE, ZONE_COLORS } from '../../types/emotion';
import { EmotionLog } from '../../types/emotion';
import { Card } from '../ui/Card';
import { StressZoneTrafficLight } from '../StressZoneIndicator';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

// Helper function to destroy charts on tab switch
const destroyExistingCharts = () => {
  try {
    // Find all chart instances and destroy them
    const chartInstances = Object.values(ChartJS.instances);
    chartInstances.forEach(chart => {
      chart.destroy();
    });
  } catch (error) {
    console.error("Error destroying charts:", error);
  }
};

// Simplified error boundary component
const SafeChartContainer = ({ children }: { children: React.ReactNode }) => {
  // Simple wrapper to isolate chart rendering
  return (
    <div className="chart-container">
      {children}
    </div>
  );
};

// Mock data to ensure charts render even when no data is available
const getDefaultFrequencyData = () => ({
  labels: EMOTIONS,
  datasets: [{
    label: 'Emotion Frequency',
    data: EMOTIONS.map(() => Math.floor(Math.random() * 5) + 1),
    backgroundColor: EMOTIONS.map(emotion => EMOTION_COLORS[emotion] + 'B3'),
    borderColor: EMOTIONS.map(emotion => EMOTION_COLORS[emotion]),
    borderWidth: 1,
  }],
});

const getDefaultHourlyData = () => ({
  labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
  datasets: EMOTIONS.map(emotion => ({
    label: emotion,
    data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 3)),
    backgroundColor: EMOTION_COLORS[emotion],
    stack: 'hourlyStack', // Stack bars by hour
  })),
});

interface VisualizationDashboardProps {
  className?: string;
  showRoleFilter?: boolean;
}

type RoleFilter = 'all' | 'students' | 'teachers';

// Helper to count logs by stress zone
const getZoneData = (logs: EmotionLog[]) => {
  const zoneCount = {
    green: 0,
    yellow: 0,
    red: 0
  };
  
  logs.forEach(log => {
    const zone = EMOTION_TO_ZONE[log.emotion];
    if (zone) {
      zoneCount[zone as keyof typeof zoneCount]++;
    }
  });
  
  return {
    labels: Object.keys(zoneCount).map(zone => zone.charAt(0).toUpperCase() + zone.slice(1)),
    datasets: [{
      label: 'Stress Zones',
      data: Object.values(zoneCount),
      backgroundColor: [
        ZONE_COLORS.green + 'B3',
        ZONE_COLORS.yellow + 'B3',
        ZONE_COLORS.red + 'B3'
      ],
      borderColor: [
        ZONE_COLORS.green,
        ZONE_COLORS.yellow,
        ZONE_COLORS.red
      ],
      borderWidth: 1
    }]
  };
};

// Child overview component that shows each child's current zone
const ChildZoneOverview: React.FC = () => {
  const { getChildUsers } = useAuthContext();
  const childUsers = getChildUsers();
  const { logs } = useEmotionData();
  
  // Get latest emotion log for each child
  const getLatestChildEmotion = (userId: string) => {
    const childLogs = logs.filter(log => log.userId === userId);
    if (childLogs.length === 0) return undefined;
    return childLogs[0].emotion; // logs are already sorted by date
  };
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 dark:text-white">
        Current Status by Child
      </h3>
      
      {childUsers.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No children added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {childUsers.map(child => {
            const latestEmotion = getLatestChildEmotion(child.id);
            const zone = latestEmotion ? EMOTION_TO_ZONE[latestEmotion] : undefined;
            return (
              <Card key={child.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-lg dark:text-white">{child.name}</h4>
                    {latestEmotion ? (
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        Currently feeling: {latestEmotion}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No data available</p>
                    )}
                  </div>
                  <StressZoneIndicator 
                    emotion={latestEmotion} 
                    showDescription={false}
                    size="sm"
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * VisualizationDashboard component
 * Dashboard for visualizing and analyzing emotion data
 */
export const VisualizationDashboard: React.FC<VisualizationDashboardProps> = ({
  className = '',
  showRoleFilter = true
}) => {
  // Cleanup charts when component unmounts
  useEffect(() => {
    return () => {
      destroyExistingCharts();
    };
  }, []);
  
  const { user, getChildUsers } = useAuthContext();
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('students');
  const [activeTab, setActiveTab] = useState<'frequency' | 'hourly' | 'correlation' | 'zones' | 'stresszone'>('frequency');
  const childUsers = getChildUsers();
  
  // Initialize with week timeframe
  const { 
    logs, 
    isLoading, 
    error, 
    filters, 
    updateFilters 
  } = useEmotionData({ 
    timeframe: 'week', 
    userId: selectedUserId,
    role: roleFilter === 'all' ? undefined : roleFilter === 'students' ? 'child' : 'teacher'
  });
  
  // Analyze patterns
  const { 
    analysisResult, 
    isAnalyzing
  } = usePatternAnalysis(logs);

  // When active tab changes, destroy all charts to prevent interference
  useEffect(() => {
    destroyExistingCharts();
  }, [activeTab]);

  // Update filter when selectedUserId changes
  useEffect(() => {
    updateFilters({ userId: selectedUserId });
  }, [selectedUserId, updateFilters]);

  // Handle timeframe change
  const handleTimeframeChange = (timeframe: "all" | "hour" | "day" | "week" | "month" | undefined) => {
    updateFilters({ timeframe });
  };

  // Access check
  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-400">Please log in to view the dashboard.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading" style={{ textAlign: 'center', padding: '20px' }}>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error" style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
        <h3>Error loading data</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  // Configure chart data
  const hasFrequencyData = analysisResult?.overallFrequency && analysisResult.overallFrequency.length > 0;
  const hasHourlyData = analysisResult?.hourlyPatterns && analysisResult.hourlyPatterns.length > 0;
  
  // Use real data if available, otherwise use mock data
  const frequencyData = hasFrequencyData ? {
    labels: analysisResult.overallFrequency.map(f => f.emotion),
    datasets: [{
      label: 'Emotion Frequency',
      data: analysisResult.overallFrequency.map(f => f.count),
      backgroundColor: analysisResult.overallFrequency.map(f => EMOTION_COLORS[f.emotion as Emotion] + 'B3'),
      borderColor: analysisResult.overallFrequency.map(f => EMOTION_COLORS[f.emotion as Emotion]),
      borderWidth: 1,
    }],
  } : getDefaultFrequencyData();

  const hourlyData = hasHourlyData ? {
    labels: analysisResult.hourlyPatterns.map(p => `${p.hour}:00`),
    datasets: EMOTIONS.map(emotion => ({
      label: emotion,
      data: analysisResult.hourlyPatterns.map(p => p.emotionCounts[emotion] || 0),
      backgroundColor: EMOTION_COLORS[emotion],
      stack: 'hourlyStack',
    })),
  } : getDefaultHourlyData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#333',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 4
      }
    }
  };

  const hourlyOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: { display: true, text: 'Emotion Count by Hour of Day' },
    },
    scales: {
      x: { title: { display: true, text: 'Hour' } },
      y: { title: { display: true, text: 'Count' }, stacked: true },
    },
  };

  return (
    <div className={`visualization-dashboard ${className}`} data-testid="visualization-dashboard">
      <h1 className="text-2xl font-bold text-purple-300 mb-6">
        {roleFilter === 'teachers' ? 'Teacher Emotions Dashboard' : 
         roleFilter === 'students' ? 'Student Emotions Dashboard' : 
         'All Emotions Dashboard'}
      </h1>

      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        {/* User Filter */}
        <div className="min-w-[200px]">
          <label 
            htmlFor="user-filter" 
            className="mr-3 font-medium text-white"
          >
            {roleFilter === 'students' ? 'Student:' : 'Teacher:'}
          </label>
          <select 
            id="user-filter"
            value={selectedUserId || ''}
            onChange={(e) => setSelectedUserId(e.target.value || undefined)}
            className="px-3 py-2 rounded"
          >
            <option value="">{roleFilter === 'students' ? 'All Students' : 'All Teachers'}</option>
            {childUsers
              .filter(u => {
                if (roleFilter === 'students') return u.role === 'child';
                if (roleFilter === 'teachers') return u.role === 'teacher';
                return true;
              })
              .map(user => (
                <option key={user.id} value={user.id}>
                  {user.name || user.id}
                </option>
              ))
            }
          </select>
        </div>

        {/* Role Filter */}
        {showRoleFilter && (
          <div className="flex">
            <button
              onClick={() => setRoleFilter('students')}
              className={`px-4 py-2 rounded-l ${
                roleFilter === 'students'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100'
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setRoleFilter('teachers')}
              className={`px-4 py-2 rounded-r ${
                roleFilter === 'teachers'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100'
              }`}
            >
              Teachers
            </button>
          </div>
        )}

        {/* Time Filter */}
        <TimeFilter 
          currentFilter={filters.timeframe || 'week'} 
          onChange={handleTimeframeChange}
        />
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="mb-4 flex border-b border-gray-700">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'frequency' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('frequency')}
          >
            Frequency
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'hourly' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('hourly')}
          >
            Hourly Patterns
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'correlation' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('correlation')}
          >
            Learning Impact
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'zones' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('zones')}
          >
            Zones
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'stresszone' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('stresszone')}
          >
            Stress Zone
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {activeTab === 'frequency' && (
          <div className="bg-white p-6 rounded-lg shadow-md text-black">
            <h2 className="text-xl font-semibold mb-4">Emotion Frequency</h2>
            <div className="h-[400px] relative">
              {/* Fallback chart display in case Chart.js fails */}
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 0 }}>
                <div className="w-64 h-64 rounded-full bg-gray-100 flex items-center justify-center relative">
                  {EMOTIONS.map((emotion, index) => {
                    const angle = (index / EMOTIONS.length) * 2 * Math.PI;
                    const x = 110 * Math.cos(angle);
                    const y = 110 * Math.sin(angle);
                    const size = frequencyData.datasets[0].data[index] || 5;
                    const scale = Math.max(0.5, Math.min(2, size / 5));
                    
                    return (
                      <div 
                        key={emotion}
                        className="absolute rounded-full flex items-center justify-center font-bold text-white"
                        style={{
                          backgroundColor: EMOTION_COLORS[emotion],
                          width: `${36 * scale}px`,
                          height: `${36 * scale}px`,
                          transform: `translate(${x}px, ${y}px)`,
                          fontSize: `${12 * scale}px`,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {emotion.charAt(0).toUpperCase()}
                      </div>
                    );
                  })}
                  <div className="text-lg font-semibold text-gray-700">Emotions</div>
                </div>
              </div>
              
              {/* Simple wrapper for Chart.js chart */}
              <div className="absolute inset-0" style={{ zIndex: 1 }}>
                <SafeChartContainer>
                  {/* Only try to render if we have data */}
                  {frequencyData.labels.length > 0 && (
                    <Pie 
                      data={frequencyData} 
                      options={{
                        ...chartOptions,
                        responsive: true,
                        maintainAspectRatio: false,
                      }} 
                    />
                  )}
                </SafeChartContainer>
              </div>
            </div>
            {!hasFrequencyData && (
              <p className="text-center mt-4 text-gray-500 italic">
                Using sample data. Log emotions to see your actual data.
              </p>
            )}
          </div>
        )}

        {activeTab === 'hourly' && (
          <div className="bg-white p-6 rounded-lg shadow-md text-black">
            <h2 className="text-xl font-semibold mb-4">Hourly Patterns</h2>
            <div className="h-[400px] relative">
              {/* Fallback hourly chart using CSS */}
              <div className="absolute inset-0 flex flex-col" style={{ zIndex: 0 }}>
                <div className="flex-grow flex items-end">
                  {Array.from({ length: 24 }, (_, hour) => {
                    // Get total emotion count for this hour
                    const total = EMOTIONS.reduce((sum, emotion, idx) => 
                      sum + (hourlyData.datasets[idx]?.data[hour] || 0), 0);
                    const height = Math.min(90, Math.max(10, (total / 10) * 100));
                    
                    return (
                      <div key={hour} className="flex-grow flex flex-col items-center mx-1">
                        <div className="w-full flex flex-col-reverse">
                          {EMOTIONS.map((emotion, idx) => {
                            const value = hourlyData.datasets[idx]?.data[hour] || 0;
                            const barHeight = value > 0 ? Math.max(10, (value / total) * height) : 0;
                            
                            return value > 0 ? (
                              <div 
                                key={emotion}
                                style={{
                                  height: `${barHeight}%`,
                                  backgroundColor: EMOTION_COLORS[emotion],
                                  transition: 'height 0.3s ease'
                                }}
                                className="w-full"
                              />
                            ) : null;
                          })}
                        </div>
                        <div className="text-xs mt-1">{hour}:00</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Simple wrapper for Chart.js hourly chart */}
              <div className="absolute inset-0" style={{ zIndex: 1 }}>
                <SafeChartContainer>
                  {/* Only try to render if we have data */}
                  {hourlyData.labels.length > 0 && (
                    <Bar 
                      data={hourlyData} 
                      options={{
                        ...hourlyOptions,
                        responsive: true,
                        maintainAspectRatio: false,
                      }} 
                    />
                  )}
                </SafeChartContainer>
              </div>
            </div>
            {!hasHourlyData && (
              <p className="text-center mt-4 text-gray-500 italic">
                Using sample data. Log emotions to see your actual data.
              </p>
            )}
          </div>
        )}

        {activeTab === 'correlation' && (
          <div className="bg-white p-6 rounded-lg shadow-md text-black">
            <h2 className="text-xl font-semibold mb-4">Learning Correlation</h2>
            <EmotionLearningCorrelation />
          </div>
        )}
        
        {activeTab === 'zones' && (
          <div className="bg-white p-6 rounded-lg shadow-md text-black">
            <h2 className="text-xl font-semibold mb-4">My Stress Response Zone</h2>
            
            {/* Get the user's latest emotion */}
            {(() => {
              const userLogs = logs.filter(log => log.userId === user.id);
              const latestEmotion = userLogs.length > 0 ? userLogs[0].emotion : undefined;
              const zone = latestEmotion ? EMOTION_TO_ZONE[latestEmotion] : undefined;
              
              return (
                <div className="flex flex-col items-center">
                  {/* Large traffic light */}
                  <StressZoneTrafficLight 
                    emotion={latestEmotion}
                    size="lg"
                    showDescription={false}
                    className="mb-6"
                  />
                  
                  {/* Current emotion and zone */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2" style={{ color: latestEmotion ? EMOTION_COLORS[latestEmotion] : '#333' }}>
                      {latestEmotion ? `You're feeling ${latestEmotion}` : 'No emotion logged yet'}
                    </h3>
                    
                    {zone && (
                      <p className="text-lg font-medium" style={{ color: ZONE_COLORS[zone] }}>
                        You're in the {zone.toUpperCase()} ZONE
                      </p>
                    )}
                  </div>
                  
                  {/* Zone descriptions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                    <Card className="p-4 border-l-4" style={{ borderLeftColor: ZONE_COLORS.green }}>
                      <h3 className="font-bold mb-2" style={{ color: ZONE_COLORS.green }}>GREEN ZONE</h3>
                      <p className="text-gray-700">
                        When you're calm, happy, and ready to learn. Your body feels relaxed and your mind is clear.
                      </p>
                      <p className="text-gray-600 mt-2 text-sm">
                        Emotions: happy, calm
                      </p>
                    </Card>
                    
                    <Card className="p-4 border-l-4" style={{ borderLeftColor: ZONE_COLORS.yellow }}>
                      <h3 className="font-bold mb-2" style={{ color: ZONE_COLORS.yellow }}>YELLOW ZONE</h3>
                      <p className="text-gray-700">
                        When you're feeling heightened emotions that might make it harder to focus or learn.
                      </p>
                      <p className="text-gray-600 mt-2 text-sm">
                        Emotions: excited, sad, tired, anxious, frustrated
                      </p>
                    </Card>
                    
                    <Card className="p-4 border-l-4" style={{ borderLeftColor: ZONE_COLORS.red }}>
                      <h3 className="font-bold mb-2" style={{ color: ZONE_COLORS.red }}>RED ZONE</h3>
                      <p className="text-gray-700">
                        When you're feeling overwhelmed and might need help to calm down.
                      </p>
                      <p className="text-gray-600 mt-2 text-sm">
                        Emotions: angry
                      </p>
                    </Card>
                  </div>
                  
                  {/* Regulation strategies based on current zone */}
                  {zone && (
                    <div className="mt-8 w-full max-w-2xl">
                      <h3 className="text-lg font-semibold mb-3">
                        Strategies for the {zone.toUpperCase()} ZONE:
                      </h3>
                      <ul className="list-disc pl-6 space-y-2">
                        {zone === 'green' && (
                          <>
                            <li>Continue what you're doing - you're in a great state for learning!</li>
                            <li>Notice how your body feels when you're calm - this awareness helps you return to this zone.</li>
                            <li>Share your positive feelings with others.</li>
                          </>
                        )}
                        
                        {zone === 'yellow' && (
                          <>
                            <li>Take 5 deep breaths in through your nose and out through your mouth.</li>
                            <li>Count slowly to 10.</li>
                            <li>Take a short break if possible.</li>
                            <li>Talk to someone about how you're feeling.</li>
                          </>
                        )}
                        
                        {zone === 'red' && (
                          <>
                            <li>Find a quiet space if possible.</li>
                            <li>Take slow, deep breaths.</li>
                            <li>Ask for help from a trusted adult.</li>
                            <li>Use a calm-down technique that works for you (counting, visualization, etc.).</li>
                          </>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {activeTab === 'stresszone' && (
          <div className="bg-white p-6 rounded-lg shadow-md text-black">
            <h2 className="text-xl font-semibold mb-4">Stress Zone Analysis</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column: Current zone status and zone distribution */}
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-medium mb-4">Current Zone Status</h3>
                
                {(() => {
                  // Get latest log to determine current emotion/zone
                  const latestLog = logs && logs.length > 0 
                    ? logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
                    : null;
                  
                  // Get current emotion and zone
                  const emotion = latestLog?.emotion;
                  const zone = emotion ? EMOTION_TO_ZONE[emotion] : 'green';
                  
                  // Calculate zone distribution
                  const zoneDistribution = {
                    green: 0,
                    yellow: 0,
                    red: 0
                  };
                  
                  logs.forEach(log => {
                    const logZone = EMOTION_TO_ZONE[log.emotion];
                    zoneDistribution[logZone]++;
                  });
                  
                  const totalLogs = logs.length || 1; // Avoid division by zero
                  
                  return (
                    <div className="flex flex-col items-center w-full">
                      {/* Traffic light visualization */}
                      <div className="mb-8">
                        <StressZoneTrafficLight 
                          emotion={emotion}
                          size="lg"
                          showDescription={true}
                        />
                      </div>
                      
                      {/* Zone distribution chart */}
                      <div className="w-full max-w-sm">
                        <h4 className="text-md font-medium mb-2">Your Zone Distribution</h4>
                        <div className="bg-gray-100 rounded-lg p-4">
                          <div className="flex flex-col gap-3">
                            {/* Green zone bar */}
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium" style={{ color: ZONE_COLORS.green }}>Green Zone</span>
                                <span className="text-sm">{((zoneDistribution.green / totalLogs) * 100).toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-opacity-80 h-2.5 rounded-full" 
                                  style={{ 
                                    width: `${(zoneDistribution.green / totalLogs) * 100}%`,
                                    backgroundColor: ZONE_COLORS.green 
                                  }}
                                ></div>
                              </div>
                            </div>
                            
                            {/* Yellow zone bar */}
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium" style={{ color: ZONE_COLORS.yellow }}>Yellow Zone</span>
                                <span className="text-sm">{((zoneDistribution.yellow / totalLogs) * 100).toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-opacity-80 h-2.5 rounded-full" 
                                  style={{ 
                                    width: `${(zoneDistribution.yellow / totalLogs) * 100}%`,
                                    backgroundColor: ZONE_COLORS.yellow 
                                  }}
                                ></div>
                              </div>
                            </div>
                            
                            {/* Red zone bar */}
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium" style={{ color: ZONE_COLORS.red }}>Red Zone</span>
                                <span className="text-sm">{((zoneDistribution.red / totalLogs) * 100).toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-opacity-80 h-2.5 rounded-full" 
                                  style={{ 
                                    width: `${(zoneDistribution.red / totalLogs) * 100}%`,
                                    backgroundColor: ZONE_COLORS.red 
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Summary text */}
                          <p className="mt-4 text-sm text-gray-600">
                            {zoneDistribution.green > zoneDistribution.yellow && zoneDistribution.green > zoneDistribution.red ? (
                              "You spend most of your time in the Green Zone. Great job staying regulated!"
                            ) : zoneDistribution.yellow > zoneDistribution.green && zoneDistribution.yellow > zoneDistribution.red ? (
                              "You spend most of your time in the Yellow Zone. Consider practicing calming strategies."
                            ) : (
                              "You spend most of your time in the Red Zone. Let's work on regulation strategies together."
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              {/* Right column: Zone information and strategies */}
              <div>
                <h3 className="text-lg font-medium mb-4">Understanding Stress Zones</h3>
                
                {/* Zone boxes */}
                <div className="space-y-4 mb-6">
                  <Card className="p-4 border-l-4" style={{ borderLeftColor: ZONE_COLORS.green }}>
                    <h4 className="font-bold mb-1" style={{ color: ZONE_COLORS.green }}>GREEN ZONE</h4>
                    <p className="text-sm text-gray-700 mb-1">
                      Calm, focused, and ready to learn. In this zone, you can:
                    </p>
                    <ul className="text-xs text-gray-600 list-disc pl-4">
                      <li>Focus on tasks effectively</li>
                      <li>Solve problems creatively</li>
                      <li>Maintain helpful relationships</li>
                      <li>Feel balanced and productive</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4 border-l-4" style={{ borderLeftColor: ZONE_COLORS.yellow }}>
                    <h4 className="font-bold mb-1" style={{ color: ZONE_COLORS.yellow }}>YELLOW ZONE</h4>
                    <p className="text-sm text-gray-700 mb-1">
                      Heightened alertness that needs attention. In this zone:
                    </p>
                    <ul className="text-xs text-gray-600 list-disc pl-4">
                      <li>You may have trouble focusing</li>
                      <li>You might feel restless or unsettled</li>
                      <li>Emotions may interfere with learning</li>
                      <li>You need some calming strategies</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4 border-l-4" style={{ borderLeftColor: ZONE_COLORS.red }}>
                    <h4 className="font-bold mb-1" style={{ color: ZONE_COLORS.red }}>RED ZONE</h4>
                    <p className="text-sm text-gray-700 mb-1">
                      Overwhelmed and dysregulated. In this zone:
                    </p>
                    <ul className="text-xs text-gray-600 list-disc pl-4">
                      <li>Learning becomes very difficult</li>
                      <li>Fight, flight, or freeze response is activated</li>
                      <li>You need immediate calming support</li>
                      <li>Safety becomes the priority</li>
                    </ul>
                  </Card>
                </div>
                
                {/* Quick strategies section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Quick Regulation Strategies</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <Card className="p-3 bg-green-50">
                      <h5 className="font-medium mb-1" style={{ color: ZONE_COLORS.green }}>For Yellow → Green</h5>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>5 deep belly breaths</li>
                        <li>Count backwards from 10</li>
                        <li>Stretch your body</li>
                        <li>Talk to a supportive person</li>
                      </ul>
                    </Card>
                    
                    <Card className="p-3 bg-red-50">
                      <h5 className="font-medium mb-1" style={{ color: ZONE_COLORS.red }}>For Red → Yellow</h5>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Use the 5-4-3-2-1 grounding technique</li>
                        <li>Find a quiet space</li>
                        <li>Drink cold water slowly</li>
                        <li>Ask for help</li>
                      </ul>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
            
            {/* No data message */}
            {logs.length === 0 && (
              <div className="text-center mt-6 p-4 bg-gray-50 rounded">
                <p className="text-gray-500">
                  No emotion data available yet. Log your emotions to see your stress zone patterns.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Teacher view shows current status of all children */}
      {user?.role === 'teacher' && !filters.userId && (
        <ChildZoneOverview />
      )}
    </div>
  );
};
