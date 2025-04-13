import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from './Button';

export const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-6 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Oops! Noe gikk galt
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error.message || 'En uventet feil oppstod. Vennligst prøv igjen.'}
          </p>
        </div>
        <Button 
          onClick={resetErrorBoundary}
          className="mx-auto"
        >
          <RefreshCcw className="w-5 h-5 mr-2" />
          Prøv igjen
        </Button>
      </div>
    </div>
  );
};