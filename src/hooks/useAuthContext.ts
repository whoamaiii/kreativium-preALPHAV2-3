import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../context/AuthContext';

/**
 * Hook for using authentication context
 */
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export * from '../context/AuthContext';
