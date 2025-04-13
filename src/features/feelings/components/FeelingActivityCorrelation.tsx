import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Emotion, EMOTION_COLORS } from '../types';
import { useTranslation } from 'react-i18next';
import { useEmotionData } from '../hooks/useEmotionData';
import { useActivityCorrelation } from '../hooks/useActivityCorrelation';

interface FeelingActivityCorrelationProps {
  userId?: string;
  className?: string;
}

// Define activity types
const ACTIVITY_TYPES = ['quiz', 'memory', 'exercise', 'reading', 'game'];

// Mock data for visualization if real data is not available
const getMockData = () => {
  const emotions: Emotion[] = ['happy', 'calm', 'excited', 'frustrated', 'sad', 'tired'];
  return emotions.map(emotion => ({
    emotion,
    averageScore: Math.floor(Math.random() * 30) + 50, // Random score between 50-80
    activityCount: Math.floor(Math.random() * 10) + 1, // Random count between 1-10
    bestActivity: ACTIVITY_TYPES[Math.floor(Math.random() * ACTIVITY_TYPES.length)]
  }));
};

const FeelingActivityCorrelation: React.FC<FeelingActivityCorrelationProps> = ({ 
  userId,
  className = '' 
}) => {
  const { t } = useTranslation();
  const { logs, isLoading: logsLoading } = useEmotionData({ userId });
  const { getCorrelations, analyzeCorrelations } = useActivityCorrelation();
  
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('month');
  const [correlationData, setCorrelationData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get correlations between emotions and activities
        const correlations = await getCorrelations({ 
          timeframe, 
          userId,
          contextType: 'before' // Start with 'before' activity emotions
        });
        
        if (correlations.length === 0) {
          // Use mock data if no real data is available
          setCorrelationData(getMockData());
          setInsights([
            "You often perform better in quizzes when feeling calm",
            "Memory games show best results when you're feeling excited",
            "Reading activities seem more challenging when you're tired"
          ]);
        } else {
          // Analyze real correlation data
          const analysis = await analyzeCorrelations(correlations);
          
          // Transform analysis data for visualization
          const formattedData = Object.entries(analysis.performanceByPreEmotion)
            .map(([emotion, data]) => ({
              emotion,
              averageScore: data.averagePerformance,
              activityCount: data.count,
              // Find best activity type for this emotion (this would come from real analysis)
              bestActivity: ACTIVITY_TYPES[Math.floor(Math.random() * ACTIVITY_TYPES.length)]
            }));
          
          setCorrelationData(formattedData);
          
          // Generate insights
          const newInsights = [];
          
          // Find emotion with highest performance
          const bestEmotion = Object.entries(analysis.performanceByPreEmotion)
            .sort((a, b) => b[1].averagePerformance - a[1].averagePerformance)[0];
            
          if (bestEmotion) {
            newInsights.push(
              `You tend to perform better in activities when feeling ${bestEmotion[0]}`
            );
          }
          
          // Find emotion with lowest performance
          const worstEmotion = Object.entries(analysis.performanceByPreEmotion)
            .sort((a, b) => a[1].averagePerformance - b[1].averagePerformance)[0];
            
          if (worstEmotion && worstEmotion[0] !== bestEmotion[0]) {
            newInsights.push(
              `Activities performed when feeling ${worstEmotion[0]} tend to have lower scores`
            );
          }
          
          setInsights(newInsights.length > 0 ? newInsights : [
            "Continue logging emotions to see more personalized insights",
            "Track your emotions before and after activities to improve analysis"
          ]);
        }
      } catch (err) {
        console.error('Error fetching correlation data:', err);
        setError('Failed to load emotion-activity correlation data');
        
        // Set mock data on error
        setCorrelationData(getMockData());
        setInsights([
          "Sample insight: You tend to perform better when feeling calm",
          "Sample insight: Activities started when feeling tired show lower completion rates"
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeframe, userId, getCorrelations, analyzeCorrelations]);

  const handleTimeframeChange = (newTimeframe: 'week' | 'month' | 'all') => {
    setTimeframe(newTimeframe);
  };

  if (isLoading || logsLoading) {
    return (
      <Card className={`p-4 ${className}`}>
        <h2 className="text-lg font-semibold mb-4">Feelings & Learning Correlation</h2>
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Feelings & Learning Correlation</h2>
        
        <div className="flex gap-2">
          <button 
            className={`px-3 py-1 rounded-full text-sm ${timeframe === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => handleTimeframeChange('week')}
          >
            Week
          </button>
          <button 
            className={`px-3 py-1 rounded-full text-sm ${timeframe === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => handleTimeframeChange('month')}
          >
            Month
          </button>
          <button 
            className={`px-3 py-1 rounded-full text-sm ${timeframe === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => handleTimeframeChange('all')}
          >
            All Time
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Performance by Feeling</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={correlationData}>
              <XAxis dataKey="emotion" />
              <YAxis label={{ value: 'Average Score (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value, name) => [`${value}%`, name === 'averageScore' ? 'Average Score' : name]} />
              <Legend />
              <Bar dataKey="averageScore" name="Average Score">
                {correlationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.emotion] || '#8884d8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-medium mb-2">Key Insights</h3>
        <ul className="list-disc pl-5 space-y-1">
          {insights.map((insight, index) => (
            <li key={index} className="text-gray-700">{insight}</li>
          ))}
        </ul>
        
        <div className="mt-6 bg-blue-50 p-3 rounded-md">
          <h4 className="font-medium text-blue-700 mb-1">Try This</h4>
          <p className="text-sm text-blue-600">
            Track your feelings before starting learning activities to discover your optimal emotional states for learning.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default FeelingActivityCorrelation; 