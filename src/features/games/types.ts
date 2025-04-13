// Common types for both quiz and memory games
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameCategory = 'animals' | 'colors' | 'shapes' | 'numbers' | 'letters' | 'words' | 'custom';

// Quiz game types
export interface QuizQuestion {
  id: string;
  question: string;
  imageUrl?: string; // Optional image for visual questions
  audioUrl?: string; // Optional audio for auditory questions
  options: QuizOption[];
  correctOptionId: string;
  explanation?: string; // Optional explanation for the correct answer
  difficulty: Difficulty;
  category: GameCategory;
}

export interface QuizOption {
  id: string;
  text: string;
  imageUrl?: string; // Optional image for visual options
}

export interface QuizGameConfig {
  categoryId: GameCategory;
  difficulty?: Difficulty;
  questionCount: number;
  timeLimit?: number; // Time limit in seconds (optional)
  showExplanations: boolean;
}

export interface QuizResult {
  userId: string;
  gameId: string;
  categoryId: GameCategory;
  difficulty: Difficulty;
  date: string; // ISO date string
  score: number;
  maxScore: number;
  timeSpent: number; // Time spent in seconds
  questionsAnswered: QuestionAnswer[];
}

export interface QuestionAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpent: number; // Time spent on this question in seconds
}

// Memory game types
export interface MemoryCard {
  id: string;
  imageUrl: string;
  matchId: string; // ID that pairs with another card
  isFlipped: boolean;
  isMatched: boolean;
  category: GameCategory;
  difficulty: Difficulty;
}

export interface MemoryGameConfig {
  categoryId: GameCategory;
  difficulty?: Difficulty;
  gridSize: 4 | 6 | 8; // Dimensions of the grid (4x4, 6x6, 8x8)
  timeLimit?: number; // Time limit in seconds (optional)
}

export interface MemoryGameResult {
  userId: string;
  gameId: string;
  categoryId: GameCategory;
  difficulty: Difficulty;
  date: string; // ISO date string
  pairsMatched: number;
  totalPairs: number;
  moves: number;
  timeSpent: number; // Time spent in seconds
} 