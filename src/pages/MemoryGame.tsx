import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MemoryBoard } from '../components/MemoryBoard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Button } from '../components/Button';
import { useQuestions } from '../hooks/useQuestions';
import { EmotionPrompt } from '../components/FeelingsTracker/EmotionPrompt';
import { useActivityCorrelation } from '../hooks/useActivityCorrelation';
import { useAuthContext } from '../hooks/useAuthContext';
import { Emotion } from '../types/emotion';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { ILPModeToggle } from '../components/ILP/ILPModeToggle';
import useIlpsWithEnhancedFunctionality from '../hooks/useIlps';
import { v4 as uuidv4 } from 'uuid';
import { ILPActivityTag } from '../components/ILP/ILPActivityTag';

const MemoryGame: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { saveActivityResult, linkEmotionToActivity } = useActivityCorrelation();
  const { user } = useAuthContext();
  const { ilpModeActive, getRelevantILPsForActivity } = useIlpsWithEnhancedFunctionality();
  const activityTypeId = uuidv4(); // Generate stable ID for this activity session
  
  // State for emotion logging
  const [showEmotionPrompt, setShowEmotionPrompt] = useState(true);
  const [emotionLogId, setEmotionLogId] = useState<string | null>(null);
  const [recordedEmotion, setRecordedEmotion] = useState<Emotion | null>(null);
  const [activityId, setActivityId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingEmotion, setIsLoggingEmotion] = useState(false);
  
  const { 
    data: questions, 
    isLoading: loading, 
    error: queryError 
  } = useQuestions(categoryId);

  // Filter questions based on ILP relevance if ILP mode is active
  const [filteredQuestions, setFilteredQuestions] = useState(questions);
  
  // Update filtered questions when ILP mode changes or questions change
  useEffect(() => {
    if (!questions) {
      setFilteredQuestions([]);
      return;
    }
    
    if (ilpModeActive && categoryId) {
      // Filter questions relevant to active ILPs
      const relevantQuestions = questions.filter(question => {
        const relevantILPs = getRelevantILPsForActivity('memory', categoryId, question.id);
        return relevantILPs.length > 0;
      });
      
      setFilteredQuestions(relevantQuestions.length > 0 ? relevantQuestions : questions);
    } else {
      setFilteredQuestions(questions);
    }
  }, [ilpModeActive, questions, categoryId, getRelevantILPsForActivity]);

  const handleBackToCategories = () => {
    navigate('/categories');
  };
  
  // Handle emotion logging
  const handleEmotionLogged = async (logId: string, emotion: Emotion) => {
    setError(null);
    setIsLoggingEmotion(true);
    setEmotionLogId(logId);
    setRecordedEmotion(emotion);
    
    // After logging emotion, start tracking the activity
    if (filteredQuestions && filteredQuestions.length > 0 && categoryId) {
      try {
        // Save activity start
        const activityResult = await saveActivityResult({
          activityType: 'memory_game',
          durationSeconds: 0,
          pairs: Math.min(12, filteredQuestions.length),
          moves: 0,
          timeElapsed: 0,
          userId: user?.id || 'anonymous'
        });
        
        // Store activity ID for linking with emotions
        setActivityId(activityResult.id);
        
        // Link the emotion to the activity
        await linkEmotionToActivity(logId, activityResult.id, 'before');
        
        // Store the activity ID in localStorage for completion
        localStorage.setItem('lastMemoryGameActivityId', activityResult.id);
        localStorage.setItem('lastMemoryGameEmotion', emotion);
        
        console.log('Memory game activity started:', activityResult.id);
        setShowEmotionPrompt(false);
      } catch (error) {
        setIsLoggingEmotion(false);
        console.error('Error saving memory game start:', error);
        setError(t('memory.errorSavingActivity', 'There was an error saving your activity. Please try again.'));
      }
    }
  };
  
  const handleSkipEmotionPrompt = () => {
    setError(null);
    setIsLoggingEmotion(true);
    
    // Even if emotion is skipped, we still track the activity
    if (filteredQuestions && filteredQuestions.length > 0 && categoryId) {
      saveActivityResult({
        activityType: 'memory_game',
        durationSeconds: 0,
        pairs: Math.min(12, filteredQuestions.length),
        moves: 0,
        timeElapsed: 0,
        userId: user?.id || 'anonymous'
      }).then(result => {
        setActivityId(result.id);
        localStorage.setItem('lastMemoryGameActivityId', result.id);
        setShowEmotionPrompt(false);
        setIsLoggingEmotion(false);
      }).catch(error => {
        setIsLoggingEmotion(false);
        console.error('Error saving memory game start:', error);
        setError(t('memory.errorSavingActivity', 'There was an error saving your activity. Please try again.'));
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (queryError || !categoryId) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-bold mb-4 text-red-600">
          {typeof queryError === 'string' ? queryError : 
           queryError instanceof Error ? queryError.message : 
           t('common.loading')}
        </h2>
        <Button 
          onClick={handleBackToCategories}
          variant="primary"
        >
          {t('memory.backToCategories')}
        </Button>
      </div>
    );
  }

  if (!filteredQuestions || filteredQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-bold mb-4">
          {ilpModeActive ? t('ilp.noRelevantItems') : t('common.loading')}
        </h2>
        <p className="mb-6">
          {ilpModeActive 
            ? t('ilp.noMatchingItemsForMemory') 
            : t('memory.noQuestions')}
        </p>
        <div className="mb-6">
          <ILPModeToggle />
        </div>
        <Button 
          onClick={handleBackToCategories}
          variant="primary"
        >
          {t('memory.backToCategories')}
        </Button>
      </div>
    );
  }
  
  // Show emotion prompt before game starts
  if (showEmotionPrompt) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-center mb-2">
              {t('memory.title')}
            </h1>
            <p className="text-lg text-center mb-6">
              {t('memory.beforeStarting')}
            </p>
            
            <div className="flex justify-center mb-4">
              <ILPModeToggle showLabel={true} />
            </div>
            
            {categoryId && (
              <div className="flex justify-center mb-4">
                <ILPActivityTag 
                  activityType="memory" 
                  activityId={activityTypeId} 
                  categoryId={categoryId} 
                />
              </div>
            )}
          </div>
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <Card className="bg-red-500/10 border-red-500/20 p-4">
                  <p className="text-red-500 text-center">{error}</p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="relative">
            {isLoggingEmotion && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <LoadingSpinner />
              </div>
            )}
            <EmotionPrompt
              contextType="before"
              activityType="memory_game"
              onEmotionLogged={handleEmotionLogged}
              onSkip={handleSkipEmotionPrompt}
              customPrompt={t('emotionPrompt.beforeMemoryGame', 'How are you feeling before playing the memory game?')}
              disabled={isLoggingEmotion}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // Limit to a reasonable number of pairs for the memory game
  const limitedQuestions = filteredQuestions.slice(0, 12);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center mb-4 py-2">
        <ILPModeToggle showLabel={true} />
      </div>
      
      {categoryId && (
        <div className="flex justify-center mb-4">
          <ILPActivityTag 
            activityType="memory" 
            activityId={activityTypeId} 
            categoryId={categoryId} 
          />
        </div>
      )}
      
      <MemoryBoard
        questions={limitedQuestions}
        categoryId={categoryId}
        onBackToCategories={handleBackToCategories}
        activityId={activityId}
      />
    </motion.div>
  );
};

export default MemoryGame;
