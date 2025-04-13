import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2 } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { Question } from '../types';

interface QuizListProps {
  questions: Question[];
  onDelete: (id: number) => void;
  onEdit: (question: Question) => void;
}

export const QuizList: React.FC<QuizListProps> = ({
  questions,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {questions.map((question) => (
        <motion.div
          key={question.id}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <Card className="h-full flex flex-col dark:bg-gray-800">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                src={question.imageUrl}
                alt={question.text}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-medium mb-2 dark:text-white line-clamp-2">
                {question.text}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Svar: {question.correctAnswer}
              </p>
              
              <div className="mt-auto flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(question)}
                  className="flex-1"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Rediger
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onDelete(question.id)}
                  className="flex-1 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Slett
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};