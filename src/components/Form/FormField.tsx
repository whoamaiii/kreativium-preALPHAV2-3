import React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '../../utils/cn';

interface FormFieldProps {
  name: string;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  description,
  error,
  required,
  children
}) => {
  const formContext = useFormContext();
  const fieldError = error || (formContext?.formState?.errors[name]?.message as string);

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {children}

      {description && !fieldError && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}

      {fieldError && (
        <p className="text-sm text-red-500" role="alert">
          {fieldError}
        </p>
      )}
    </div>
  );
};