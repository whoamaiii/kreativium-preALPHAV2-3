import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Upload, Settings } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { QuizList } from '../components/QuizList';
import { QuizCreator } from '../components/QuizCreator';
import { QuizSettings } from '../components/QuizSettings';
import { useQuizManager } from '../hooks/useQuizManager';
import { useToast } from '../hooks/useToast';
import { Question } from '../types';

const CustomQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useQuizManager();
  const { addToast } = useToast();
  const [showCreator, setShowCreator] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const handleExport = () => {
    try {
      const data = {
        questions,
        version: '1.0.0',
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quiz_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast('Quiz eksportert!', 'success');
    } catch (error) {
      addToast('Kunne ikke eksportere quiz', 'error');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!Array.isArray(data.questions)) {
          throw new Error('Invalid file format');
        }

        data.questions.forEach(addQuestion);
        addToast('Quiz importert!', 'success');
      } catch {
        addToast('Kunne ikke importere quiz', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Mine Quiz</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Lag og administrer dine egne quiz-spørsmål
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setShowCreator(true)}
            className="group"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
            Nytt spørsmål
          </Button>

          <Button
            variant="secondary"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="w-5 h-5 mr-2" />
            Innstillinger
          </Button>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleExport}
              disabled={questions.length === 0}
            >
              <Download className="w-5 h-5 mr-2" />
              Eksporter
            </Button>

            <label className="relative">
              <Button variant="secondary" as="div">
                <Upload className="w-5 h-5 mr-2" />
                Importer
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
      </div>

      {questions.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Du har ingen spørsmål ennå. Klikk på "Nytt spørsmål" for å komme i gang!
          </p>
        </Card>
      ) : (
        <QuizList
          questions={questions}
          onDelete={deleteQuestion}
          onEdit={(question) => {
            setEditingQuestion(question);
            setShowCreator(true);
          }}
        />
      )}

      {showCreator && (
        <QuizCreator
          question={editingQuestion}
          onSave={(question) => {
            if (editingQuestion) {
              updateQuestion(question);
              addToast('Spørsmål oppdatert!', 'success');
            } else {
              addQuestion(question);
              addToast('Spørsmål lagt til!', 'success');
            }
            setShowCreator(false);
            setEditingQuestion(null);
          }}
          onClose={() => {
            setShowCreator(false);
            setEditingQuestion(null);
          }}
        />
      )}

      {showSettings && (
        <QuizSettings
          onClose={() => setShowSettings(false)}
        />
      )}

      {questions.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={() => navigate('/quiz/custom')}
            className="group"
          >
            Start Quiz
            <svg
              className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomQuiz;