import React from 'react';
import { Volume2, Moon, Sun, Globe, Gauge } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FormSwitch, FormSelect } from '../components/Form';
import { useSettings } from '../hooks/useSettings';
import { useToast } from '../hooks/useToast';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { addToast } = useToast();

  const handleSoundToggle = (enabled: boolean) => {
    updateSettings({ soundEnabled: enabled });
    addToast(enabled ? 'Lyd aktivert' : 'Lyd deaktivert', 'success');
  };

  const handleVolumeChange = (volume: number) => {
    updateSettings({ volume });
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
    addToast('Tema oppdatert', 'success');
  };

  const handleLanguageChange = (language: string) => {
    updateSettings({ language });
    addToast('Språk oppdatert', 'success');
  };

  const handleDifficultyChange = (difficulty: 'easy' | 'medium' | 'hard') => {
    updateSettings({ difficulty });
    addToast('Vanskelighetsgrad oppdatert', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Innstillinger</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Tilpass applikasjonen etter dine preferanser
        </p>
      </div>

      <div className="grid gap-6">
        {/* Sound Settings */}
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Volume2 className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold dark:text-white">Lyd</h2>
          </div>
          
          <div className="space-y-4">
            <FormSwitch
              name="soundEnabled"
              label="Lydeffekter"
              description="Spill av lyd ved handlinger"
              checked={settings.soundEnabled}
              onChange={handleSoundToggle}
            />

            {settings.soundEnabled && (
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-gray-300">
                  Volum
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Theme Settings */}
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Moon className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold dark:text-white">Tema</h2>
          </div>

          <div className="flex gap-4">
            <Button
              variant={settings.theme === 'light' ? 'primary' : 'secondary'}
              onClick={() => handleThemeChange('light')}
              className="flex items-center gap-2"
            >
              <Sun className="w-4 h-4" />
              Lyst
            </Button>
            <Button
              variant={settings.theme === 'dark' ? 'primary' : 'secondary'}
              onClick={() => handleThemeChange('dark')}
              className="flex items-center gap-2"
            >
              <Moon className="w-4 h-4" />
              Mørkt
            </Button>
            <Button
              variant={settings.theme === 'system' ? 'primary' : 'secondary'}
              onClick={() => handleThemeChange('system')}
              className="flex items-center gap-2"
            >
              System
            </Button>
          </div>
        </Card>

        {/* Language Settings */}
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold dark:text-white">Språk</h2>
          </div>

          <FormSelect
            name="language"
            value={settings.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            options={[
              { value: 'nb', label: 'Norsk' },
              { value: 'en', label: 'English' },
            ]}
          />
        </Card>

        {/* Difficulty Settings */}
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Gauge className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold dark:text-white">Vanskelighetsgrad</h2>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {['easy', 'medium', 'hard'].map((level) => (
              <Button
                key={level}
                variant={settings.difficulty === level ? 'primary' : 'secondary'}
                onClick={() => handleDifficultyChange(level as 'easy' | 'medium' | 'hard')}
              >
                {level === 'easy' && 'Lett'}
                {level === 'medium' && 'Middels'}
                {level === 'hard' && 'Vanskelig'}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;