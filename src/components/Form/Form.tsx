import React from 'react';
import {
  useForm,
  FormProvider,
  UseFormProps,
  SubmitHandler,
  FieldValues,
} from 'react-hook-form';
import { z } from 'zod';
import { createFormValidator } from '../../lib/validation';

interface FormProps<T extends FieldValues> extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  schema?: z.ZodType<T>;
  onSubmit: SubmitHandler<T>;
  defaultValues?: UseFormProps<T>['defaultValues'];
  children: React.ReactNode;
}

export function Form<T extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  children,
  ...props
}: FormProps<T>) {
  const methods = useForm<T>({
    defaultValues,
    validate: schema ? createFormValidator(schema) : undefined,
  });

  return (
    <FormProvider {...methods}>
      <form 
        onSubmit={methods.handleSubmit(onSubmit)} 
        {...props}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
}