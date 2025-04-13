import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Question } from '../types';

interface QuizInterfaceProps {
  questions: Question[];
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onAnswer: (answer: string) => void;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({
  questions,
  currentIndex,
  onNext,
  onPrevious,
  onAnswer,
}) => {
  const [answer, setAnswer] = React.useState('');
  const currentQuestion = questions[currentIndex];
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onAnswer(answer.trim());
      setAnswer('');
      if (!isLastQuestion) {
        onNext();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden bg-gray-900/50 backdrop-blur-sm">
            <div className="p-6 space-y-6">
              {/* Question image */}
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
                <img
                  src={currentQuestion.imageUrl}
                  alt="Sign"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Question text */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {currentQuestion.text}
                </h2>

                {/* Answer form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                             text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                             focus:ring-purple-500 focus:border-transparent"
                  />
                  <div className="flex justify-between items-center pt-4">
                    <Button
                      onClick={onPrevious}
                      disabled={isFirstQuestion}
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    {isLastQuestion ? (
                      <Button
                        type="submit"
                        disabled={!answer.trim()}
                        className="flex items-center gap-2"
                      >
                        Submit Quiz
                      </Button>
                    ) : (
                      <Button
                        onClick={onNext}
                        className="flex items-center gap-2"
                      >
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};