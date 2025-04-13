import { useState, useEffect } from 'react';
import { Question } from '../types';

export function useCustomQuestions() {
  const [customQuestions, setCustomQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('customQuestions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('customQuestions', JSON.stringify(customQuestions));
  }, [customQuestions]);

  const addCustomQuestion = (question: Question) => {
    setCustomQuestions(prev => [...prev, question]);
  };

  const removeCustomQuestion = (id: number) => {
    setCustomQuestions(prev => prev.filter(q => q.id !== id));
  };

  return {
    customQuestions,
    addCustomQuestion,
    removeCustomQuestion
  };
}