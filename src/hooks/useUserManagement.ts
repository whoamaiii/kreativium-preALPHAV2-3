import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AdminUser } from '../types/admin';
import { useToast } from './useToast';
import { auditLogger } from '../lib/auditLogger';

export function useUserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const { addToast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AdminUser[];
      setUsers(newUsers);
    });

    return () => unsubscribe();
  }, []);

  const addUser = async (user: Omit<AdminUser, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...user,
        createdAt: new Date().toISOString(),
      });

      await auditLogger.log('user.create', user, {
        userId: docRef.id,
        role: user.role,
      });

      return docRef.id;
    } catch (error) {
      addToast('Failed to create user', 'error');
      throw error;
    }
  };

  const updateUser = async (user: AdminUser) => {
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        ...user,
        updatedAt: new Date().toISOString(),
      });

      await auditLogger.log('user.update', user, {
        userId: user.id,
        role: user.role,
      });
    } catch (error) {
      addToast('Failed to update user', 'error');
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      await auditLogger.log('user.delete', { id }, { userId: id });
      addToast('User deleted successfully', 'success');
    } catch (error) {
      addToast('Failed to delete user', 'error');
      throw error;
    }
  };

  const exportUsers = () => {
    try {
      const data = {
        users,
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast('Users exported successfully', 'success');
    } catch (error) {
      addToast('Failed to export users', 'error');
      throw error;
    }
  };

  const importUsers = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data.users)) {
        throw new Error('Invalid file format');
      }

      const importPromises = data.users.map((user: Omit<AdminUser, 'id'>) =>
        addDoc(collection(db, 'users'), {
          ...user,
          createdAt: new Date().toISOString(),
        })
      );

      await Promise.all(importPromises);
      addToast('Users imported successfully', 'success');
    } catch (error) {
      addToast('Failed to import users', 'error');
      throw error;
    }
  };

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
    exportUsers,
    importUsers,
  };
}