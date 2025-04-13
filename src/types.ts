export interface Question {
  id: number;
  category: string;
  text: string;
  imageUrl: string;
  correctAnswer: string;
  options: string[];  // Multiple choice options
  hint?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  points?: number;
  explanation?: string;  // Shown after answering
}

export interface GameState {
  score: number;
  currentQuestionIndex: number;
  showFeedback: boolean;
  isCorrect: boolean;
  streak: number;
  level: number;
  xp: number;
  dailyStreak: number;
  lastPlayed: string | null;
  comboMultiplier: number;
  unlockedCategories: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockLevel: number;
}

export interface Achievement {
  id: string;
  type: string;
  description: string;
  date: string;
}

// Add Quiz Result interface for local storage
export interface QuizResult {
  id: string;
  categoryId: string;
  date: string;
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  timeTaken: number; // In seconds
}