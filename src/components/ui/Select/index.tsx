import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled,
  error,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "relative w-full py-2 pl-3 pr-10 text-left rounded-lg border",
          "focus:outline-none focus:ring-2",
          disabled && "opacity-50 cursor-not-allowed",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500",
          "dark:bg-gray-700 dark:text-white",
          className
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className="block truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown className="w-4 h-4 text-gray-400" aria-hidden="true" />
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-auto"
            role="listbox"
          >
            {options.map((option) => (
              <li
                key={option.value}
                className={cn(
                  "relative py-2 pl-10 pr-4 cursor-pointer select-none",
                  "hover:bg-purple-50 dark:hover:bg-purple-900/50",
                  option.value === value && "bg-purple-50 dark:bg-purple-900/50"
                )}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={option.value === value}
              >
                <span className="block truncate font-medium">
                  {option.label}
                </span>
                {option.value === value && (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600">
                    <Check className="w-4 h-4" aria-hidden="true" />
                  </span>
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-1 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};