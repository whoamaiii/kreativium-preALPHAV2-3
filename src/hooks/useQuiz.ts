import { create } from 'zustand';

interface QuizState {
  score: number;
  currentQuestionIndex: number;
  answers: string[];
  addAnswer: (answer: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  resetQuiz: () => void;
}

export const useQuiz = create<QuizState>((set) => ({
  score: 0,
  currentQuestionIndex: 0,
  answers: [],

  addAnswer: (answer) => set((state) => {
    const newAnswers = [...state.answers];
    newAnswers[state.currentQuestionIndex] = answer;
    return { answers: newAnswers };
  }),

  nextQuestion: () => set((state) => ({
    currentQuestionIndex: state.currentQuestionIndex + 1,
  })),

  previousQuestion: () => set((state) => ({
    currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
  })),

  resetQuiz: () => set({
    score: 0,
    currentQuestionIndex: 0,
    answers: [],
  }),
}));