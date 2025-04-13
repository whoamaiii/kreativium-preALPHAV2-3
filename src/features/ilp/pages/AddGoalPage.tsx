import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GoalFormData, ILP } from '../types';
import GoalForm from '../components/GoalForm';
import { fetchILPById, addGoalToILP } from '../services/ilpDataService';

export const AddGoalPage: React.FC = () => {
  const { ilpId } = useParams<{ ilpId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ilp, setIlp] = useState<ILP | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadILP = async () => {
      if (!ilpId) return;
      
      try {
        setIsLoading(true);
        const data = await fetchILPById(ilpId);
        setIlp(data);
      } catch (err) {
        console.error('Error loading ILP:', err);
        setError(err instanceof Error ? err.message : 'Failed to load the ILP');
      } finally {
        setIsLoading(false);
      }
    };

    loadILP();
  }, [ilpId]);

  const handleSubmit = async (data: GoalFormData) => {
    if (!ilpId) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await addGoalToILP(ilpId, data);
      navigate(`/ilp/${ilpId}`);
    } catch (err) {
      console.error('Error adding goal:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while adding the goal');
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

  if (!ilp) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded" role="alert">
          <p>Learning Plan not found</p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/ilp')}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Learning Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Add New Goal</h1>
      <p className="text-gray-600 mb-6">Learning Plan: {ilp.title}</p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <GoalForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default AddGoalPage; 