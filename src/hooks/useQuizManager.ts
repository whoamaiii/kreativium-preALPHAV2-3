import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Question } from '../types';

interface QuizStore {
  questions: Question[];
  settings: {
    timer: boolean;
    timerDuration: number;
    sound: boolean;
    volume: number;
    theme: 'light' | 'dark' | 'system';
    difficulty: 'easy' | 'medium' | 'hard';
  };
  addQuestion: (question: Question) => void;
  updateQuestion: (question: Question) => void;
  deleteQuestion: (id: number) => void;
  updateSettings: (settings: Partial<QuizStore['settings']>) => void;
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set) => ({
      questions: [],
      settings: {
        timer: false,
        timerDuration: 30,
        sound: true,
        volume: 0.5,
        theme: 'system',
        difficulty: 'medium',
      },
      addQuestion: (question) =>
        set((state) => ({
          questions: [...state.questions, { ...question, id: Date.now() }],
        })),
      updateQuestion: (question) =>
        set((state) => ({
          questions: state.questions.map((q) =>
            q.id === question.id ? question : q
          ),
        })),
      deleteQuestion: (id) =>
        set((state) => ({
          questions: state.questions.filter((q) => q.id !== id),
        })),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'quiz-store',
    }
  )
);

export function useQuizManager() {
  const store = useQuizStore();

  return {
    questions: store.questions,
    settings: store.settings,
    addQuestion: store.addQuestion,
    updateQuestion: store.updateQuestion,
    deleteQuestion: store.deleteQuestion,
    updateSettings: store.updateSettings,
  };
}