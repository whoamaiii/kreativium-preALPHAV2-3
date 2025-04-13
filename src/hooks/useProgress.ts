import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Progress {
  level: number;
  xp: number;
  stats: {
    totalQuestions: number;
    totalCorrect: number;
    streakDays: number;
    lastPlayed: string | null;
  };
}

interface ProgressStore {
  progress: Progress;
  updateProgress: (update: Partial<Progress>) => void;
}

const initialProgress: Progress = {
  level: 1,
  xp: 0,
  stats: {
    totalQuestions: 0,
    totalCorrect: 0,
    streakDays: 0,
    lastPlayed: null,
  },
};

export const useProgress = create<ProgressStore>()(
  persist(
    (set) => ({
      progress: initialProgress,
      updateProgress: (update) =>
        set((state) => {
          const newProgress = {
            ...state.progress,
            ...update,
          };

          // Level up check
          const newLevel = Math.floor(newProgress.xp / 400) + 1;
          if (newLevel > state.progress.level) {
            newProgress.level = newLevel;
          }

          return { progress: newProgress };
        }),
    }),
    {
      name: 'ask123-progress',
    }
  )
);