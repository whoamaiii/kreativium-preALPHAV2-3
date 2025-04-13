import { ILP, ILPGoal } from '../types';

// This service integrates with the existing backend API
// Assuming there's an existing auth mechanism that provides tokens

// Function to get the auth token from wherever it's stored in the existing app
const getUserAuthToken = (): string => {
  // This should be replaced with the actual method to get the auth token
  // For example, from localStorage, a context, or a state management solution
  return localStorage.getItem('authToken') || '';
};

// Base API URL - should be replaced with the actual API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Fetch all ILPs for a specific user
 */
export const fetchUserILPs = async (userId: string): Promise<ILP[]> => {
  const token = getUserAuthToken();
  const response = await fetch(`${API_BASE_URL}/users/${userId}/ilps`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to fetch ILPs: ${response.statusText}`);
  }
  
  return await response.json() as ILP[];
};

/**
 * Fetch a single ILP by ID
 */
export const fetchILPById = async (ilpId: string): Promise<ILP> => {
  const token = getUserAuthToken();
  const response = await fetch(`${API_BASE_URL}/ilps/${ilpId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to fetch ILP: ${response.statusText}`);
  }
  
  return await response.json() as ILP;
};

/**
 * Fetch all goals for a specific ILP
 */
export const fetchGoalsForILP = async (ilpId: string): Promise<ILPGoal[]> => {
  const token = getUserAuthToken();
  const response = await fetch(`${API_BASE_URL}/ilps/${ilpId}/goals`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to fetch goals: ${response.statusText}`);
  }
  
  return await response.json() as ILPGoal[];
}; 