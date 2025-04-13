import { useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Question, Category, MediaFile } from '../types';

export function usePrefetch() {
  const queryClient = useQueryClient();

  const prefetchQuizzes = async (categoryId?: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['quizzes', categoryId],
      queryFn: async () => {
        let q = collection(db, 'quizzes');
        if (categoryId) {
          q = query(q, where('category', '==', categoryId));
        }
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Question[];
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  const prefetchCategories = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: async () => {
        const snapshot = await getDocs(collection(db, 'categories'));
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
      },
      staleTime: 1000 * 60 * 15, // 15 minutes
    });
  };

  const prefetchMedia = async (folderId?: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['media', folderId],
      queryFn: async () => {
        let q = collection(db, 'media');
        if (folderId) {
          q = query(q, where('folderId', '==', folderId));
        }
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MediaFile[];
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  return {
    prefetchQuizzes,
    prefetchCategories,
    prefetchMedia,
  };
}