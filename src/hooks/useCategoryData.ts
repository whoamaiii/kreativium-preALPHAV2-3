import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Category } from '../types';
import { useToast } from './useToast';

export function useCategoryData() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  // Fetch categories with caching
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
    },
    staleTime: 1000 * 60 * 15, // Data is fresh for 15 minutes
    gcTime: 1000 * 60 * 60, // Cache persists for 1 hour
  });

  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (newCategory: Omit<Category, 'id'>) => {
      const docRef = doc(collection(db, 'categories'));
      await setDoc(docRef, {
        ...newCategory,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addToast('Category added successfully', 'success');
    },
    onError: () => {
      addToast('Failed to add category', 'error');
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async (category: Category) => {
      const docRef = doc(db, 'categories', category.id);
      await setDoc(docRef, {
        ...category,
        updatedAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addToast('Category updated successfully', 'success');
    },
    onError: () => {
      addToast('Failed to update category', 'error');
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const docRef = doc(db, 'categories', categoryId);
      await deleteDoc(docRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addToast('Category deleted successfully', 'success');
    },
    onError: () => {
      addToast('Failed to delete category', 'error');
    },
  });

  return {
    categories,
    isLoading,
    error,
    addCategory: addCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    isAddingCategory: addCategoryMutation.isPending,
    isUpdatingCategory: updateCategoryMutation.isPending,
    isDeletingCategory: deleteCategoryMutation.isPending,
  };
}