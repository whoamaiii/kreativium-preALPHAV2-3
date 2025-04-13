import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useQuizStore } from '../store/quizStore';
import { formatTime } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import { EmotionPrompt } from '../components/FeelingsTracker/EmotionPrompt';
import { Emotion } from '../types/emotion';
import { useActivityCorrelation } from '../hooks/useActivityCorrelation';
import EmotionLearningCorrelation from '../components/FeelingsTracker/EmotionLearningCorrelation';
import { EmotionIcon } from '../components/FeelingsTracker/EmotionIcon';

const QuizResults: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { resultsHistory, resetQuiz, isComplete } = useQuizStore();
  const latestResult = resultsHistory[0];
  const { linkEmotionToActivity, getCorrelations, analyzeCorrelations } = useActivityCorrelation();
  
  // State for emotion logging and analysis
  const [showEmotionPrompt, setShowEmotionPrompt] = useState(true);
  const [activityId, setActivityId] = useState<string | null>(null);
  const [previousEmotion, setPreviousEmotion] = useState<Emotion | null>(null);
  const [showCorrelations, setShowCorrelations] = useState(false);

  // Get activity ID from localStorage
  useEffect(() => {
    const storedActivityId = localStorage.getItem('lastQuizActivityId');
    const storedEmotion = localStorage.getItem('lastQuizEmotion');
    
    if (storedActivityId) {
      setActivityId(storedActivityId);
    }
    
    if (storedEmotion) {
      setPreviousEmotion(storedEmotion as Emotion);
    }
    
    // Clean up localStorage entries
    localStorage.removeItem('lastQuizActivityId');
    localStorage.removeItem('lastQuizEmotion');
  }, []);

  // Redirect if no results or quiz isn't complete
  useEffect(() => {
    if (!isComplete || !latestResult) {
      navigate('/quiz');
    }
  }, [isComplete, latestResult, navigate]);
  
  // Handle emotion logging
  const handleEmotionLogged = async (logId: string, emotion: Emotion) => {
    // Link emotion to activity if activity ID is available
    if (activityId) {
      try {
        await linkEmotionToActivity(logId, activityId, 'after');
        console.log('Emotion linked to quiz activity:', activityId);
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

  if (!latestResult) {
    return null;
  }
  
  // Show emotion prompt first
  if (showEmotionPrompt && activityId) {
    let promptMessage = t('emotionPrompt.afterQuiz', 'How are you feeling after completing this quiz?');
    
    // Add reference to previous emotion if available
    if (previousEmotion) {
      promptMessage = t('emotionPrompt.afterQuizWithPrevious', {
        emotion: t(`emotions.${previousEmotion}`),
        defaultValue: `You felt ${previousEmotion} before starting. How are you feeling now after completing the quiz?`
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
              {t('quiz.complete')}
            </h1>
            <p className="text-gray-400 text-center mb-6">
              {t('quiz.trackEmotions')}
            </p>
          </div>
          
          <EmotionPrompt
            contextType="after"
            activityType="quiz"
            activityId={activityId}
            onEmotionLogged={handleEmotionLogged}
            onSkip={handleSkipEmotionPrompt}
            customPrompt={promptMessage}
          />
        </motion.div>
      </div>
    );
  }

  const { score, correctAnswers, questionsAnswered, timeTaken } = latestResult;
  const percentage = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;

  // Calculate accuracy level
  let accuracyLevel = t('quiz.levels.beginner');
  if (percentage >= 90) accuracyLevel = t('quiz.levels.expert');
  else if (percentage >= 75) accuracyLevel = t('quiz.levels.advanced');
  else if (percentage >= 60) accuracyLevel = t('quiz.levels.intermediate');

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
              {t('quiz.complete')}
            </h1>
            <p className="text-gray-400 text-center mb-8">
              {t('quiz.result')}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <div className="text-4xl font-bold text-white mb-1">{score}</div>
                <div className="text-gray-400 text-sm">{t('quiz.totalScore')}</div>
              </div>

              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <div className="text-4xl font-bold text-white mb-1">{percentage}%</div>
                <div className="text-gray-400 text-sm">{t('quiz.accuracy')}</div>
              </div>

              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <div className="text-4xl font-bold text-white mb-1">{correctAnswers}/{questionsAnswered}</div>
                <div className="text-gray-400 text-sm">{t('quiz.correctAnswers')}</div>
              </div>

              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <div className="text-4xl font-bold text-white mb-1">{formatTime(timeTaken)}</div>
                <div className="text-gray-400 text-sm">{t('quiz.timeTaken')}</div>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="font-bold text-xl text-white mb-2">{t('quiz.yourLevel')}</div>
              <div className="text-2xl font-bold text-purple-400">{accuracyLevel}</div>
            </div>

            {previousEmotion && (
              <div className="mb-8 p-4 bg-gray-800/50 rounded-lg">
                <div className="text-center mb-2">
                  <div className="text-gray-400 mb-1">{t('quiz.startingEmotion')}</div>
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
                onClick={() => {
                  resetQuiz();
                  navigate('/quiz');
                }}
              >
                {t('quiz.tryAnother')}
              </Button>

              <Button 
                variant="ghost" 
                onClick={() => {
                  resetQuiz();
                  navigate('/');
                }}
              >
                {t('common.backToHome')}
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
                {t('quiz.emotionPerformance')}
              </h2>
              <EmotionLearningCorrelation />
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default QuizResults;
