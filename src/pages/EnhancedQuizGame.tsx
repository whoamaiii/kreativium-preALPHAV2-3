import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import { questions } from '../data/questions';
import { MultiChoiceQuestionCard } from '../components/MultiChoiceQuestionCard';
import { ComboDisplay } from '../components/ComboDisplay';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useToast } from '../hooks/useToast';
import { useTranslation } from 'react-i18next';
import { EmotionPrompt } from '../components/FeelingsTracker/EmotionPrompt';
import { useActivityCorrelation } from '../hooks/useActivityCorrelation';
import { useAuthContext } from '../hooks/useAuthContext';
import { Emotion } from '../types/emotion';
import { ActivityResult } from '../types/integration';

const EnhancedQuizGame: React.FC = () => {
  // State for tracking emotion logging
  const [showEmotionPrompt, setShowEmotionPrompt] = useState(true);
  const [emotionLogId, setEmotionLogId] = useState<string | null>(null);
  const [recordedEmotion, setRecordedEmotion] = useState<Emotion | null>(null);
  const [activityId, setActivityId] = useState<string | null>(null);
  const { categoryId = '' } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { saveActivityResult } = useActivityCorrelation();
  const { user } = useAuthContext();
  
  // Check if useToast hook exists, if not, create a simple implementation
  const toast = typeof useToast === 'function' 
    ? useToast() 
    : { addToast: (message: string) => console.log(message) };

  const {
    initQuiz,
    currentQuestion,
    questions: quizQuestions,
    answers,
    score,
    streak,
    multiplier,
    isCorrect,
    showFeedback,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    completeQuiz,
    isComplete,
    startTime
  } = useQuizStore();

  // Initialize quiz with questions for this category
  useEffect(() => {
    if (categoryId && questions[categoryId]) {
      // Randomize the order
      const categoryQuestions = [...questions[categoryId]].sort(() => 0.5 - Math.random());
      initQuiz(categoryQuestions);
    } else {
      navigate('/quiz');
    }
  }, [categoryId, initQuiz, navigate]);

  // Save activity result when quiz begins (after emotion is logged)
  useEffect(() => {
    const saveQuizStart = async () => {
      if (!showEmotionPrompt && !activityId && categoryId && quizQuestions.length > 0) {
        try {
          // Save activity start with required fields
          const activityResult = await saveActivityResult({
            activityType: 'quiz',
            durationSeconds: 0,
            categoryId,
            totalQuestions: quizQuestions.length,
            correctAnswers: 0,
            score: 0,
            userId: user?.id || 'anonymous'
          });
          
          // Store activity ID for later use
          setActivityId(activityResult.id);
          
          console.log('Quiz activity started:', activityResult.id);
        } catch (error) {
          console.error('Error saving quiz start:', error);
        }
      }
    };
    
    saveQuizStart();
  }, [showEmotionPrompt, activityId, categoryId, quizQuestions.length, saveActivityResult, user]);

  // Handle quiz completion and redirect
  useEffect(() => {
    const saveQuizCompletion = async () => {
      if (isComplete && activityId) {
        try {
          // Calculate duration (from start time to now)
          const duration = startTime 
            ? Math.round((Date.now() - startTime) / 1000) 
            : 0;
            
          // Get number of correct answers
          const correctAnswersCount = Object.keys(answers).reduce((count, questionIndex) => {
            const question = quizQuestions[parseInt(questionIndex)];
            const answer = answers[parseInt(questionIndex)];
            if (question && answer && answer.toLowerCase() === question.correctAnswer.toLowerCase()) {
              return count + 1;
            }
            return count;
          }, 0);
          
          // Update activity with completion data
          const updatedActivity = await saveActivityResult({
            activityType: 'quiz',
            durationSeconds: duration,
            categoryId,
            totalQuestions: quizQuestions.length,
            correctAnswers: correctAnswersCount,
            score,
            userId: user?.id || 'anonymous'
          });
          
          // Store activity ID in localStorage for the results page
          localStorage.setItem('lastQuizActivityId', updatedActivity.id);
          localStorage.setItem('lastQuizEmotion', recordedEmotion || '');
          
          // Navigate to results page
          navigate('/quiz/results');
        } catch (error) {
          console.error('Error saving quiz results:', error);
          navigate('/quiz/results');
        }
      } else if (isComplete) {
        navigate('/quiz/results');
      }
    };
    
    saveQuizCompletion();
  }, [isComplete, navigate, activityId, saveActivityResult, startTime, 
     quizQuestions.length, score, answers, categoryId, recordedEmotion, user]);

  // Calculate progress
  const progress = quizQuestions.length > 0 ? (currentQuestion + 1) / quizQuestions.length : 0;

  // Current question object
  const questionObj = quizQuestions[currentQuestion];

  // Handle emotion logging
  const handleEmotionLogged = (logId: string, emotion: Emotion) => {
    setEmotionLogId(logId);
    setRecordedEmotion(emotion);
    setShowEmotionPrompt(false);
  };
  
  const handleSkipEmotionPrompt = () => {
    setShowEmotionPrompt(false);
  };

  // Handle answer submission
  const handleAnswer = (answer: string) => {
    const isCorrect = submitAnswer(answer);

    // Show feedback
    if (isCorrect) {
      if (typeof toast.addToast === 'function') {
        toast.addToast(t('game.correct'), 'success');
      }
    } else {
      if (typeof toast.addToast === 'function') {
        toast.addToast(`${t('game.incorrect')} ${questionObj?.correctAnswer}`, 'error');
      }
    }

    // Auto advance after delay if correct
    if (isCorrect) {
      const timer = setTimeout(() => {
        if (currentQuestion < quizQuestions.length - 1) {
          nextQuestion();
        } else {
          completeQuiz();
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  };

  // Determine if current question is answered
  const isAnswered = questionObj ? !!answers[currentQuestion] : false;
  const selectedAnswer = questionObj ? answers[currentQuestion] : undefined;
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;

  // Show emotion prompt before quiz starts
  if (showEmotionPrompt) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            {t('quiz.title')}
          </h1>
          <p className="text-gray-400 text-center mb-6">
            {t('quiz.beforeStarting')}
          </p>
        </div>
        
        <EmotionPrompt
          contextType="before"
          activityType="quiz"
          onEmotionLogged={handleEmotionLogged}
          onSkip={handleSkipEmotionPrompt}
          customPrompt={t('emotionPrompt.beforeQuiz', 'How are you feeling before starting this quiz?')}
        />
      </div>
    );
  }

  if (!questionObj) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          {t('quiz.title')}
        </h1>
        <p className="text-gray-400 text-center">
          {t('quiz.subtitle')}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">
            {t('quiz.question')} {currentQuestion + 1} {t('quiz.of')} {quizQuestions.length}
          </span>

          <div className="flex items-center gap-3">
            <div className="text-gray-400">
              {t('game.score')}: <span className="font-bold text-white">{score}</span>
            </div>

            {streak > 1 && (
              <ComboDisplay streak={streak} multiplier={multiplier} />
            )}
          </div>
        </div>

        <ProgressBar progress={progress} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <MultiChoiceQuestionCard
            question={questionObj}
            onAnswer={handleAnswer}
            isAnswered={isAnswered}
            selectedAnswer={selectedAnswer}
          />
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex justify-between">
        <Button 
          variant="ghost" 
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
        >
          {t('common.previous')}
        </Button>

        <div className="space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/quiz')}
          >
            {t('common.exit')}
          </Button>
          
          {isAnswered && (
            <Button 
              variant="primary"
              onClick={isLastQuestion ? completeQuiz : nextQuestion}
            >
              {isLastQuestion ? t('quiz.completeQuiz') : t('quiz.nextQuestion')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedQuizGame;
