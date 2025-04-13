import { useState, useEffect } from 'react';

interface Stats {
  totalAnswers: number;
  correctAnswers: number;
  timeSpent: number;
  lastPlayed: string;
  streakRecord: number;
  categoryProgress: Record<string, number>;
}

const DEFAULT_STATS: Stats = {
  totalAnswers: 0,
  correctAnswers: 0,
  timeSpent: 0,
  lastPlayed: new Date().toISOString(),
  streakRecord: 0,
  categoryProgress: {},
};

export function useStats() {
  const [stats, setStats] = useState<Stats>(() => {
    const saved = localStorage.getItem('gameStats');
    return saved ? JSON.parse(saved) : DEFAULT_STATS;
  });

  useEffect(() => {
    localStorage.setItem('gameStats', JSON.stringify(stats));
  }, [stats]);

  const updateStats = (update: Partial<Stats>) => {
    setStats(prev => ({
      ...prev,
      ...update,
      lastPlayed: new Date().toISOString(),
    }));
  };

  return { stats, updateStats };
}