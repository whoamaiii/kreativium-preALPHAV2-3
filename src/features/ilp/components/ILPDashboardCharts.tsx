import React, { useMemo } from 'react';
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell,
  ResponsiveContainer, 
  XAxis, YAxis, 
  Tooltip, 
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  CartesianGrid
} from 'recharts';
import { ILPGoal, Skill } from '../types';
import { Card } from '../../../components/ui/Card';

interface ILPDashboardChartsProps {
  goals: ILPGoal[];
  className?: string;
}

// Skill names for chart display
const SKILL_NAMES: Record<Skill, string> = {
  'reading': 'Reading',
  'math': 'Math',
  'social': 'Social Skills',
  'motor': 'Motor Skills',
  'language': 'Language',
  'cognitive': 'Cognitive',
  'emotional': 'Emotional'
};

// Color palette for charts
const CHART_COLORS = [
  '#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', 
  '#a4de6c', '#d0ed57', '#ffc658', '#ff8042'
];

export const ILPDashboardCharts: React.FC<ILPDashboardChartsProps> = ({ 
  goals,
  className = '' 
}) => {
  // Calculate data for skill progress chart
  const skillProgressData = useMemo(() => {
    // Group goals by skill and calculate average progress
    const skillGoals: Record<Skill, ILPGoal[]> = {} as Record<Skill, ILPGoal[]>;
    
    goals.forEach(goal => {
      if (!skillGoals[goal.skill]) {
        skillGoals[goal.skill] = [];
      }
      skillGoals[goal.skill].push(goal);
    });
    
    return Object.entries(skillGoals).map(([skill, goalsForSkill]) => {
      const averageProgress = goalsForSkill.reduce((sum, goal) => sum + (goal.progress || 0), 0) / goalsForSkill.length;
      return {
        name: SKILL_NAMES[skill as Skill],
        progress: Math.round(averageProgress),
        goals: goalsForSkill.length
      };
    }).sort((a, b) => b.progress - a.progress); // Sort by progress descending
  }, [goals]);
  
  // Calculate data for status distribution chart
  const statusDistributionData = useMemo(() => {
    const statusCounts = {
      pending: 0,
      'in-progress': 0,
      completed: 0
    };
    
    goals.forEach(goal => {
      statusCounts[goal.status]++;
    });
    
    return [
      { name: 'Pending', value: statusCounts.pending, color: '#ffc658' },
      { name: 'In Progress', value: statusCounts['in-progress'], color: '#8884d8' },
      { name: 'Completed', value: statusCounts.completed, color: '#82ca9d' }
    ].filter(item => item.value > 0); // Only include statuses with at least one goal
  }, [goals]);

  // Calculate radar data for skills coverage
  const skillsCoverageData = useMemo(() => {
    const counts: Record<string, number> = {};
    const allSkills: Skill[] = ['reading', 'math', 'social', 'motor', 'language', 'cognitive', 'emotional'];
    
    allSkills.forEach(skill => {
      counts[skill] = goals.filter(goal => goal.skill === skill).length;
    });
    
    return allSkills.map(skill => ({
      subject: SKILL_NAMES[skill],
      count: counts[skill],
      fullMark: Math.max(...Object.values(counts)) + 1
    }));
  }, [goals]);

  // Calculate overall progress
  const averageProgress = useMemo(() => {
    if (goals.length === 0) return 0;
    const sum = goals.reduce((acc, goal) => acc + (goal.progress || 0), 0);
    return Math.round(sum / goals.length);
  }, [goals]);
  
  // We need enough goals to make the charts meaningful
  const hasEnoughData = goals.length >= 2;
  
  if (!hasEnoughData) {
    return (
      <div className={`p-6 bg-gray-50 rounded-lg text-center ${className}`}>
        <p className="text-gray-600">
          Not enough data to display charts. Add more goals to see visualizations.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Average Progress: {averageProgress}%
        </p>
      </div>
    );
  }
  
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 md:col-span-3">
          <h3 className="text-lg font-semibold mb-2">Overall Progress</h3>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-4 mr-4">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{ width: `${averageProgress}%` }}
              />
            </div>
            <span className="text-xl font-bold">{averageProgress}%</span>
          </div>
        </Card>
      </div>

      {/* Progress by Skill */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Progress by Skill</h3>
        <div className="bg-white rounded-lg" style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={skillProgressData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Progress']} 
                labelFormatter={(name) => `Skill: ${name}`}
              />
              <Legend />
              <Bar 
                dataKey="progress" 
                name="Average Progress" 
                fill="#8884d8" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Goal Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Goal Status Distribution</h3>
          <div className="bg-white rounded-lg" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Goals']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Skills Coverage Radar */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Skills Coverage</h3>
          <div className="bg-white rounded-lg" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsCoverageData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar 
                  name="Goals" 
                  dataKey="count" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6} 
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ILPDashboardCharts; 