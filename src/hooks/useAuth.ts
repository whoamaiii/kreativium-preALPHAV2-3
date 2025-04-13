import { useState, useCallback } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { authManager } from '../lib/auth';
import { useToast } from './useToast';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      const refreshToken = await userCredential.user.getIdTokenResult();
      
      // Set up token refresh
      authManager.setupTokenRefresh(refreshToken.expirationTime.getTime() - Date.now());
      
      return userCredential.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, { displayName });
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        displayName,
        role: 'viewer',
        createdAt: new Date().toISOString(),
      });

      const token = await userCredential.user.getIdToken();
      const refreshToken = await userCredential.user.getIdTokenResult();
      
      // Set up token refresh
      authManager.setupTokenRefresh(refreshToken.expirationTime.getTime() - Date.now());
      
      return userCredential.user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authManager.invalidateSession();
      addToast('Signed out successfully', 'success');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }, [addToast]);

  return {
    user: auth.currentUser,
    loading,
    signIn,
    signUp,
    signOut,
  };
}