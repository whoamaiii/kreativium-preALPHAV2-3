import { 
  GameCategory, 
  Difficulty, 
  QuizQuestion, 
  QuizResult, 
  MemoryCard,
  MemoryGameResult
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

// Quiz Game Services

/**
 * Fetch quiz questions by category and difficulty
 */
export const fetchQuizQuestions = async (
  category: GameCategory,
  difficulty?: Difficulty,
  limit = 10
): Promise<QuizQuestion[]> => {
  const token = getUserAuthToken();
  const difficultyParam = difficulty ? `&difficulty=${difficulty}` : '';
  
  const response = await fetch(
    `${API_BASE_URL}/games/quiz/questions?category=${category}${difficultyParam}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to fetch quiz questions: ${response.statusText}`);
  }
  
  return await response.json() as QuizQuestion[];
};

/**
 * Save quiz game results
 */
export const saveQuizResult = async (result: QuizResult): Promise<void> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/games/quiz/results`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(result)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to save quiz result: ${response.statusText}`);
  }
};

/**
 * Fetch user's quiz game history
 */
export const fetchQuizHistory = async (userId: string): Promise<QuizResult[]> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/users/${userId}/games/quiz/history`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to fetch quiz history: ${response.statusText}`);
  }
  
  return await response.json() as QuizResult[];
};

// Memory Game Services

/**
 * Fetch memory cards by category and difficulty
 */
export const fetchMemoryCards = async (
  category: GameCategory,
  pairCount: number,
  difficulty?: Difficulty
): Promise<MemoryCard[]> => {
  const token = getUserAuthToken();
  const difficultyParam = difficulty ? `&difficulty=${difficulty}` : '';
  
  const response = await fetch(
    `${API_BASE_URL}/games/memory/cards?category=${category}&pairs=${pairCount}${difficultyParam}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to fetch memory cards: ${response.statusText}`);
  }
  
  return await response.json() as MemoryCard[];
};

/**
 * Save memory game results
 */
export const saveMemoryResult = async (result: MemoryGameResult): Promise<void> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/games/memory/results`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(result)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to save memory game result: ${response.statusText}`);
  }
};

/**
 * Fetch user's memory game history
 */
export const fetchMemoryHistory = async (userId: string): Promise<MemoryGameResult[]> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/users/${userId}/games/memory/history`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to fetch memory game history: ${response.statusText}`);
  }
  
  return await response.json() as MemoryGameResult[];
}; 