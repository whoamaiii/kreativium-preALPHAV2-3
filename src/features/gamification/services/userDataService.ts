import { UserXP, XPEvent, Badge } from '../types';

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
 * Award XP to a user and return updated XP and level
 */
export const awardXP = async (
  userId: string, 
  xpAmount: number, 
  eventType: XPEvent['type'],
  metadata?: Record<string, unknown>
): Promise<{ updatedXp: number; updatedLevel: number }> => {
  const token = getUserAuthToken();
  const response = await fetch(`${API_BASE_URL}/users/${userId}/award-xp`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      amount: xpAmount,
      eventType,
      metadata,
      timestamp: new Date().toISOString()
    }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to award user XP: ${response.statusText}`);
  }
  
  return await response.json();
};

/**
 * Update user XP and level
 */
export const updateUserXP = async (userId: string, newXp: number, newLevel: number): Promise<void> => {
  const token = getUserAuthToken();
  const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ xp: newXp, level: newLevel }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to update user XP: ${response.statusText}`);
  }
};

/**
 * Get user XP and level information
 */
export const getUserXP = async (userId: string): Promise<UserXP> => {
  const token = getUserAuthToken();
  const response = await fetch(`${API_BASE_URL}/users/${userId}/xp`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to get user XP: ${response.statusText}`);
  }
  
  return await response.json() as UserXP;
};

/**
 * Record an XP event
 */
export const recordXPEvent = async (event: Omit<XPEvent, 'timestamp'>): Promise<void> => {
  const token = getUserAuthToken();
  const timestamp = new Date().toISOString();
  
  const response = await fetch(`${API_BASE_URL}/users/${event.userId}/xp/events`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...event, timestamp }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to record XP event: ${response.statusText}`);
  }
};

/**
 * Get user badges
 */
export const getUserBadges = async (userId: string): Promise<Badge[]> => {
  const token = getUserAuthToken();
  const response = await fetch(`${API_BASE_URL}/users/${userId}/badges`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to get user badges: ${response.statusText}`);
  }
  
  return await response.json() as Badge[];
}; 