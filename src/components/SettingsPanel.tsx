import React from 'react';
import { Volume2, Moon, Sun, Globe, Gauge } from 'lucide-react';
import { Card } from './ui/Card';
import { Switch } from './ui/Switch';
import { Select } from './ui/Select';
import { Slider } from './ui/Slider';
import { useSettings } from '../hooks/useSettings';
import { useToast } from '../hooks/useToast';

export const SettingsPanel: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { addToast } = useToast();

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value });
    addToast('Settings updated', 'success');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Volume2 className="w-5 h-5" />
              Sound
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Sound Effects</span>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
                />
              </div>
              {settings.soundEnabled && (
                <div className="space-y-2">
                  <span>Volume</span>
                  <Slider
                    value={settings.volume * 100}
                    onChange={(value) => handleSettingChange('volume', value / 100)}
                    min={0}
                    max={100}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Moon className="w-5 h-5" />
              Theme
            </h3>
            <Select
              value={settings.theme}
              onChange={(value) => handleSettingChange('theme', value)}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'system', label: 'System' },
              ]}
            />
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Globe className="w-5 h-5" />
              Language
            </h3>
            <Select
              value={settings.language}
              onChange={(value) => handleSettingChange('language', value)}
              options={[
                { value: 'nb', label: 'Norsk' },
                { value: 'en', label: 'English' },
              ]}
            />
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Gauge className="w-5 h-5" />
              Difficulty
            </h3>
            <Select
              value={settings.difficulty}
              onChange={(value) => handleSettingChange('difficulty', value)}
              options={[
                { value: 'easy', label: 'Easy' },
                { value: 'medium', label: 'Medium' },
                { value: 'hard', label: 'Hard' },
              ]}
            />
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
              Timer Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Enable Timer</span>
                <Switch
                  checked={settings.timerEnabled}
                  onCheckedChange={(checked) => handleSettingChange('timerEnabled', checked)}
                />
              </div>
              {settings.timerEnabled && (
                <div className="space-y-2">
                  <span>Time per Question (seconds)</span>
                  <Select
                    value={settings.timerDuration.toString()}
                    onChange={(value) => handleSettingChange('timerDuration', parseInt(value))}
                    options={[
                      { value: '15', label: '15 seconds' },
                      { value: '30', label: '30 seconds' },
                      { value: '45', label: '45 seconds' },
                      { value: '60', label: '60 seconds' },
                    ]}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};