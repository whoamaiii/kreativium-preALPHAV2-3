import React, { useState } from 'react';
import { Emotion, EMOTIONS, EMOTION_COLORS } from '../../types/emotion';
import { EmotionIcon } from './EmotionIcon';
import { useEmotionData } from '../../hooks/useEmotionData';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Textarea } from '../ui/Textarea';
import { StressZoneTrafficLight } from '../StressZoneIndicator';

/**
 * EmotionLogger component
 * Allows children to log their current emotional state using emoji icons
 */
export const EmotionLogger: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuthContext();
  const { addEmotionLog, isAddingLog, logs } = useEmotionData();

  // Check if user is logged in
  if (!user) {
    return null;
  }

  // Helper to get the most relevant emotion for the stress zone indicator
  const getEmotionForZone = (): Emotion | undefined => {
    // If user just logged an emotion
    if (selectedEmotion) return selectedEmotion;
    // If there's a latest logged emotion from this user
    const latestLog = logs.length > 0 ? logs[0] : null;
    if (latestLog) return latestLog.emotion;
    // Default to calm if no emotion data
    return undefined;
  };

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmotion) return;
    
    try {
      await addEmotionLog({ 
        emotion: selectedEmotion, 
        optionalNote: note.trim() || undefined 
      });
      setNote('');
      setSubmitted(true);
      
      // Clear the selected emotion after a delay to provide visual feedback
      setTimeout(() => {
        setSelectedEmotion(null);
      }, 2000);
    } catch (error) {
      console.error('Error logging emotion:', error);
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
  };

  return (
    <div className={`emotion-logger ${className}`} data-testid="emotion-logger">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">
            {user ? `How are you feeling right now, ${user.name}?` : 'How are you feeling?'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Select the emoji that best matches your current emotion
          </p>
        </div>
        
        {/* Traffic Light Stress Zone Indicator */}
        <StressZoneTrafficLight 
          emotion={getEmotionForZone()} 
          size="md"
          className="md:ml-auto"
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {EMOTIONS.map((emotion) => (
            <button
              key={emotion}
              onClick={() => handleEmotionSelect(emotion)}
              className={`
                p-2 rounded-lg flex flex-col items-center justify-center h-24 transition
                ${selectedEmotion === emotion ? 'ring-2 ring-offset-2 ring-purple-500 scale-105 bg-gray-100 dark:bg-gray-800' : 'bg-white/10 hover:bg-white/20 dark:hover:bg-white/5'}
              `}
              disabled={isAddingLog || submitted}
              type="button"
            >
              <EmotionIcon emotion={emotion} size={48} />
              <span className="mt-2 capitalize text-sm font-medium dark:text-gray-300">
                {emotion}
              </span>
            </button>
          ))}
        </div>

        {selectedEmotion && (
          <Card className="p-4 mb-6 bg-white/20 dark:bg-gray-800/50">
            <h3 className="font-medium mb-2 dark:text-white flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: EMOTION_COLORS[selectedEmotion] }}
              />
              You selected: <span className="capitalize ml-1">{selectedEmotion}</span>
            </h3>
            
            <Textarea
              placeholder="Add a note about why you feel this way (optional)"
              value={note}
              onChange={handleNoteChange}
              className="mb-4 bg-white/30 dark:bg-gray-700"
              disabled={isAddingLog || submitted}
            />
            
            <Button
              type="submit"
              disabled={isAddingLog || submitted}
              isLoading={isAddingLog}
              variant={submitted ? 'secondary' : 'primary'}
              className="w-full"
              data-testid="submit-emotion-btn"
            >
              {submitted ? 'Saved!' : isAddingLog ? 'Saving...' : 'Save'}
            </Button>
          </Card>
        )}
      </form>
    </div>
  );
};
