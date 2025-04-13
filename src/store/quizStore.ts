import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../lib/utils';
import { Question, QuizResult } from '../types';

interface QuizState {
  currentQuestion: number;
  score: number;
  answers: Record<number, string>;
  isComplete: boolean;
  showFeedback: boolean;
  isCorrect: boolean;
  streak: number;
  multiplier: number;
  questions: Question[];
  startTime: number | null;
  resultsHistory: QuizResult[];
  
  // Actions
  initQuiz: (questions: Question[]) => void;
  submitAnswer: (answer: string) => boolean;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeQuiz: () => QuizResult;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentQuestion: 0,
      score: 0,
      answers: {},
      isComplete: false,
      showFeedback: false,
      isCorrect: false,
      streak: 0,
      multiplier: 1,
      questions: [],
      startTime: null,
      resultsHistory: [],

      initQuiz: (questions) => {
        set({
          questions,
          currentQuestion: 0,
          score: 0,
          answers: {},
          isComplete: false,
          showFeedback: false,
          isCorrect: false,
          streak: 0,
          multiplier: 1,
          startTime: Date.now(),
        });
      },

      submitAnswer: (answer) => {
        const { currentQuestion, questions, streak } = get();
        const questionObj = questions[currentQuestion];
        const isCorrect = answer.toLowerCase() === questionObj.correctAnswer.toLowerCase();

        // Calculate points based on difficulty or default value
        const basePoints = questionObj.points || 10;
        const newStreak = isCorrect ? streak + 1 : 0;
        const newMultiplier = isCorrect ? Math.min(3, 1 + (newStreak * 0.25)) : 1;
        const earnedPoints = isCorrect ? Math.floor(basePoints * newMultiplier) : 0;

        set((state) => ({
          score: state.score + earnedPoints,
          streak: newStreak,
          multiplier: newMultiplier,
          isCorrect,
          showFeedback: true,
          answers: {
            ...state.answers,
            [currentQuestion]: answer,
          },
        }));

        return isCorrect;
      },

      nextQuestion: () => {
        const { currentQuestion, questions } = get();
        const isLastQuestion = currentQuestion === questions.length - 1;

        set({
          currentQuestion: isLastQuestion ? currentQuestion : currentQuestion + 1,
          showFeedback: false,
        });
      },

      previousQuestion: () => {
        set((state) => ({
          currentQuestion: Math.max(0, state.currentQuestion - 1),
          showFeedback: false,
        }));
      },

      completeQuiz: () => {
        const { questions, answers, score, startTime } = get();

        // Count correct answers
        const correctAnswers = Object.entries(answers).filter(([questionIdx, answer]) => {
          const question = questions[parseInt(questionIdx)];
          return question && answer.toLowerCase() === question.correctAnswer.toLowerCase();
        }).length;

        // Calculate time taken
        const endTime = Date.now();
        const timeTaken = startTime ? Math.floor((endTime - startTime) / 1000) : 0;

        // Create result object
        const result: QuizResult = {
          id: generateId(),
          categoryId: questions[0]?.category || '',
          date: new Date().toISOString(),
          score,
          questionsAnswered: Object.keys(answers).length,
          correctAnswers,
          timeTaken,
        };

        // Save to history and mark as complete
        set((state) => ({
          isComplete: true,
          resultsHistory: [result, ...state.resultsHistory].slice(0, 10), // Keep last 10 results
        }));

        return result;
      },

      resetQuiz: () => {
        set({
          currentQuestion: 0,
          score: 0,
          answers: {},
          isComplete: false,
          showFeedback: false,
          isCorrect: false,
          streak: 0,
          multiplier: 1,
          questions: [],
          startTime: null,
        });
      },
    }),
    {
      name: 'quiz-storage',
      partialize: (state) => ({
        resultsHistory: state.resultsHistory,
      }),
    }
  )
);