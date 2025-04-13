import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GoalFormData, ILPGoal } from '../types';
import GoalForm from '../components/GoalForm';
import { fetchILPById, updateGoal } from '../services/ilpDataService';

export const EditGoalPage: React.FC = () => {
  const { ilpId, goalId } = useParams<{ ilpId: string; goalId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [goal, setGoal] = useState<ILPGoal | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoal = async () => {
      if (!ilpId || !goalId) return;
      
      try {
        setIsLoading(true);
        const ilp = await fetchILPById(ilpId);
        
        // Find the goal in the ILP
        const foundGoal = ilp.goals?.find(g => g.id === goalId);
        if (!foundGoal) {
          throw new Error('Goal not found');
        }
        
        setGoal(foundGoal);
      } catch (err) {
        console.error('Error loading goal:', err);
        setError(err instanceof Error ? err.message : 'Failed to load the goal');
      } finally {
        setIsLoading(false);
      }
    };

    loadGoal();
  }, [ilpId, goalId]);

  const handleSubmit = async (data: GoalFormData) => {
    if (!goalId) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await updateGoal(goalId, data);
      navigate(`/ilp/${ilpId}`);
    } catch (err) {
      console.error('Error updating goal:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while updating the goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate(`/ilp/${ilpId}`)}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Learning Plan
          </button>
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded" role="alert">
          <p>Goal not found</p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate(`/ilp/${ilpId}`)}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Learning Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Goal</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <GoalForm 
          onSubmit={handleSubmit}
          initialData={goal}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditGoalPage; 