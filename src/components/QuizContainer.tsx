import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizProgress } from './QuizProgress';
import { QuestionCard } from './QuestionCard';
import { useToast } from '../hooks/useToast';
import { Question } from '../types';

interface QuizContainerProps {
  questions: Question[];
  onComplete: (score: number) => void;
}

export const QuizContainer: React.FC<QuizContainerProps> = ({
  questions,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const { addToast } = useToast();

  const handleAnswer = useCallback((answer: string) => {
    const isCorrect = answer.toLowerCase() === questions[currentIndex].correctAnswer.toLowerCase();
    
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentIndex] = answer;
      return newAnswers;
    });

    if (isCorrect) {
      setScore(prev => prev + 10);
      addToast('Correct! 🎉', 'success');
      
      if (currentIndex === questions.length - 1) {
        onComplete(score + 10); // Include the points from the last correct answer
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    } else {
      addToast('Try again!', 'error');
    }
  }, [currentIndex, questions, score, onComplete, addToast]);

  return (
    <div className="max-w-4xl mx-auto">
      <QuizProgress
        currentQuestion={currentIndex + 1}
        totalQuestions={questions.length}
        score={score}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <QuestionCard
            question={questions[currentIndex]}
            onAnswer={handleAnswer}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};