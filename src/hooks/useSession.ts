import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { authManager } from '../lib/auth';
import { useToast } from './useToast';
import { errorTracker } from '../lib/errorTracking';

export function useSession() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          const token = await authManager.getValidToken();
          if (token) {
            setIsAuthenticated(true);
            errorTracker.setUser(user);
          } else {
            setIsAuthenticated(false);
            errorTracker.setUser(null);
          }
        } else {
          setIsAuthenticated(false);
          errorTracker.setUser(null);
        }
      } catch (error) {
        errorTracker.captureException(error, {
          action: 'session_validation',
        });
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await authManager.invalidateSession();
      setIsAuthenticated(false);
      addToast('Logged out successfully', 'success');
    } catch (error) {
      errorTracker.captureException(error, {
        action: 'logout',
      });
      addToast('Failed to log out', 'error');
    }
  };

  return {
    isAuthenticated,
    isLoading,
    logout,
  };
}