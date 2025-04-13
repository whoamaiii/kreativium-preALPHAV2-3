import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MemoryHeader } from './MemoryHeader';
import { MemoryGrid } from './MemoryGrid';
import { MemoryComplete } from './MemoryComplete';
import { useMemoryGame } from '../hooks/useMemoryGame';
import { Question } from '../types';
import { useActivityCorrelation } from '../hooks/useActivityCorrelation';
import { useAuthContext } from '../hooks/useAuthContext';

interface MemoryBoardProps {
  questions: Question[];
  categoryId: string;
  onBackToCategories: () => void;
  activityId?: string | null;
}

export const MemoryBoard: React.FC<MemoryBoardProps> = ({
  questions,
  categoryId,
  onBackToCategories,
  activityId
}) => {
  const { t } = useTranslation();
  const { saveActivityResult } = useActivityCorrelation();
  const { user } = useAuthContext();
  
  const {
    cards,
    matchedPairs,
    moves,
    time,
    isComplete,
    handleCardClick,
    resetGame
  } = useMemoryGame(questions, categoryId);

  const handlePlayAgain = () => {
    resetGame();
  };
  
  // When the game completes, update the activity result
  useEffect(() => {
    const updateActivityResult = async () => {
      if (isComplete && activityId) {
        try {
          // Update activity with completion data
          await saveActivityResult({
            activityType: 'memory_game',
            durationSeconds: time,
            pairs: questions.length,
            moves,
            timeElapsed: time,
            userId: user?.id || 'anonymous'
          });
          
          // Store activity ID and current pairs for completion screen
          localStorage.setItem('lastMemoryGameActivityId', activityId);
          localStorage.setItem('lastMemoryGamePairs', String(questions.length));
          
          console.log('Memory game activity completed:', activityId);
        } catch (error) {
          console.error('Error updating memory game result:', error);
        }
      }
    };
    
    updateActivityResult();
  }, [isComplete, activityId, time, moves, questions.length, saveActivityResult, user]);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      {!isComplete && (
        <>
          <h1 className="text-2xl font-bold text-white mb-4">{t('memory.title')}</h1>
          <p className="text-lg text-gray-300 mb-6">{t('memory.subtitle')}</p>
          
          <MemoryHeader
            pairsFound={matchedPairs}
            totalPairs={questions.length}
            moves={moves}
            timeElapsed={time}
          />
          
          <MemoryGrid
            cards={cards}
            onCardClick={handleCardClick}
          />
        </>
      )}
      
      {isComplete && (
        <MemoryComplete
          pairs={questions.length}
          moves={moves}
          timeElapsed={time}
          onPlayAgain={handlePlayAgain}
          onBackToCategories={onBackToCategories}
        />
      )}
    </div>
  );
};
