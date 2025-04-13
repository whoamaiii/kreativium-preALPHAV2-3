import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  theme: 'light' | 'dark' | 'system';
  updateSettings: (settings: Partial<Omit<GameSettings, 'updateSettings'>>) => void;
}

export const useGameSettings = create<GameSettings>()(
  persist(
    (set) => ({
      soundEnabled: true,
      musicEnabled: true,
      volume: 0.7,
      difficulty: 'medium',
      language: 'nb',
      theme: 'system',

      updateSettings: (newSettings) => set((state) => ({
        ...state,
        ...newSettings
      }))
    }),
    {
      name: 'game-settings'
    }
  )
);