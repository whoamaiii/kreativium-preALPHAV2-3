/**
 * QuizGame Component
 * 
 * A comprehensive quiz game component that handles question display,
 * user input, scoring, and feedback.
 * 
 * @component
 * @example
 * ```tsx
 * <QuizGame
 *   questions={questions}
 *   onComplete={() => console.log('Quiz completed')}
 * />
 * ```
 */
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '../../store/quizStore';
import { Question } from '../../types';
import { QuestionCard } from './QuestionCard';
import { QuizProgress } from './QuizProgress';
import { QuizComplete } from './QuizComplete';
import { LevelUpModal } from './LevelUpModal';
import { useToast } from '../../hooks/useToast';

interface QuizGameProps {
  /** Array of questions to be used in the quiz */
  questions: Question[];
  /** Callback function called when the quiz is completed */
  onComplete?: () => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ questions, onComplete }) => {
  const {
    currentQuestion,
    score,
    streak,
    level,
    isComplete,
    showFeedback,
    isCorrect,
    initQuiz,
    submitAnswer,
    nextQuestion,
  } = useQuizStore();

  const { addToast } = useToast();
  const [showLevelUp, setShowLevelUp] = React.useState(false);
  const previousLevel = React.useRef(level);

  useEffect(() => {
    initQuiz(questions);
  }, [questions]);

  useEffect(() => {
    if (level > previousLevel.current) {
      setShowLevelUp(true);
      addToast(`Level ${level} Unlocked! 🎉`, 'success');
      previousLevel.current = level;
    }
  }, [level]);

  /**
   * Handles user answer submission
   * @param answer - The user's answer to the current question
   */
  const handleAnswer = (answer: string) => {
    const correct = submitAnswer(answer);
    if (correct) {
      addToast('Correct! 🎉', 'success');
    }
  };

  /**
   * Handles progression to the next question or quiz completion
   */
  const handleNext = () => {
    nextQuestion();
    if (isComplete) {
      onComplete?.();
    }
  };

  if (isComplete) {
    return <QuizComplete score={score} totalQuestions={questions.length} />;
  }

  return (
    <>
      <div className="space-y-8">
        <QuizProgress
          currentQuestion={currentQuestion + 1}
          totalQuestions={questions.length}
          score={score}
          streak={streak}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <QuestionCard
              question={questions[currentQuestion]}
              onAnswer={handleAnswer}
              onNext={handleNext}
              showFeedback={showFeedback}
              isCorrect={isCorrect}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <LevelUpModal
        isOpen={showLevelUp}
        onClose={() => setShowLevelUp(false)}
        level={level}
      />
    </>
  );
};