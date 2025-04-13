import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ZoomIn } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
}) => {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onAnswer(answer.trim());
      setAnswer('');
    }
  };

  return (
    <Card className="overflow-hidden bg-gray-900/50 backdrop-blur-sm">
      <div className="p-6 space-y-6">
        <div className="aspect-square relative group">
          <img
            src={question.imageUrl}
            alt={`Sign for: ${question.correctAnswer}`}
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
                {showHint ? 'Hide Hint' : 'Show Hint'}
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="answer" className="sr-only">
                Your answer
              </label>
              <input
                id="answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoComplete="off"
                aria-required="true"
              />
            </div>
            <Button
              type="submit"
              disabled={!answer.trim()}
              className="w-full"
            >
              Submit Answer
            </Button>
          </form>
        </div>
      </div>
    </Card>
  );
};