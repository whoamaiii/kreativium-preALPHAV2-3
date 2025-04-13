import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from './FormField';
import { cn } from '../../utils/cn';
import { Check } from 'lucide-react';

interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label?: string;
  description?: string;
  error?: string;
}

export const FormCheckbox = React.forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ name, label, description, error, className, ...props }, ref) => {
    const { register, formState: { errors } } = useFormContext();
    const fieldError = error || (errors[name]?.message as string);

    return (
      <FormField 
        name={name} 
        error={fieldError}
        description={description}
        required={props.required}
      >
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              {...register(name)}
              {...props}
              ref={ref}
              className="sr-only"
            />
            <div
              className={cn(
                "w-5 h-5 border-2 rounded transition-colors",
                "flex items-center justify-center",
                props.checked
                  ? "bg-purple-500 border-purple-500"
                  : "border-gray-300 dark:border-gray-600",
                className
              )}
            >
              {props.checked && <Check className="w-3 h-3 text-white" />}
            </div>
          </div>
          {label && (
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
        </label>
      </FormField>
    );
  }
);