import React, { forwardRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormFieldProps } from '../../types/components';
import { cn } from '../../utils/cn';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'>, FormFieldProps {}

/**
 * Enhanced FormInput component with react-hook-form integration
 * 
 * @example
 * <FormInput 
 *   name="email" 
 *   label="Email Address" 
 *   required 
 * />
 */
export const FormInput = forwardRef<HTMLInputElement, InputProps>(
  ({ name, label, error, required, className, type = 'text', ...props }, forwardedRef) => {
    const { control, formState } = useFormContext();
    // Get error from form state if not provided directly
    const fieldError = error || formState.errors[name]?.message?.toString();
    const hasError = !!fieldError;
    
    // Generate IDs for accessibility
    const inputId = `${name}-input`;
    const errorId = `${name}-error`;
    
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { ref, ...field } }) => (
          <div className="mb-4">
            {label && (
              <label 
                htmlFor={inputId}
                className={cn(
                  "block text-sm font-medium mb-1",
                  hasError ? "text-red-500 dark:text-red-400" : "text-gray-700 dark:text-gray-300"
                )}
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}

            <input
              id={inputId}
              type={type}
              className={cn(
                "w-full px-3 py-2 border rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
                hasError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/30 bg-red-50 dark:bg-red-900/10"
                  : "border-gray-300 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/30",
                "bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
                className
              )}
              aria-invalid={hasError}
              aria-describedby={hasError ? errorId : undefined}
              aria-required={required}
              required={required}
              ref={(e) => {
                // Handle both react-hook-form ref and forwardedRef
                ref(e);
                if (forwardedRef) {
                  if (typeof forwardedRef === 'function') {
                    forwardedRef(e);
                  } else {
                    forwardedRef.current = e;
                  }
                }
              }}
              {...field}
              {...props}
            />

            {hasError && (
              <p 
                id={errorId}
                className="mt-1 text-sm text-red-500 dark:text-red-400" 
                role="alert"
              >
                {fieldError}
              </p>
            )}
          </div>
        )}
      />
    );
  }
);

FormInput.displayName = 'FormInput';