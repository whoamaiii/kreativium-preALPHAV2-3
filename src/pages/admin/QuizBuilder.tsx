import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings, Download, Upload } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { QuizList } from '../../components/admin/QuizList';
import { QuizEditor } from '../../components/admin/QuizEditor';
import { useQuizBuilder } from '../../hooks/useQuizBuilder';
import { useToast } from '../../hooks/useToast';
import { Question } from '../../types';

export const QuizBuilder: React.FC = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Question | null>(null);
  const { quizzes, addQuiz, updateQuiz, deleteQuiz, exportQuizzes, importQuizzes } = useQuizBuilder();
  const { addToast } = useToast();

  const handleSave = async (quiz: Question) => {
    try {
      if (editingQuiz) {
        await updateQuiz(quiz);
        addToast('Quiz updated successfully!', 'success');
      } else {
        await addQuiz(quiz);
        addToast('Quiz created successfully!', 'success');
      }
      setShowEditor(false);
      setEditingQuiz(null);
    } catch (error) {
      addToast('Failed to save quiz', 'error');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importQuizzes(file);
      addToast('Quizzes imported successfully!', 'success');
    } catch (error) {
      addToast('Failed to import quizzes', 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quiz Builder</h1>
          <p className="text-gray-400">Create and manage your quizzes</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setShowEditor(true)}>
            <Plus className="w-5 h-5 mr-2" />
            New Quiz
          </Button>

          <Button variant="secondary" onClick={exportQuizzes}>
            <Download className="w-5 h-5 mr-2" />
            Export
          </Button>

          <label className="relative">
            <Button variant="secondary" as="div">
              <Upload className="w-5 h-5 mr-2" />
              Import
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {showEditor ? (
        <QuizEditor
          quiz={editingQuiz}
          onSave={handleSave}
          onCancel={() => {
            setShowEditor(false);
            setEditingQuiz(null);
          }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {quizzes.length === 0 ? (
            <Card className="p-8 text-center">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">No Quizzes Yet</h2>
              <p className="text-gray-400 mb-4">
                Get started by creating your first quiz!
              </p>
              <Button onClick={() => setShowEditor(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Create Quiz
              </Button>
            </Card>
          ) : (
            <QuizList
              quizzes={quizzes}
              onEdit={(quiz) => {
                setEditingQuiz(quiz);
                setShowEditor(true);
              }}
              onDelete={deleteQuiz}
            />
          )}
        </motion.div>
      )}
    </div>
  );
};