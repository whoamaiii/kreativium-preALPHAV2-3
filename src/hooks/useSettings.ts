import { useEffect } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import { create } from 'zustand';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  soundEnabled: boolean;
  volume: number;
  timerEnabled: boolean;
  timerDuration: number;
}

interface SettingsStore {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  language: 'nb',
  soundEnabled: true,
  volume: 0.7,
  timerEnabled: true,
  timerDuration: 30,
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: DEFAULT_SETTINGS,
  updateSettings: (newSettings) =>
    set((state) => ({ settings: { ...state.settings, ...newSettings } })),
}));

export function useSettings() {
  const { user } = useAuth();
  const { settings, updateSettings } = useSettingsStore();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        const userSettings = doc.data().settings;
        updateSettings(userSettings);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const saveSettings = async (newSettings: Partial<Settings>) => {
    if (!user) return;

    const updatedSettings = { ...settings, ...newSettings };
    updateSettings(newSettings);

    await updateDoc(doc(db, 'users', user.uid), {
      settings: updatedSettings,
    });
  };

  return {
    settings,
    updateSettings: saveSettings,
  };
}