import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from './FormField';
import { cn } from '../../utils/cn';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  description?: string;
  error?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ name, label, description, error, className, ...props }, ref) => {
    const { register, formState: { errors } } = useFormContext();
    const fieldError = error || (errors[name]?.message as string);

    return (
      <FormField 
        name={name} 
        label={label} 
        error={fieldError}
        description={description}
        required={props.required}
      >
        <textarea
          {...register(name)}
          {...props}
          id={name}
          ref={ref}
          className={cn(
            "w-full px-4 py-2 rounded-lg border transition-colors",
            "focus:outline-none focus:ring-2",
            fieldError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500",
            "dark:bg-gray-700 dark:text-white",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "min-h-[100px] resize-y",
            className
          )}
        />
      </FormField>
    );
  }
);