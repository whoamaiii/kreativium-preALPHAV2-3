import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/Toast/ToastContainer';
import { KidsProvider } from './context/KidsContext';
import { ILPProvider } from './context/ILPContext';
import { AuthProvider } from './context/AuthContext';
import { App } from './App';
import { queryClient } from './lib/queryClient';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <KidsProvider>
            <ILPProvider>
              <AuthProvider initialUser="teacher789">
                <App />
                <ToastContainer />
              </AuthProvider>
            </ILPProvider>
          </KidsProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);