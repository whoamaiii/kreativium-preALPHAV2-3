import { useEffect } from 'react';
import { useSettings } from './useSettings';
import { useStats } from './useStats';

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

    // Initialize i18n
    document.documentElement.lang = settings.language;
  }, [settings.theme, settings.language]);
}