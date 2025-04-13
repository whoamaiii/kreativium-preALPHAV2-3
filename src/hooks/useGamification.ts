import { useEffect, useState } from 'react';
import { useToast } from './useToast';

// Define achievement types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

// Define gamification state structure
interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  achievements: Achievement[];
}

// Predefined achievements
const defaultAchievements: Achievement[] = [
  {
    id: 'first_correct',
    name: '🎯 Første treffer!',
    description: 'Svarte riktig på ditt første spørsmål',
    unlocked: false,
  },
  {
    id: 'streak_3',
    name: '🔥 3 på rad!',
    description: 'Svarte riktig på 3 spørsmål på rad',
    unlocked: false,
  },
  {
    id: 'streak_5',
    name: '🔥🔥 5 på rad!',
    description: 'Svarte riktig på 5 spørsmål på rad',
    unlocked: false,
  },
  {
    id: 'streak_10',
    name: '🔥🔥🔥 10 på rad!',
    description: 'Svarte riktig på 10 spørsmål på rad',
    unlocked: false,
  },
  {
    id: 'level_5',
    name: '🏆 Nivå 5!',
    description: 'Nådde nivå 5',
    unlocked: false,
  },
  {
    id: 'level_10',
    name: '🏆🏆 Nivå 10!',
    description: 'Nådde nivå 10',
    unlocked: false,
  },
  {
    id: 'xp_1000',
    name: '💯 1000 XP!',
    description: 'Samlet 1000 XP totalt',
    unlocked: false,
  },
];

// Default initial state
const defaultState: GamificationState = {
  xp: 0,
  level: 1,
  streak: 0,
  achievements: defaultAchievements,
};

// LocalStorage key
const STORAGE_KEY = 'gamification';

export const useGamification = () => {
  const { addToast } = useToast();
  const [state, setState] = useState<GamificationState>(defaultState);
  
  // Calculate XP needed for next level (100 XP per level)
  const xpToNextLevel = state.level * 100;
  
  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        setState(JSON.parse(savedState));
      }
    } catch (error) {
      console.error('Error loading gamification state:', error);
    }
  }, []);
  
  // Save state to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving gamification state:', error);
    }
  }, [state]);
  
  // Register an answer and update state accordingly
  const registerAnswer = (isCorrect: boolean, points: number = 10) => {
    setState((prevState) => {
      // Create a new state object to work with
      const newState = { ...prevState };
      
      // Update streak
      if (isCorrect) {
        newState.streak = prevState.streak + 1;
      } else {
        newState.streak = 0;
      }
      
      // Update XP for correct answers
      if (isCorrect) {
        newState.xp = prevState.xp + points;
        
        // Check for level-up
        if (newState.xp >= xpToNextLevel) {
          // Calculate remaining XP after level-up
          const remainingXp = newState.xp - xpToNextLevel;
          newState.level = prevState.level + 1;
          newState.xp = remainingXp;
          
          // Show level-up toast
          addToast(`Nivå ${newState.level} oppnådd! 🎉`, 'success', 4000);
          
          // Check for level-based achievements
          checkLevelAchievements(newState);
        }
        
        // Check for streak-based achievements
        checkStreakAchievements(newState);
        
        // Check for XP-based achievements
        checkXpAchievements(newState);
        
        // Check for first correct answer
        if (!isAchievementUnlocked(prevState, 'first_correct')) {
          unlockAchievement(newState, 'first_correct');
        }
      }
      
      return newState;
    });
  };
  
  // Check and unlock streak-based achievements
  const checkStreakAchievements = (state: GamificationState) => {
    if (state.streak >= 3 && !isAchievementUnlocked(state, 'streak_3')) {
      unlockAchievement(state, 'streak_3');
    }
    
    if (state.streak >= 5 && !isAchievementUnlocked(state, 'streak_5')) {
      unlockAchievement(state, 'streak_5');
    }
    
    if (state.streak >= 10 && !isAchievementUnlocked(state, 'streak_10')) {
      unlockAchievement(state, 'streak_10');
    }
  };
  
  // Check and unlock level-based achievements
  const checkLevelAchievements = (state: GamificationState) => {
    if (state.level >= 5 && !isAchievementUnlocked(state, 'level_5')) {
      unlockAchievement(state, 'level_5');
    }
    
    if (state.level >= 10 && !isAchievementUnlocked(state, 'level_10')) {
      unlockAchievement(state, 'level_10');
    }
  };
  
  // Check and unlock XP-based achievements
  const checkXpAchievements = (state: GamificationState) => {
    const totalXp = (state.level - 1) * 100 + state.xp;
    
    if (totalXp >= 1000 && !isAchievementUnlocked(state, 'xp_1000')) {
      unlockAchievement(state, 'xp_1000');
    }
  };
  
  // Helper to check if an achievement is already unlocked
  const isAchievementUnlocked = (state: GamificationState, id: string) => {
    return state.achievements.some(a => a.id === id && a.unlocked);
  };
  
  // Unlock an achievement by ID
  const unlockAchievement = (state: GamificationState, id: string) => {
    const achievement = state.achievements.find(a => a.id === id);
    
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      addToast(`Achievement unlåst: ${achievement.name}`, 'success', 4000);
    }
  };
  
  // Manually unlock an achievement (for external use)
  const manuallyUnlockAchievement = (id: string) => {
    setState((prevState) => {
      const newState = { ...prevState };
      unlockAchievement(newState, id);
      return newState;
    });
  };
  
  // Calculate total XP (includes XP from previous levels)
  const calculateTotalXp = () => {
    return ((state.level - 1) * 100) + state.xp;
  };
  
  // Reset all gamification data
  const resetGamification = () => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
    addToast('Gamification-data er tilbakestilt', 'info');
  };
  
  return {
    xp: state.xp,
    level: state.level,
    streak: state.streak,
    xpToNextLevel,
    achievements: state.achievements,
    totalXp: calculateTotalXp(),
    registerAnswer,
    unlockAchievement: manuallyUnlockAchievement,
    resetGamification,
  };
};

export default useGamification; 