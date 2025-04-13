import { useState, useCallback, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Question } from '../types';
import { questions } from '../data/questions';
import { useAchievements } from './useAchievements';
import { useSound } from './useSound';

const XP_PER_CORRECT = 15;
const XP_PER_LEVEL = 400;
const COMBO_THRESHOLD = 3;
const COMBO_MULTIPLIER = 1.5;

interface GameStore {
  state: GameState;
  currentCategory: string | null;
  customQuestions: Question[];
  setCategory: (category: string) => void;
  setCustomQuestions: (questions: Question[]) => void;
  checkAnswer: (answer: string) => boolean;
  nextQuestion: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      state: {
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
        volume: 0.7,
      },
      currentCategory: null,
      customQuestions: [],

      setCategory: (category) => {
        set({ currentCategory: category });
      },

      setCustomQuestions: (questions) => {
        set({ customQuestions: questions });
      },

      checkAnswer: (answer) => {
        const { state, currentCategory, customQuestions } = get();
        const currentQuestions = currentCategory
          ? questions.filter(q => q.category === currentCategory)
          : customQuestions.length > 0
          ? customQuestions
          : questions;

        const currentQuestion = currentQuestions[state.currentQuestionIndex];
        const isCorrect = answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();

        let xpGained = 0;
        let newComboMultiplier = state.comboMultiplier;

        if (isCorrect) {
          if (state.streak >= COMBO_THRESHOLD) {
            newComboMultiplier = COMBO_MULTIPLIER;
            xpGained = Math.round(XP_PER_CORRECT * newComboMultiplier);
          } else {
            xpGained = XP_PER_CORRECT;
          }
        } else {
          newComboMultiplier = 1;
        }

        set({
          state: {
            ...state,
            score: state.score + xpGained,
            isCorrect,
            showFeedback: true,
            streak: isCorrect ? state.streak + 1 : 0,
            xp: state.xp + xpGained,
            comboMultiplier: newComboMultiplier,
          },
        });

        return isCorrect;
      },

      nextQuestion: () => {
        const { state, currentCategory, customQuestions } = get();
        const currentQuestions = currentCategory
          ? questions.filter(q => q.category === currentCategory)
          : customQuestions.length > 0
          ? customQuestions
          : questions;

        set({
          state: {
            ...state,
            currentQuestionIndex: (state.currentQuestionIndex + 1) % currentQuestions.length,
            showFeedback: false,
          },
        });
      },

      resetGame: () => {
        set({
          state: {
            ...get().state,
            currentQuestionIndex: 0,
            showFeedback: false,
            isCorrect: false,
            streak: 0,
            comboMultiplier: 1,
          },
        });
      },
    }),
    {
      name: 'game-storage',
      partialize: (state) => ({
        state: {
          score: state.state.score,
          level: state.state.level,
          xp: state.state.xp,
          dailyStreak: state.state.dailyStreak,
          lastPlayed: state.state.lastPlayed,
          unlockedCategories: state.state.unlockedCategories,
        },
      }),
    }
  )
);

export function useGameState() {
  const store = useGameStore();
  const { addAchievement } = useAchievements();
  const { playSound } = useSound();

  // Check level up
  useEffect(() => {
    const currentLevel = Math.floor(store.state.xp / XP_PER_LEVEL);
    if (currentLevel > store.state.level) {
      playSound('levelUp');
      addAchievement('level', `Reached Level ${currentLevel}!`);
      
      // Unlock categories based on level
      const newUnlockedCategories = [...store.state.unlockedCategories];
      if (currentLevel >= 2 && !newUnlockedCategories.includes('animals')) {
        newUnlockedCategories.push('animals');
      }
      if (currentLevel >= 3 && !newUnlockedCategories.includes('mystery')) {
        newUnlockedCategories.push('mystery');
      }
      
      store.state.level = currentLevel;
      store.state.unlockedCategories = newUnlockedCategories;
    }
  }, [store.state.xp]);

  // Check daily streak
  useEffect(() => {
    const now = new Date();
    const lastPlayed = store.state.lastPlayed ? new Date(store.state.lastPlayed) : null;
    
    if (!lastPlayed) {
      store.state.lastPlayed = now.toISOString();
    } else {
      const daysDiff = Math.floor((now.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        store.state.dailyStreak += 1;
        store.state.lastPlayed = now.toISOString();
        addAchievement('streak', `${store.state.dailyStreak} Day Streak!`);
      } else if (daysDiff > 1) {
        store.state.dailyStreak = 1;
        store.state.lastPlayed = now.toISOString();
      }
    }
  }, []);

  return {
    state: store.state,
    currentQuestion: store.currentCategory
      ? questions.filter(q => q.category === store.currentCategory)[store.state.currentQuestionIndex]
      : store.customQuestions.length > 0
      ? store.customQuestions[store.state.currentQuestionIndex]
      : questions[store.state.currentQuestionIndex],
    setCategory: store.setCategory,
    setCustomQuestions: store.setCustomQuestions,
    checkAnswer: store.checkAnswer,
    nextQuestion: store.nextQuestion,
    resetGame: store.resetGame,
  };
}