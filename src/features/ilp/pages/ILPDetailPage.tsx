import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ILP, ILPGoal } from '../types';
import GoalDetail from '../components/GoalDetail';
import ILPDashboardCharts from '../components/ILPDashboardCharts';
import { fetchILPById } from '../services/ilpDataService';
import { PlusCircle, ArrowLeft, BarChart2, List } from 'lucide-react';
import { cn } from '../../../utils/cn';

// View mode options
type ViewMode = 'list' | 'dashboard';

export const ILPDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [ilp, setIlp] = useState<ILP | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    const loadILP = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await fetchILPById(id);
        setIlp(data);
      } catch (err) {
        console.error('Error loading ILP:', err);
        setError(err instanceof Error ? err.message : 'Failed to load the learning plan');
      } finally {
        setIsLoading(false);
      }
    };

    loadILP();
  }, [id]);

  // Handler for goal updates
  const handleGoalUpdated = (updatedGoal: ILPGoal) => {
    if (!ilp || !ilp.goals) return;
    
    const updatedGoals = ilp.goals.map(goal => 
      goal.id === updatedGoal.id ? updatedGoal : goal
    );
    
    setIlp({
      ...ilp,
      goals: updatedGoals
    });
  };

  // Overall ILP progress calculation
  const calculateOverallProgress = (): number => {
    if (!ilp?.goals?.length) return 0;
    
    const totalGoals = ilp.goals.length;
    const progressSum = ilp.goals.reduce((sum, goal) => sum + (goal.progress || 0), 0);
    
    return Math.round(progressSum / totalGoals);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/ilp')}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            Back to Learning Plans
          </button>
        </div>
      </div>
    );
  }

  if (!ilp) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded" role="alert">
          <p>Learning Plan not found</p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/ilp')}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            Back to Learning Plans
          </button>
        </div>
      </div>
    );
  }

  const overallProgress = calculateOverallProgress();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/ilp"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-4"
        >
          <ArrowLeft size={16} />
          Back to Learning Plans
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{ilp.title}</h1>
            <p className="text-gray-600 mt-1">
              Created: {new Date(ilp.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Link
              to={`/ilp/${ilp.id}/edit`}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Edit Plan
            </Link>
            <Link
              to={`/ilp/${ilp.id}/goals/new`}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
            >
              <PlusCircle size={16} />
              Add Goal
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
        <h2 className="text-lg font-semibold mb-3">Overall Progress</h2>
        <div className="h-4 bg-gray-200 rounded-full">
          <div 
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              overallProgress >= 75 ? 'bg-green-500' : 
              overallProgress >= 50 ? 'bg-yellow-500' : 
              overallProgress >= 25 ? 'bg-orange-500' : 
              'bg-red-500'
            }`}
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-sm font-medium text-gray-700">{overallProgress}% Complete</span>
        </div>
      </div>
      
      {/* View mode selector */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Goals</h2>
        
        <div className="flex p-1 bg-gray-100 rounded-md">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors',
              viewMode === 'list' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <List size={16} />
            List View
          </button>
          <button
            onClick={() => setViewMode('dashboard')}
            className={cn(
              'flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors',
              viewMode === 'dashboard' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <BarChart2 size={16} />
            Dashboard
          </button>
        </div>
      </div>
      
      {/* Content based on view mode */}
      {ilp.goals && ilp.goals.length > 0 ? (
        viewMode === 'list' ? (
          <div className="space-y-6">
            {ilp.goals.map(goal => (
              <GoalDetail 
                key={goal.id} 
                goal={goal} 
                onGoalUpdated={handleGoalUpdated}
              />
            ))}
          </div>
        ) : (
          <ILPDashboardCharts goals={ilp.goals} />
        )
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">No goals have been added to this learning plan yet.</p>
          <Link
            to={`/ilp/${ilp.id}/goals/new`}
            className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusCircle size={16} />
            Add Your First Goal
          </Link>
        </div>
      )}
    </div>
  );
};

export default ILPDetailPage; 