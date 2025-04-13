import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmotionIcon } from './EmotionIcon';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { EMOTIONS, Emotion } from '../../types/emotion';
import { useTranslation } from 'react-i18next';
import { useEmotionData } from '../../hooks/useEmotionData';
import { useActivityCorrelation } from '../../hooks/useActivityCorrelation';

interface EmotionPromptProps {
  contextType: 'before' | 'after';
  activityType: 'quiz' | 'memory_game';
  activityId?: string;
  onEmotionLogged?: (emotionLogId: string, emotion: Emotion) => void;
  onSkip?: () => void;
  className?: string;
  customPrompt?: string;
  showSkip?: boolean;
  disabled?: boolean;
}

/**
 * Component for prompting users to log their emotions before or after activities
 */
export const EmotionPrompt: React.FC<EmotionPromptProps> = ({
  contextType,
  activityType,
  activityId,
  onEmotionLogged,
  onSkip,
  className = '',
  customPrompt,
  showSkip = true,
  disabled = false
}) => {
  const { t } = useTranslation();
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { addEmotionLog } = useEmotionData();
  const { linkEmotionToActivity } = useActivityCorrelation();

  // Default prompts based on context
  const defaultPrompt = contextType === 'before'
    ? t('emotionPrompt.beforeActivity', 'How are you feeling before this activity?')
    : t('emotionPrompt.afterActivity', 'How are you feeling after completing this activity?');

  const promptText = customPrompt || defaultPrompt;

  const handleEmotionSelect = (emotion: Emotion) => {
    if (disabled) return;
    setSelectedEmotion(emotion);
  };

  const handleSubmit = async () => {
    if (!selectedEmotion || disabled) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Log the emotion
      const emotionLog = await addEmotionLog({
        emotion: selectedEmotion,
        optionalNote: note
      });
      
      // If an activity ID is provided, link the emotion to the activity
      if (emotionLog && activityId) {
        await linkEmotionToActivity(emotionLog.id, activityId, contextType);
      }
      
      // Call the callback with the emotion log ID if provided
      if (emotionLog && onEmotionLogged) {
        onEmotionLogged(emotionLog.id, selectedEmotion);
      }
    } catch (error) {
      console.error('Error logging emotion:', error);
      setError(t('emotionPrompt.errorLogging', 'Failed to log emotion. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (disabled) return;
    if (onSkip) onSkip();
  };

  return (
    <Card className={`p-6 bg-gray-900/50 backdrop-blur-sm ${className} ${disabled ? 'opacity-50' : ''}`}>
      <h3 className="text-xl font-semibold text-white mb-4">{promptText}</h3>
      
      <div className="grid grid-cols-4 gap-3 mb-6">
        {EMOTIONS.map(emotion => (
          <button
            key={emotion}
            className={`p-3 rounded-full transition-all flex flex-col items-center ${
              selectedEmotion === emotion 
                ? 'bg-purple-600 scale-110 shadow-lg' 
                : 'bg-gray-800 hover:bg-gray-700'
            } ${disabled ? 'cursor-not-allowed' : ''}`}
            onClick={() => handleEmotionSelect(emotion)}
            aria-label={emotion}
            disabled={disabled}
          >
            <EmotionIcon emotion={emotion} size={40} />
            <span className="mt-2 text-sm text-white capitalize">{t(`emotions.${emotion}`, emotion)}</span>
          </button>
        ))}
      </div>
      
      {selectedEmotion && (
        <div className="mb-4">
          <label htmlFor="emotion-note" className="block text-sm text-gray-400 mb-2">
            {t('emotionPrompt.addNote', 'Add a note (optional)')}:
          </label>
          <textarea
            id="emotion-note"
            className={`w-full p-3 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 ${
              disabled ? 'cursor-not-allowed' : ''
            }`}
            rows={2}
            placeholder={t('emotionPrompt.notePlaceholder', 'Why do you feel this way?')}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={disabled}
          />
        </div>
      )}
      
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4"
          >
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between">
        {showSkip && (
          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={isSubmitting || disabled}
          >
            {t('common.skip')}
          </Button>
        )}
        
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!selectedEmotion || isSubmitting || disabled}
          className="ml-auto"
        >
          {isSubmitting ? t('common.submitting') : t('common.submit')}
        </Button>
      </div>
    </Card>
  );
};
