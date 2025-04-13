import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Category } from '../types';
import { useToast } from './useToast';

export function useCategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { addToast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newCategories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
      setCategories(newCategories);
    });

    return () => unsubscribe();
  }, []);

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      await addDoc(collection(db, 'categories'), {
        ...category,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      addToast('Failed to create category', 'error');
      throw error;
    }
  };

  const updateCategory = async (category: Category) => {
    try {
      const categoryRef = doc(db, 'categories', category.id);
      await updateDoc(categoryRef, {
        ...category,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      addToast('Failed to update category', 'error');
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      addToast('Category deleted successfully', 'success');
    } catch (error) {
      addToast('Failed to delete category', 'error');
      throw error;
    }
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}