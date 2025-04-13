import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { formatTime } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import { EmotionPrompt } from './FeelingsTracker/EmotionPrompt';
import { Emotion } from '../types/emotion';
import { useActivityCorrelation } from '../hooks/useActivityCorrelation';
import EmotionLearningCorrelation from './FeelingsTracker/EmotionLearningCorrelation';
import { EmotionIcon } from './FeelingsTracker/EmotionIcon';

interface MemoryCompleteProps {
  pairs: number;
  moves: number;
  timeElapsed: number;
  onPlayAgain: () => void;
  onBackToCategories: () => void;
}

export const MemoryComplete: React.FC<MemoryCompleteProps> = ({
  pairs,
  moves,
  timeElapsed,
  onPlayAgain,
  onBackToCategories
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { linkEmotionToActivity } = useActivityCorrelation();
  
  // State for emotion logging
  const [showEmotionPrompt, setShowEmotionPrompt] = useState(true);
  const [activityId, setActivityId] = useState<string | null>(null);
  const [previousEmotion, setPreviousEmotion] = useState<Emotion | null>(null);
  const [showCorrelations, setShowCorrelations] = useState(false);

  // Get activity ID from localStorage
  useEffect(() => {
    const storedActivityId = localStorage.getItem('lastMemoryGameActivityId');
    const storedEmotion = localStorage.getItem('lastMemoryGameEmotion');
    
    if (storedActivityId) {
      setActivityId(storedActivityId);
    }
    
    if (storedEmotion) {
      setPreviousEmotion(storedEmotion as Emotion);
    }
    
    // Clean up localStorage entries
    localStorage.removeItem('lastMemoryGameActivityId');
    localStorage.removeItem('lastMemoryGameEmotion');
  }, []);
  
  // Handle emotion logging
  const handleEmotionLogged = async (logId: string, emotion: Emotion) => {
    // Link emotion to activity if activity ID is available
    if (activityId) {
      try {
        await linkEmotionToActivity(logId, activityId, 'after');
        console.log('Emotion linked to memory game activity:', activityId);
        // Show correlations after logging emotion
        setShowCorrelations(true);
      } catch (error) {
        console.error('Error linking emotion to activity:', error);
      }
    }
    
    // Hide emotion prompt after logging
    setShowEmotionPrompt(false);
  };
  
  const handleSkipEmotionPrompt = () => {
    setShowEmotionPrompt(false);
    setShowCorrelations(true);
  };

  // Calculate performance metrics
  const perfectMoves = pairs * 2;
  const extraMoves = Math.max(0, moves - perfectMoves);
  const accuracy = Math.max(0, Math.min(100, (perfectMoves / moves) * 100));
  
  // Calculate skill level
  let skillLevel = t('memory.levels.beginner');
  if (accuracy >= 90) skillLevel = t('memory.levels.expert');
  else if (accuracy >= 75) skillLevel = t('memory.levels.advanced');
  else if (accuracy >= 60) skillLevel = t('memory.levels.intermediate');
  
  // Show emotion prompt first
  if (showEmotionPrompt && activityId) {
    let promptMessage = t('emotionPrompt.afterMemoryGame', 'How are you feeling after completing the memory game?');
    
    // Add reference to previous emotion if available
    if (previousEmotion) {
      promptMessage = t('emotionPrompt.afterMemoryGameWithPrevious', {
        emotion: t(`emotions.${previousEmotion}`),
        defaultValue: `You felt ${previousEmotion} before starting. How are you feeling now after completing the game?`
      });
    }
    
    return (
      <div className="max-w-lg mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white text-center mb-2">
              {t('memory.complete')}
            </h1>
            <p className="text-gray-400 text-center mb-6">
              {t('memory.trackEmotions')}
            </p>
          </div>
          
          <EmotionPrompt
            contextType="after"
            activityType="memory_game"
            activityId={activityId}
            onEmotionLogged={handleEmotionLogged}
            onSkip={handleSkipEmotionPrompt}
            customPrompt={promptMessage}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gray-900/50 backdrop-blur-sm overflow-hidden mb-8">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-center text-white mb-2">
              {t('memory.complete')}
            </h1>
            <p className="text-gray-400 text-center mb-8">
              {t('memory.result')}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <div className="text-4xl font-bold text-white mb-1">{moves}</div>
                <div className="text-gray-400 text-sm">{t('memory.totalMoves')}</div>
              </div>

              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <div className="text-4xl font-bold text-white mb-1">{Math.round(accuracy)}%</div>
                <div className="text-gray-400 text-sm">{t('memory.accuracy')}</div>
              </div>

              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <div className="text-4xl font-bold text-white mb-1">{extraMoves}</div>
                <div className="text-gray-400 text-sm">{t('memory.extraMoves')}</div>
              </div>

              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <div className="text-4xl font-bold text-white mb-1">{formatTime(timeElapsed)}</div>
                <div className="text-gray-400 text-sm">{t('memory.timeTaken')}</div>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="font-bold text-xl text-white mb-2">{t('memory.yourLevel')}</div>
              <div className="text-2xl font-bold text-purple-400">{skillLevel}</div>
            </div>

            {previousEmotion && (
              <div className="mb-8 p-4 bg-gray-800/50 rounded-lg">
                <div className="text-center mb-2">
                  <div className="text-gray-400 mb-1">{t('memory.startingEmotion')}</div>
                  <div className="flex items-center justify-center gap-2">
                    <EmotionIcon emotion={previousEmotion} size={24} />
                    <span className="text-white font-medium">
                      {t(`emotions.${previousEmotion}`)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-4">
              <Button 
                variant="primary"
                onClick={onPlayAgain}
              >
                {t('memory.playAgain')}
              </Button>

              <Button 
                variant="ghost"
                onClick={onBackToCategories}
              >
                {t('memory.backToCategories')}
              </Button>
            </div>
          </div>
        </Card>

        {showCorrelations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-sm p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                {t('memory.emotionPerformance')}
              </h2>
              <EmotionLearningCorrelation />
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MemoryComplete;
