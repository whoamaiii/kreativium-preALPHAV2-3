import React from 'react';
import { Switch } from '../ui/Switch';
import { FormField } from './FormField';

interface FormSwitchProps {
  name: string;
  label?: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const FormSwitch: React.FC<FormSwitchProps> = ({
  name,
  label,
  description,
  checked,
  onChange,
  disabled
}) => {
  return (
    <FormField 
      name={name}
      label={label}
      description={description}
    >
      <Switch
        id={name}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        aria-label={label}
      />
    </FormField>
  );
};