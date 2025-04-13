import { 
  AACSymbol, 
  AACBoard, 
  AACCategory, 
  AACPhrase, 
  AACSettings 
} from '../types';

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

// Symbols

/**
 * Fetch all AAC symbols (optionally filtered by category)
 */
export const getSymbols = async (category?: AACCategory): Promise<AACSymbol[]> => {
  const token = getUserAuthToken();
  
  let url = `${API_BASE_URL}/aac/symbols`;
  if (category) {
    url += `?category=${category}`;
  }
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to fetch symbols: ${response.statusText}`);
  }
  
  return await response.json() as AACSymbol[];
};

/**
 * Get a single symbol by ID
 */
export const getSymbolById = async (symbolId: string): Promise<AACSymbol> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/aac/symbols/${symbolId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to fetch symbol: ${response.statusText}`);
  }
  
  return await response.json() as AACSymbol;
};

/**
 * Create a custom symbol
 */
export const createSymbol = async (symbol: Omit<AACSymbol, 'id' | 'createdAt' | 'updatedAt'>): Promise<AACSymbol> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/aac/symbols`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(symbol)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to create symbol: ${response.statusText}`);
  }
  
  return await response.json() as AACSymbol;
};

/**
 * Update a symbol
 */
export const updateSymbol = async (
  symbolId: string,
  updates: Partial<Omit<AACSymbol, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<AACSymbol> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/aac/symbols/${symbolId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to update symbol: ${response.statusText}`);
  }
  
  return await response.json() as AACSymbol;
};

// Boards

/**
 * Get all boards for a user
 */
export const getUserBoards = async (userId: string): Promise<AACBoard[]> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/users/${userId}/aac/boards`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to fetch boards: ${response.statusText}`);
  }
  
  return await response.json() as AACBoard[];
};

/**
 * Get a single board by ID
 */
export const getBoardById = async (boardId: string): Promise<AACBoard> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/aac/boards/${boardId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to fetch board: ${response.statusText}`);
  }
  
  return await response.json() as AACBoard;
};

/**
 * Create a new board
 */
export const createBoard = async (
  board: Omit<AACBoard, 'id' | 'createdAt' | 'updatedAt'>
): Promise<AACBoard> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/aac/boards`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(board)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to create board: ${response.statusText}`);
  }
  
  return await response.json() as AACBoard;
};

/**
 * Update a board
 */
export const updateBoard = async (
  boardId: string,
  updates: Partial<Omit<AACBoard, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<AACBoard> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/aac/boards/${boardId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to update board: ${response.statusText}`);
  }
  
  return await response.json() as AACBoard;
};

/**
 * Delete a board
 */
export const deleteBoard = async (boardId: string): Promise<void> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/aac/boards/${boardId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to delete board: ${response.statusText}`);
  }
};

// Phrases

/**
 * Get recent phrases for a user
 */
export const getRecentPhrases = async (
  userId: string,
  limit = 10
): Promise<AACPhrase[]> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/users/${userId}/aac/phrases/recent?limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to fetch recent phrases: ${response.statusText}`);
  }
  
  return await response.json() as AACPhrase[];
};

/**
 * Save a phrase
 */
export const savePhrase = async (phrase: Omit<AACPhrase, 'id' | 'createdAt'>): Promise<AACPhrase> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/users/${phrase.userId}/aac/phrases`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(phrase)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to save phrase: ${response.statusText}`);
  }
  
  return await response.json() as AACPhrase;
};

// Settings

/**
 * Get AAC settings for a user
 */
export const getAACSettings = async (userId: string): Promise<AACSettings> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/users/${userId}/aac/settings`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to fetch AAC settings: ${response.statusText}`);
  }
  
  return await response.json() as AACSettings;
};

/**
 * Update AAC settings
 */
export const updateAACSettings = async (
  userId: string,
  settings: Partial<Omit<AACSettings, 'userId'>>
): Promise<AACSettings> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/users/${userId}/aac/settings`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(settings)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to update AAC settings: ${response.statusText}`);
  }
  
  return await response.json() as AACSettings;
}; 