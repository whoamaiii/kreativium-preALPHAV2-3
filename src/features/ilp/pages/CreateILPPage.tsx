import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ILPFormData } from '../types';
import ILPForm from '../components/ILPForm';
import { createILP } from '../services/ilpDataService';

// This component assumes there's a way to get the current user's ID
// from an existing authentication system
const getCurrentUserId = (): string => {
  // This should be replaced with a proper implementation that gets the user ID
  // from your existing auth mechanism (e.g., context, localStorage, etc.)
  return localStorage.getItem('userId') || '';
};

export const CreateILPPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ILPFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error('You must be logged in to create an ILP');
      }
      
      const newILP = await createILP(userId, data);
      navigate(`/ilp/${newILP.id}`);
    } catch (err) {
      console.error('Error creating ILP:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while creating the ILP');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Learning Plan</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <ILPForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
};

export default CreateILPPage; 