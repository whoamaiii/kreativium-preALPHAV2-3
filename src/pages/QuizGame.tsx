import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useQuestions } from '../hooks/useQuestions';
import { useQuizStore } from '../store/quizStore';

const QuizGame: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { questions, isLoading } = useQuestions(categoryId);
  const { 
    currentQuestion,
    score,
    submitAnswer,
    nextQuestion,
    isComplete,
    initQuiz 
  } = useQuizStore();

  useEffect(() => {
    if (!isLoading && questions) {
      initQuiz(questions);
    }
  }, [questions, isLoading, initQuiz]);

  useEffect(() => {
    if (!isLoading && (!questions || questions.length === 0)) {
      navigate('/quiz');
    }
  }, [questions, isLoading, navigate]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!questions || questions.length === 0) {
    return null;
  }

  if (isComplete) {
    navigate('/quiz/results', { 
      state: { 
        score,
        total: questions.length,
        categoryId 
      }
    });
    return null;
  }

  const question = questions[currentQuestion];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-400">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <div className="text-white font-bold">
              Score: {score}
            </div>
          </div>
          <div className="h-2 bg-gray-700 rounded-full">
            <motion.div
              className="h-full bg-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-6 bg-gray-900/50 backdrop-blur-sm">
              <div className="aspect-square mb-6 rounded-lg overflow-hidden bg-gray-800">
                <img
                  src={question.imageUrl}
                  alt="Quiz question"
                  className="w-full h-full object-contain"
                />
              </div>

              <h2 className="text-xl font-bold text-white mb-6">
                {question.text}
              </h2>

              <div className="space-y-4">
                {question.options?.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => {
                      const isCorrect = submitAnswer(option);
                      if (isCorrect) {
                        setTimeout(nextQuestion, 1000);
                      }
                    }}
                    variant="secondary"
                    className="w-full text-left justify-start"
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {question.hint && (
                <p className="mt-4 text-sm text-gray-400 italic">
                  Hint: {question.hint}
                </p>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/quiz')}
          >
            Exit Quiz
          </Button>
          <Button
            onClick={nextQuestion}
            disabled={currentQuestion === questions.length - 1}
          >
            Next Question
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizGame;