import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, storage } from '../lib/firebase';
import { LoadingScreen } from '../components/Loading';
import { useToast } from '../hooks/useToast';

interface FirebaseContextType {
  isInitialized: boolean;
  error: Error | null;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Verify Firebase services are initialized
        if (!auth || !db || !storage) {
          throw new Error('Firebase services failed to initialize');
        }

        // Test auth state change subscription
        const unsubAuth = auth.onAuthStateChanged(() => {
          setIsInitialized(true);
          unsubAuth();
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to initialize Firebase');
        setError(error);
        addToast('Firebase initialization failed. Please check your configuration.', 'error');
      }
    };

    initializeFirebase();
  }, [addToast]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-4">
            Please check your Firebase configuration in .env file
          </div>
          <p className="text-gray-400">
            Make sure you have:
            <ol className="list-decimal list-inside mt-2 text-left space-y-1">
              <li>Created a .env file based on .env.example</li>
              <li>Added valid Firebase configuration values</li>
              <li>Restarted the development server</li>
            </ol>
          </p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <FirebaseContext.Provider value={{ isInitialized, error }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};