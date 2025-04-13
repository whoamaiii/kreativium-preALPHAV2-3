import { useEffect } from 'react';
import { useSettings } from './useSettings';
import { useStats } from './useStats';
import i18n from '../i18n';

export function useInitializeApp() {
  const { settings } = useSettings();
  const { updateStats } = useStats();

  useEffect(() => {
    // Initialize theme
    if (settings.theme === 'dark' || 
        (settings.theme === 'system' && 
         window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }

    // Update last visited timestamp
    updateStats(prev => ({
      ...prev,
      lastVisited: new Date().toISOString()
    }));

    // Force Norwegian language
    i18n.changeLanguage('nb');
    document.documentElement.lang = 'nb';
  }, [settings.theme]);
}