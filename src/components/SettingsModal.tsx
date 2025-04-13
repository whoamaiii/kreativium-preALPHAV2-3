import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Volume2, Moon, Sun, Globe, Gauge } from 'lucide-react';
import { Button } from './Button';
import { AudioSettings } from './AudioSettings';
import { useSettings } from '../hooks/useSettings';
import { Switch } from './Switch';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettings();

  const languages = [
    { code: 'nb', name: 'Norsk' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
      >
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-bold dark:text-white">Innstillinger</h2>
        </div>

        <div className="space-y-6">
          {/* Sound Settings */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold dark:text-white">Lyd</h3>
            </div>
            <AudioSettings
              onVolumeChange={(volume) => updateSettings({ volume })}
              onMute={(muted) => updateSettings({ soundEnabled: !muted })}
              initialVolume={settings.volume}
              initialMuted={!settings.soundEnabled}
            />
          </div>

          {/* Theme Settings */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold dark:text-white">Tema</h3>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => updateSettings({ theme: 'light' })}
                className={`p-3 rounded-lg flex items-center gap-2 ${
                  settings.theme === 'light'
                    ? 'bg-purple-100 text-purple-600'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span>Lyst</span>
              </button>
              <button
                onClick={() => updateSettings({ theme: 'dark' })}
                className={`p-3 rounded-lg flex items-center gap-2 ${
                  settings.theme === 'dark'
                    ? 'bg-purple-100 text-purple-600'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Moon className="w-5 h-5" />
                <span>Mørkt</span>
              </button>
            </div>
          </div>

          {/* Language Settings */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold dark:text-white">Språk</h3>
            </div>
            <select
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value })}
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600
                       dark:bg-gray-700 dark:text-white"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={onClose}>Lukk</Button>
        </div>
      </motion.div>
    </motion.div>
  );
};