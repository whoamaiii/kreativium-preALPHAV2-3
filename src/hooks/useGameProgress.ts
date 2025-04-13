import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameProgress {
  quizHighScores: Record<string, number>;
  memoryHighScores: Record<string, number>;
  categoryProgress: Record<string, number>;
  updateQuizScore: (category: string, score: number) => void;
  updateMemoryScore: (category: string, score: number) => void;
  updateProgress: (category: string, progress: number) => void;
}

export const useGameProgress = create<GameProgress>()(
  persist(
    (set) => ({
      quizHighScores: {},
      memoryHighScores: {},
      categoryProgress: {},

      updateQuizScore: (category, score) => set((state) => ({
        quizHighScores: {
          ...state.quizHighScores,
          [category]: Math.max(score, state.quizHighScores[category] || 0)
        }
      })),

      updateMemoryScore: (category, score) => set((state) => ({
        memoryHighScores: {
          ...state.memoryHighScores,
          [category]: Math.max(score, state.memoryHighScores[category] || 0)
        }
      })),

      updateProgress: (category, progress) => set((state) => ({
        categoryProgress: {
          ...state.categoryProgress,
          [category]: Math.max(progress, state.categoryProgress[category] || 0)
        }
      }))
    }),
    {
      name: 'game-progress'
    }
  )
);