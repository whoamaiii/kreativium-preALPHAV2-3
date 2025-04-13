import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import { AdminUser } from '../types/admin';

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'users'),
      where('id', '==', user.uid),
      where('role', '==', 'admin')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setIsAdmin(!snapshot.empty);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return {
    isAdmin,
    loading,
  };
}