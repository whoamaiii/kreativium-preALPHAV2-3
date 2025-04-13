import { FeelingEntry, FeelingStats, FeelingTrend, FeelingType } from '../types';

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
 * Create a new feeling entry
 */
export const createFeelingEntry = async (entry: Omit<FeelingEntry, 'id'>): Promise<FeelingEntry> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/users/${entry.userId}/feelings`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entry)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to create feeling entry: ${response.statusText}`);
  }
  
  return await response.json() as FeelingEntry;
};

/**
 * Get feeling entries for a user within a date range
 */
export const getFeelingEntries = async (
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<FeelingEntry[]> => {
  const token = getUserAuthToken();
  
  let url = `${API_BASE_URL}/users/${userId}/feelings`;
  const params = new URLSearchParams();
  
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to get feeling entries: ${response.statusText}`);
  }
  
  return await response.json() as FeelingEntry[];
};

/**
 * Get a single feeling entry by ID
 */
export const getFeelingEntryById = async (
  userId: string,
  entryId: string
): Promise<FeelingEntry> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/users/${userId}/feelings/${entryId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to get feeling entry: ${response.statusText}`);
  }
  
  return await response.json() as FeelingEntry;
};

/**
 * Update a feeling entry
 */
export const updateFeelingEntry = async (
  userId: string,
  entryId: string,
  updates: Partial<Omit<FeelingEntry, 'id' | 'userId'>>
): Promise<FeelingEntry> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/users/${userId}/feelings/${entryId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to update feeling entry: ${response.statusText}`);
  }
  
  return await response.json() as FeelingEntry;
};

/**
 * Delete a feeling entry
 */
export const deleteFeelingEntry = async (
  userId: string,
  entryId: string
): Promise<void> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/users/${userId}/feelings/${entryId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to delete feeling entry: ${response.statusText}`);
  }
};

/**
 * Get feeling statistics for a user within a date range
 */
export const getFeelingStats = async (
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<FeelingStats> => {
  const token = getUserAuthToken();
  
  let url = `${API_BASE_URL}/users/${userId}/feelings/stats`;
  const params = new URLSearchParams();
  
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to get feeling stats: ${response.statusText}`);
  }
  
  return await response.json() as FeelingStats;
};

/**
 * Get feeling trends for a user within a date range
 */
export const getFeelingTrends = async (
  userId: string,
  feelings?: FeelingType[],
  startDate?: string,
  endDate?: string
): Promise<FeelingTrend[]> => {
  const token = getUserAuthToken();
  
  let url = `${API_BASE_URL}/users/${userId}/feelings/trends`;
  const params = new URLSearchParams();
  
  if (feelings && feelings.length > 0) {
    feelings.forEach(feeling => params.append('feeling', feeling));
  }
  
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to get feeling trends: ${response.statusText}`);
  }
  
  return await response.json() as FeelingTrend[];
}; 