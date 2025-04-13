import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ZoomIn } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ImageModal } from '../ImageModal';
import { Question } from '../../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  showFeedback: boolean;
  isCorrect: boolean;
  isLoading?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  onNext,
  showFeedback,
  isCorrect,
  isLoading
}) => {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (isLoading) {
    return <Card isLoading />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showFeedback && answer.trim()) {
      onAnswer(answer.trim());
      setAnswer('');
    }
  };

  return (
    <>
      <Card className="max-w-2xl mx-auto overflow-hidden">
        <div className="space-y-6 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
          >
            <div className="aspect-square w-full max-w-md mx-auto rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={question.imageUrl}
                alt="Tegnspråk tegn"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setShowModal(true)}
                className="absolute bottom-4 right-4 p-2 bg-white/80 dark:bg-gray-800/80 
                         rounded-full shadow-lg opacity-0 group-hover:opacity-100
                         transition-all duration-300"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Question content */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 dark:text-white">
              {question.text}
            </h3>

            {question.hint && (
              <div className="mb-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                >
                  <Lightbulb className="w-5 h-5 mr-2" />
                  {showHint ? 'Skjul hint' : 'Vis hint'}
                </Button>

                {showHint && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic"
                  >
                    {question.hint}
                  </motion.p>
                )}
              </div>
            )}

            {/* Answer form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Skriv svaret her..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 
                         focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                autoComplete="off"
              />
              <Button
                type="submit"
                disabled={!answer.trim()}
                className="w-full"
              >
                Svar
              </Button>
            </form>
          </div>
        </div>
      </Card>

      {showModal && (
        <ImageModal
          imageUrl={question.imageUrl}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};