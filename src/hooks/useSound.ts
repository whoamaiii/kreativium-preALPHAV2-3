import { useCallback } from 'react';
import { useGameSettings } from './useGameSettings';

const sounds = {
  flip: '/sounds/flip.mp3',
  match: '/sounds/match.mp3',
  complete: '/sounds/complete.mp3',
  wrong: '/sounds/wrong.mp3'
};

export function useSound() {
  const { soundEnabled, volume } = useGameSettings();

  const playSound = useCallback((soundName: keyof typeof sounds) => {
    if (!soundEnabled) return;

    const audio = new Audio(sounds[soundName]);
    audio.volume = volume;
    audio.play().catch(() => {
      // Ignore autoplay errors
    });
  }, [soundEnabled, volume]);

  return { playSound };
}