import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ZoomIn } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Question } from '../types';
import { useTranslation } from 'react-i18next';

interface MultiChoiceQuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  isAnswered: boolean;
  selectedAnswer?: string;
}

export const MultiChoiceQuestionCard: React.FC<MultiChoiceQuestionCardProps> = ({
  question,
  onAnswer,
  isAnswered,
  selectedAnswer,
}) => {
  const [showHint, setShowHint] = useState(false);
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden bg-gray-900/50 backdrop-blur-sm">
      <div className="p-6 space-y-6">
        <div className="aspect-square relative group">
          <img
            src={question.imageUrl}
            alt={`Sign language gesture`}
            className="w-full h-full object-contain bg-gray-800 rounded-lg"
          />
          <button
            className="absolute bottom-4 right-4 p-2 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => window.open(question.imageUrl, '_blank')}
            aria-label="View full size image"
          >
            <ZoomIn className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">{question.text}</h3>

          {question.hint && (
            <div className="mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                aria-expanded={showHint}
              >
                <Lightbulb className="w-5 h-5 mr-2" />
                {showHint ? t('game.hideHint') : t('game.hint')}
              </Button>

              {showHint && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-gray-400 italic"
                  role="note"
                >
                  {question.hint}
                </motion.p>
              )}
            </div>
          )}

          <div className="space-y-3">
            {question.options?.map((option) => {
              // Determine button styling based on answer status
              let variant: "primary" | "secondary" | "ghost" = "secondary";

              if (isAnswered) {
                if (option.toLowerCase() === question.correctAnswer.toLowerCase()) {
                  // Use class names instead of variant for success/error states
                  return (
                    <Button
                      key={option}
                      variant="primary"
                      className="w-full justify-start text-left py-4 bg-green-600 hover:bg-green-700"
                      disabled={true}
                    >
                      {option}
                    </Button>
                  );
                } else if (selectedAnswer === option) {
                  return (
                    <Button
                      key={option}
                      variant="secondary"
                      className="w-full justify-start text-left py-4 bg-red-600 hover:bg-red-700"
                      disabled={true}
                    >
                      {option}
                    </Button>
                  );
                }
              }

              return (
                <Button
                  key={option}
                  variant={variant}
                  className="w-full justify-start text-left py-4"
                  onClick={() => !isAnswered && onAnswer(option)}
                  disabled={isAnswered}
                >
                  {option}
                </Button>
              );
            })}
          </div>

          {isAnswered && question.explanation && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 p-4 bg-gray-800/50 rounded-lg"
            >
              <h4 className="font-semibold mb-2">{t('game.explanation')}</h4>
              <p className="text-gray-300">{question.explanation}</p>
            </motion.div>
          )}
        </div>
      </div>
    </Card>
  );
}; 