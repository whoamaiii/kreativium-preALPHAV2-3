import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Question } from '../types';
import { useToast } from './useToast';

export function useQuizBuilder() {
  const [quizzes, setQuizzes] = useState<Question[]>([]);
  const { addToast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newQuizzes = snapshot.docs.map((doc) => ({
        id: parseInt(doc.id),
        ...doc.data(),
      })) as Question[];
      setQuizzes(newQuizzes);
    });

    return () => unsubscribe();
  }, []);

  const addQuiz = async (quiz: Omit<Question, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'quizzes'), {
        ...quiz,
        createdAt: new Date().toISOString(),
      });
      return parseInt(docRef.id);
    } catch (error) {
      addToast('Failed to create quiz', 'error');
      throw error;
    }
  };

  const updateQuiz = async (quiz: Question) => {
    try {
      const quizRef = doc(db, 'quizzes', quiz.id.toString());
      await updateDoc(quizRef, {
        ...quiz,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      addToast('Failed to update quiz', 'error');
      throw error;
    }
  };

  const deleteQuiz = async (id: number) => {
    try {
      await deleteDoc(doc(db, 'quizzes', id.toString()));
      addToast('Quiz deleted successfully', 'success');
    } catch (error) {
      addToast('Failed to delete quiz', 'error');
      throw error;
    }
  };

  const exportQuizzes = () => {
    try {
      const data = {
        quizzes,
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quizzes_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast('Quizzes exported successfully', 'success');
    } catch (error) {
      addToast('Failed to export quizzes', 'error');
      throw error;
    }
  };

  const importQuizzes = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data.quizzes)) {
        throw new Error('Invalid file format');
      }

      const importPromises = data.quizzes.map((quiz: Omit<Question, 'id'>) =>
        addDoc(collection(db, 'quizzes'), {
          ...quiz,
          createdAt: new Date().toISOString(),
        })
      );

      await Promise.all(importPromises);
      addToast('Quizzes imported successfully', 'success');
    } catch (error) {
      addToast('Failed to import quizzes', 'error');
      throw error;
    }
  };

  return {
    quizzes,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    exportQuizzes,
    importQuizzes,
  };
}