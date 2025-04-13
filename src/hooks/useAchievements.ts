import { useState, useCallback } from 'react';
import { Achievement } from '../types';
import { useSound } from './useSound';

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('achievements');
    return saved ? JSON.parse(saved) : [];
  });

  const { playSound } = useSound();

  const addAchievement = useCallback((type: string, description: string) => {
    const achievement: Achievement = {
      id: `${type}-${Date.now()}`,
      type,
      description,
      date: new Date().toISOString(),
    };

    setAchievements(prev => {
      const newAchievements = [...prev, achievement];
      localStorage.setItem('achievements', JSON.stringify(newAchievements));
      return newAchievements;
    });

    playSound('achievement');
  }, []);

  return { achievements, addAchievement };
}