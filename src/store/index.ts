import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Question, UserSettings } from '../types';

interface Store {
  gameState: GameState;
  settings: UserSettings;
  customQuestions: Question[];
  setGameState: (state: Partial<GameState>) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  addCustomQuestion: (question: Question) => void;
  removeCustomQuestion: (id: number) => void;
  resetGame: () => void;
}

const initialGameState: GameState = {
  score: 0,
  currentQuestionIndex: 0,
  showFeedback: false,
  isCorrect: false,
  streak: 0,
  level: 0,
  xp: 0,
  dailyStreak: 0,
  lastPlayed: null,
  comboMultiplier: 1,
  unlockedCategories: ['general'],
  difficulty: 'medium',
  soundEnabled: true,
  volume: 0.5,
};

const initialSettings: UserSettings = {
  soundEnabled: true,
  volume: 0.5,
  theme: 'system',
  difficulty: 'medium',
  language: 'nb',
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      gameState: initialGameState,
      settings: initialSettings,
      customQuestions: [],

      setGameState: (newState) =>
        set((state) => ({
          gameState: { ...state.gameState, ...newState },
        })),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      addCustomQuestion: (question) =>
        set((state) => ({
          customQuestions: [...state.customQuestions, question],
        })),

      removeCustomQuestion: (id) =>
        set((state) => ({
          customQuestions: state.customQuestions.filter((q) => q.id !== id),
        })),

      resetGame: () =>
        set(() => ({
          gameState: initialGameState,
        })),
    }),
    {
      name: 'ask123-storage',
      partialize: (state) => ({
        gameState: state.gameState,
        settings: state.settings,
        customQuestions: state.customQuestions,
      }),
    }
  )
);