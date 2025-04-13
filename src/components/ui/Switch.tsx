import React from 'react';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({
  className = '',
  checked = false,
  onCheckedChange,
  id,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked);
  };

  return (
    <label
      htmlFor={id}
      className={`
        relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full 
        border-2 border-transparent transition-colors duration-200 ease-in-out 
        focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500 
        focus-within:ring-offset-2 disabled:cursor-not-allowed
        ${checked ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}
        ${className}
      `}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        className="sr-only"
        {...props}
      />
      <span
        aria-hidden="true"
        className={`
          pointer-events-none inline-block h-4 w-4 transform rounded-full 
          bg-white shadow ring-0 transition duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </label>
  );
};