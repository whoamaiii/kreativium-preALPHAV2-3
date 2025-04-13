import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { LoadingScreen } from '../components/Loading';
import { errorTracker } from '../lib/errorTracking';

interface SessionContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const session = useSession();

  React.useEffect(() => {
    if (!session.isAuthenticated && !session.isLoading) {
      navigate('/login');
    }
  }, [session.isAuthenticated, session.isLoading, navigate]);

  React.useEffect(() => {
    const handleAuthError = (event: CustomEvent) => {
      errorTracker.captureMessage('Authentication error', {
        metadata: event.detail
      });
      navigate('/login');
    };

    window.addEventListener('auth:error' as any, handleAuthError);
    return () => {
      window.removeEventListener('auth:error' as any, handleAuthError);
    };
  }, [navigate]);

  if (session.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
};