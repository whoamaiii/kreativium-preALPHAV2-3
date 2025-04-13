import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  reloadPage?: () => void;
}

/**
 * Default error fallback UI component used by ErrorBoundary
 * Shows an error message with options to retry or reload
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  reloadPage
}) => {
  return (
    <div className="min-h-[300px] flex items-center justify-center p-4 rounded-lg bg-white/5 border border-red-300/10">
      <div className="text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          Something went wrong
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-2 max-w-md mx-auto">
          {error.message || 'An unexpected error occurred'}
        </p>
        
        {process.env.NODE_ENV !== 'production' && (
          <pre className="mt-2 mb-4 text-left text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-[200px] max-w-full">
            <code className="text-xs text-red-500 dark:text-red-400">
              {error.stack}
            </code>
          </pre>
        )}
        
        <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
          <Button onClick={resetErrorBoundary} variant="primary">
            Try again
          </Button>
          
          {reloadPage && (
            <Button onClick={reloadPage} variant="secondary">
              Reload page
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};