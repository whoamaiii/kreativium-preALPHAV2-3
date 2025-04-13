import React from 'react';
import { cn } from '../../../utils/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div>
        <textarea
          ref={ref}
          className={cn(
            "w-full px-4 py-2 rounded-lg border transition-colors",
            "focus:outline-none focus:ring-2",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500",
            "dark:bg-gray-700 dark:text-white",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "min-h-[100px] resize-y",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);