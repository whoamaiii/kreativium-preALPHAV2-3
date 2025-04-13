import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Question } from '../../types';

interface QuizListProps {
  quizzes: Question[];
  onEdit: (quiz: Question) => void;
  onDelete: (id: number) => void;
}

export const QuizList: React.FC<QuizListProps> = ({
  quizzes,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <motion.div
          key={quiz.id}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <Card className="h-full flex flex-col dark:bg-gray-800">
            <div className="aspect-square rounded-t-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                src={quiz.imageUrl}
                alt={quiz.text}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-medium mb-2 dark:text-white line-clamp-2">
                {quiz.text}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Answer: {quiz.correctAnswer}
              </p>
              
              <div className="mt-auto flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(quiz)}
                  className="flex-1"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onDelete(quiz.id)}
                  className="flex-1 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};