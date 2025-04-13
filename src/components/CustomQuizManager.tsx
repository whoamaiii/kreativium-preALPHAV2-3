import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { Card } from './Card';
import { CustomQuizCreator } from './CustomQuizCreator';
import { useCustomQuestions } from '../hooks/useCustomQuestions';
import { Question } from '../types';

interface CustomQuizManagerProps {
  onClose: () => void;
  onStartQuiz: (questions: Question[]) => void;
}

export const CustomQuizManager: React.FC<CustomQuizManagerProps> = ({
  onClose,
  onStartQuiz,
}) => {
  const [showCreator, setShowCreator] = useState(false);
  const { customQuestions, addCustomQuestion, removeCustomQuestion } = useCustomQuestions();

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold dark:text-white">Mine Spørsmål</h2>
          <Button
            onClick={() => setShowCreator(true)}
            className="group"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
            Nytt spørsmål
          </Button>
        </div>

        {customQuestions.length === 0 ? (
          <Card className="p-8 text-center dark:bg-gray-800">
            <p className="text-gray-600 dark:text-gray-400">
              Du har ingen egne spørsmål ennå. Klikk på "Nytt spørsmål" for å komme i gang!
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {customQuestions.map((question) => (
              <motion.div
                key={question.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="p-4 dark:bg-gray-800">
                  <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={question.imageUrl}
                      alt="Question"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="font-medium mb-2 dark:text-white">{question.text}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Svar: {question.correctAnswer}
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => removeCustomQuestion(question.id)}
                    className="w-full group"
                  >
                    <Trash2 className="w-4 h-4 mr-2 group-hover:text-red-500 transition-colors" />
                    Slett
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Tilbake
          </Button>
          <Button
            onClick={() => onStartQuiz(customQuestions)}
            disabled={customQuestions.length === 0}
          >
            Start Quiz
          </Button>
        </div>
      </div>

      {showCreator && (
        <CustomQuizCreator
          onSave={addCustomQuestion}
          onClose={() => setShowCreator(false)}
        />
      )}
    </>
  );
};