import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from './FormField';
import { cn } from '../../utils/cn';

interface FormRadioGroupProps {
  name: string;
  label?: string;
  description?: string;
  error?: string;
  options: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
}

export const FormRadioGroup = React.forwardRef<HTMLDivElement, FormRadioGroupProps>(
  ({ name, label, description, error, options }, ref) => {
    const { register, formState: { errors } } = useFormContext();
    const fieldError = error || (errors[name]?.message as string);

    return (
      <FormField 
        name={name} 
        label={label} 
        error={fieldError}
        description={description}
      >
        <div ref={ref} className="space-y-2">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <input
                type="radio"
                {...register(name)}
                value={option.value}
                className="w-4 h-4 text-purple-500 border-gray-300 focus:ring-purple-500"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {option.description}
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
      </FormField>
    );
  }
);