import { ILP, ILPGoal, ILPFormData, GoalFormData, GoalStatus, Skill, ActivityType } from '../types';

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

/**
 * Create a new ILP for a user
 */
export const createILP = async (userId: string, ilpData: ILPFormData): Promise<ILP> => {
  const token = getUserAuthToken();
  const response = await fetch(`${API_BASE_URL}/users/${userId}/ilps`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ilpData)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to create ILP: ${response.statusText}`);
  }
  
  return await response.json() as ILP;
};

/**
 * Update an existing ILP
 */
export const updateILP = async (ilpId: string, ilpData: Partial<ILPFormData>): Promise<ILP> => {
  const token = getUserAuthToken();
  const response = await fetch(`${API_BASE_URL}/ilps/${ilpId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ilpData)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to update ILP: ${response.statusText}`);
  }
  
  return await response.json() as ILP;
};

/**
 * Delete an ILP
 */
export const deleteILP = async (ilpId: string): Promise<void> => {
  const token = getUserAuthToken();
  const response = await fetch(`${API_BASE_URL}/ilps/${ilpId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to delete ILP: ${response.statusText}`);
  }
};

/**
 * Add a goal to an ILP
 */
export const addGoalToILP = async (ilpId: string, goalData: GoalFormData): Promise<ILPGoal> => {
  const token = getUserAuthToken();
  const response = await fetch(`${API_BASE_URL}/ilps/${ilpId}/goals`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(goalData)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to add goal: ${response.statusText}`);
  }
  
  return await response.json() as ILPGoal;
};

/**
 * Update a goal
 */
export const updateGoal = async (goalId: string, goalData: Partial<GoalFormData>): Promise<ILPGoal> => {
  const token = getUserAuthToken();
  const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(goalData)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to update goal: ${response.statusText}`);
  }
  
  return await response.json() as ILPGoal;
};

/**
 * Delete a goal
 */
export const deleteGoal = async (goalId: string): Promise<void> => {
  const token = getUserAuthToken();
  const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to delete goal: ${response.statusText}`);
  }
};

/**
 * Record activity completion for a goal and update progress
 */
export const recordActivityCompletionForGoal = async (
  goalId: string, 
  activityData: { 
    activityId: string; 
    activityType: ActivityType;
    score?: number; // Optional score if the activity has scoring
  }
): Promise<ILPGoal> => {
  const token = getUserAuthToken();
  const response = await fetch(`${API_BASE_URL}/goals/${goalId}/activities`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...activityData,
      completedAt: new Date().toISOString()
    })
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to record activity completion: ${response.statusText}`);
  }
  
  return await response.json() as ILPGoal;
};

/**
 * Update goal progress directly
 */
export const updateGoalProgress = async (
  goalId: string, 
  progressData: { 
    progress?: number; 
    assessmentNotes?: string;
  }
): Promise<ILPGoal> => {
  const token = getUserAuthToken();
  const response = await fetch(`${API_BASE_URL}/goals/${goalId}/progress`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...progressData,
      lastUpdated: new Date().toISOString()
    })
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to update goal progress: ${response.statusText}`);
  }
  
  return await response.json() as ILPGoal;
}; 