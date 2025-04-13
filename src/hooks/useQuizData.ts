import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, setDoc, deleteDoc, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Question } from '../types/quiz';
import { useToast } from './useToast';
import { getTypedCollection } from '../lib/firebase/utils';
import { convertToQuestion, convertToQuestions } from '../utils/typeConverters';

export function useQuizData(categoryId?: string) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  // Fetch quizzes with caching
  const {
    data: quizzes,
    isLoading,
    error,
  } = useQuery<Question[]>({
    queryKey: ['quizzes', categoryId],
    queryFn: async () => {
      try {
        const constraints = [];
        
        if (categoryId) {
          constraints.push(where('category', '==', categoryId));
        }
        
        constraints.push(orderBy('createdAt', 'desc'));
        
        return getTypedCollection<Question>('quizzes', constraints);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Cache persists for 30 minutes
    retry: 2,
  });

  // Add quiz mutation
  const addQuizMutation = useMutation({
    mutationFn: async (newQuiz: Omit<Question, 'id'>) => {
      const docRef = doc(db, 'quizzes');
      await setDoc(docRef, {
        ...newQuiz,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      addToast('Quiz added successfully', 'success');
    },
    onError: () => {
      addToast('Failed to add quiz', 'error');
    },
  });

  // Update quiz mutation
  const updateQuizMutation = useMutation({
    mutationFn: async (quiz: Question) => {
      const docRef = doc(db, 'quizzes', quiz.id.toString());
      await setDoc(docRef, {
        ...quiz,
        updatedAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      addToast('Quiz updated successfully', 'success');
    },
    onError: () => {
      addToast('Failed to update quiz', 'error');
    },
  });

  // Delete quiz mutation
  const deleteQuizMutation = useMutation({
    mutationFn: async (quizId: string) => {
      const docRef = doc(db, 'quizzes', quizId);
      await deleteDoc(docRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      addToast('Quiz deleted successfully', 'success');
    },
    onError: () => {
      addToast('Failed to delete quiz', 'error');
    },
  });

  // Prefetch related categories
  const prefetchCategory = async (categoryId: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['quizzes', categoryId],
      queryFn: async () => {
        const constraints = [where('category', '==', categoryId)];
        return getTypedCollection<Question>('quizzes', constraints);
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  return {
    quizzes,
    isLoading,
    error,
    addQuiz: addQuizMutation.mutate,
    updateQuiz: updateQuizMutation.mutate,
    deleteQuiz: deleteQuizMutation.mutate,
    prefetchCategory,
    isAddingQuiz: addQuizMutation.isPending,
    isUpdatingQuiz: updateQuizMutation.isPending,
    isDeletingQuiz: deleteQuizMutation.isPending,
  };
}