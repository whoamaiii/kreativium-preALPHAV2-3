import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  score: number;
  highScores: Record<string, number>;
  categoryProgress: Record<string, number>;
  updateScore: (category: string, score: number) => void;
  updateProgress: (category: string, progress: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      score: 0,
      highScores: {},
      categoryProgress: {},

      updateScore: (category, score) => set((state) => ({
        score: state.score + score,
        highScores: {
          ...state.highScores,
          [category]: Math.max(score, state.highScores[category] || 0)
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
      name: 'game-storage'
    }
  )
);