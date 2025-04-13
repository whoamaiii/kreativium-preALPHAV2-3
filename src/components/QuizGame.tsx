import React, { useState, useCallback, memo, useMemo, Suspense } from 'react';
import { LazyMotion, domAnimation, AnimatePresence, m } from 'framer-motion';
import { QuizProgress } from './QuizProgress';
import { QuestionCard } from './QuestionCard';
import { NavigationButtons } from './NavigationButtons';
import { questions } from '../data/questions';
import { useToast } from '../hooks/useToast';
import { Question } from '../types';
import { ErrorBoundary } from './ErrorBoundary/ErrorBoundary';
import { Loading } from './Loading';
import useGamification from '../hooks/useGamification';
import GamificationDashboard from './GamificationDashboard';

// Memoize child components to prevent unnecessary re-renders
const MemoizedQuestionCard = memo(QuestionCard);
const MemoizedNavigationButtons = memo(NavigationButtons);
const MemoizedQuizProgress = memo(QuizProgress);
const MemoizedGamificationDashboard = memo(GamificationDashboard);

/**
 * QuizGame component with optimized rendering and accessibility
 */
export const QuizGame: React.FC = () => {
  // Extract all questions from the categories into a single array
  const allQuestions = useMemo(() => {
    try {
      return Object.values(questions).flat();
    } catch (error) {
      console.error('Error loading questions:', error);
      return [];
    }
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showGamificationDashboard, setShowGamificationDashboard] = useState(false);
  const { addToast } = useToast();
  const { registerAnswer, xp, level, xpToNextLevel } = useGamification();

  // Memoize callback functions to prevent unnecessary re-renders
  const handleNext = useCallback(() => {
    if (currentIndex < allQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, allQuestions.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleAnswer = useCallback(async (answer: string) => {
    try {
      setIsLoading(true);
      
      setAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[currentIndex] = answer;
        return newAnswers;
      });

      // Safely access the current question
      const currentQuestion = allQuestions[currentIndex];
      if (!currentQuestion) {
        addToast('Error: Question not found', 'error');
        return;
      }
      
      const isCorrect = answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
      
      // Update score if answer is correct
      if (isCorrect) {
        setScore(prev => prev + (currentQuestion.points || 10));
        // Update gamification
        registerAnswer(true, currentQuestion.points || 10);
      } else {
        // Register incorrect answer for streak tracking
        registerAnswer(false);
      }
      
      addToast(isCorrect ? 'Correct! 🎉' : 'Try again!', isCorrect ? 'success' : 'error');

      if (isCorrect && currentIndex < allQuestions.length - 1) {
        // Use setTimeout to prevent multiple state updates in the same render cycle
        setTimeout(() => handleNext(), 500);
      }
    } catch (error) {
      console.error('Error processing answer:', error);
      addToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [currentIndex, addToast, handleNext, allQuestions, registerAnswer]);

  // Toggle gamification dashboard visibility
  const toggleGamificationDashboard = useCallback(() => {
    setShowGamificationDashboard(prev => !prev);
  }, []);

  // Get current question
  const currentQuestion = useMemo(() => {
    return allQuestions[currentIndex] || null;
  }, [allQuestions, currentIndex]);

  // Handle case where no questions are loaded
  if (allQuestions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center p-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          No questions available
        </h1>
        <p className="text-gray-400">
          Please check your connection and try again.
        </p>
      </div>
    );
  }

  // Handle case where current question doesn't exist
  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto text-center p-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          Question not found
        </h1>
        <p className="text-gray-400">
          There was an error loading the current question.
        </p>
      </div>
    );
  }

  // XP progress percentage calculation
  const xpProgressPercentage = (xp / xpToNextLevel) * 100;

  return (
    <div 
      className="max-w-4xl mx-auto" 
      role="main" 
      aria-live="polite"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Sign Language Quiz
        </h1>
        <p className="text-gray-400 text-center">
          Test your knowledge of sign language
        </p>
      </div>

      {/* XP Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <button 
            onClick={toggleGamificationDashboard}
            className="flex items-center text-white bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg transition-colors duration-300"
          >
            <span className="font-bold">Nivå {level}</span>
            <span className="ml-2 text-sm">{showGamificationDashboard ? '▲' : '▼'}</span>
          </button>
          <div className="text-sm text-gray-400">{xp}/{xpToNextLevel} XP</div>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300 ease-out"
            style={{ width: `${xpProgressPercentage}%` }}
          />
        </div>
      </div>

      {/* Gamification Dashboard */}
      <AnimatePresence>
        {showGamificationDashboard && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-6"
          >
            <MemoizedGamificationDashboard />
          </m.div>
        )}
      </AnimatePresence>

      <MemoizedQuizProgress
        currentQuestion={currentIndex + 1}
        totalQuestions={allQuestions.length}
        score={score}
      />

      {/* Use ErrorBoundary to catch rendering errors */}
      <div className={isLoading ? 'opacity-70 pointer-events-none' : ''}>
        <ErrorBoundary>
          <Suspense fallback={<Loading size="md" className="h-40" />}>
            <LazyMotion features={domAnimation}>
              <AnimatePresence mode="wait">
                <m.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MemoizedQuestionCard
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                  />
                </m.div>
              </AnimatePresence>
            </LazyMotion>
          </Suspense>
        </ErrorBoundary>
      </div>

      <MemoizedNavigationButtons
        currentIndex={currentIndex}
        totalQuestions={allQuestions.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
};