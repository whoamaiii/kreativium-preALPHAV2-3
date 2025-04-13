import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from './FormField';
import { cn } from '../../utils/cn';
import { Check, ChevronsUpDown } from 'lucide-react';

interface FormComboboxProps {
  name: string;
  label?: string;
  description?: string;
  error?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  placeholder?: string;
}

export const FormCombobox = React.forwardRef<HTMLDivElement, FormComboboxProps>(
  ({ name, label, description, error, options, placeholder = 'Select option...' }, ref) => {
    const { register, setValue, watch } = useFormContext();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const value = watch(name);

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <FormField 
        name={name} 
        label={label} 
        error={error}
        description={description}
      >
        <div ref={ref} className="relative">
          <div
            className={cn(
              "relative w-full cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600",
              "bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left shadow-sm",
              "focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            )}
            onClick={() => setOpen(!open)}
          >
            <span className="block truncate">
              {value ? options.find(o => o.value === value)?.label : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsUpDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </span>
          </div>

          {open && (
            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 shadow-lg">
              <input
                className="w-full px-3 py-2 border-b dark:border-gray-600"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "relative cursor-pointer select-none py-2 pl-10 pr-4",
                    "hover:bg-purple-100 dark:hover:bg-purple-900",
                    value === option.value ? "bg-purple-50 dark:bg-purple-900" : ""
                  )}
                  onClick={() => {
                    setValue(name, option.value);
                    setOpen(false);
                  }}
                >
                  <span className={cn("block truncate", value === option.value ? "font-medium" : "font-normal")}>
                    {option.label}
                  </span>
                  {value === option.value && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </FormField>
    );
  }
);