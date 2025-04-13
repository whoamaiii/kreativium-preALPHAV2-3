import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { QuestionCard } from './QuestionCard';
import { LevelProgress } from '../LevelProgress';
import { useQuizStore } from '../../store/quizStore';
import { useProgress } from '../../hooks/useProgress';
import { Question } from '../../types/quiz';

interface QuizGameProps {
  questions: Question[];
  onBack: () => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ questions, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { score, addScore } = useQuizStore();
  const { progress, updateProgress } = useProgress();

  const handleAnswer = (answer: string) => {
    const isCorrect = answer.toLowerCase() === questions[currentQuestion].correctAnswer.toLowerCase();
    
    if (isCorrect) {
      addScore(10);
      updateProgress({
        xp: progress.xp + 10,
        stats: {
          ...progress.stats,
          totalCorrect: progress.stats.totalCorrect + 1,
        },
      });
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-white hover:text-purple-400"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        
        <div className="text-white">
          Score: {score}
        </div>
      </div>

      <LevelProgress
        level={progress.level}
        xp={progress.xp}
        maxXp={400}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mt-8"
        >
          <QuestionCard
            question={questions[currentQuestion]}
            onAnswer={handleAnswer}
            totalQuestions={questions.length}
            currentQuestion={currentQuestion + 1}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};