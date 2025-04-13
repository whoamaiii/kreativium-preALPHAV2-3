import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Clock, Volume2, Palette } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from './Card';
import { Button } from './Button';
import { FormSwitch, FormSelect, FormInput } from './Form';
import { useSettings } from '../hooks/useSettings';
import { useToast } from '../hooks/useToast';

const settingsSchema = z.object({
  timer: z.boolean(),
  timerDuration: z.number().min(10).max(300),
  sound: z.boolean(),
  volume: z.number().min(0).max(1),
  theme: z.enum(['light', 'dark', 'system']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

type SettingsForm = z.infer<typeof settingsSchema>;

interface QuizSettingsProps {
  onClose: () => void;
}

export const QuizSettings: React.FC<QuizSettingsProps> = ({ onClose }) => {
  const { settings, updateSettings } = useSettings();
  const { addToast } = useToast();

  const methods = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      timer: settings.timer,
      timerDuration: settings.timerDuration,
      sound: settings.sound,
      volume: settings.volume,
      theme: settings.theme,
      difficulty: settings.difficulty,
    },
  });

  const onSubmit = (data: SettingsForm) => {
    updateSettings(data);
    addToast('Innstillinger lagret!', 'success');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <Card className="max-w-md w-full p-6 dark:bg-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-bold dark:text-white">Quiz Innstillinger</h2>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <h3 className="font-medium dark:text-white">Timer</h3>
              </div>
              <FormSwitch
                name="timer"
                label="Aktiver nedtelling"
                description="Sett en tidsbegrensning for hvert spørsmål"
              />
              {methods.watch('timer') && (
                <FormInput
                  name="timerDuration"
                  type="number"
                  label="Tid per spørsmål (sekunder)"
                  min={10}
                  max={300}
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-gray-500" />
                <h3 className="font-medium dark:text-white">Lyd</h3>
              </div>
              <FormSwitch
                name="sound"
                label="Lydeffekter"
                description="Spill av lyd ved handlinger"
              />
              {methods.watch('sound') && (
                <FormInput
                  name="volume"
                  type="range"
                  label="Volum"
                  min={0}
                  max={1}
                  step={0.1}
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-gray-500" />
                <h3 className="font-medium dark:text-white">Utseende</h3>
              </div>
              <FormSelect
                name="theme"
                label="Tema"
                options={[
                  { value: 'light', label: 'Lyst' },
                  { value: 'dark', label: 'Mørkt' },
                  { value: 'system', label: 'System' },
                ]}
              />
            </div>

            <FormSelect
              name="difficulty"
              label="Vanskelighetsgrad"
              options={[
                { value: 'easy', label: 'Lett' },
                { value: 'medium', label: 'Middels' },
                { value: 'hard', label: 'Vanskelig' },
              ]}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Avbryt
              </Button>
              <Button type="submit">
                Lagre innstillinger
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </motion.div>
  );
};