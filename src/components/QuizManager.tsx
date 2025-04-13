import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { QuizCreator } from './QuizCreator';
import { QuizList } from './QuizList';
import { useQuizManager } from '../hooks/useQuizManager';
import { Question } from '../types';
import { useToast } from '../hooks/useToast';

interface QuizManagerProps {
  onClose: () => void;
  onStartQuiz: (questions: Question[]) => void;
}

export const QuizManager: React.FC<QuizManagerProps> = ({
  onClose,
  onStartQuiz,
}) => {
  const [showCreator, setShowCreator] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useQuizManager();
  const { addToast } = useToast();

  const handleSave = (question: Question) => {
    if (editingQuestion) {
      updateQuestion(question);
      addToast('Spørsmål oppdatert!', 'success');
    } else {
      addQuestion(question);
      addToast('Nytt spørsmål lagt til!', 'success');
    }
    setShowCreator(false);
    setEditingQuestion(null);
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setShowCreator(true);
  };

  const handleDelete = (id: number) => {
    deleteQuestion(id);
    addToast('Spørsmål slettet', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Mine Spørsmål</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Lag og administrer dine egne quiz-spørsmål
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingQuestion(null);
            setShowCreator(true);
          }}
          className="w-full sm:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nytt spørsmål
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {questions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 dark:text-gray-400">
              Du har ingen spørsmål ennå. Klikk på "Nytt spørsmål" for å komme i gang!
            </p>
          </motion.div>
        ) : (
          <QuizList
            questions={questions}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      </AnimatePresence>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="secondary"
          onClick={onClose}
          className="w-full sm:w-auto"
        >
          Tilbake
        </Button>
        <Button
          onClick={() => onStartQuiz(questions)}
          disabled={questions.length === 0}
          className="w-full sm:w-auto"
        >
          Start Quiz ({questions.length} spørsmål)
        </Button>
      </div>

      <AnimatePresence>
        {showCreator && (
          <QuizCreator
            onSave={handleSave}
            onClose={() => {
              setShowCreator(false);
              setEditingQuestion(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};