import React, { ReactNode } from 'react';
import { useForm, FormProvider, SubmitHandler, UseFormProps, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';

export interface FormWrapperProps<TFormValues extends FieldValues> {
  children: ReactNode;
  onSubmit: SubmitHandler<TFormValues>;
  schema?: ZodSchema<any>;
  defaultValues?: UseFormProps<TFormValues>['defaultValues'];
  className?: string;
  id?: string;
}

/**
 * FormWrapper component that integrates react-hook-form with zod validation
 * 
 * @example
 * <FormWrapper<LoginFormInputs> 
 *   onSubmit={handleLogin} 
 *   schema={loginFormSchema}
 *   defaultValues={{ email: '', password: '' }}
 * >
 *   <FormInput name="email" label="Email" />
 *   <FormInput name="password" label="Password" type="password" />
 *   <Button type="submit">Login</Button>
 * </FormWrapper>
 */
export function FormWrapper<TFormValues extends FieldValues>({
  children,
  onSubmit,
  schema,
  defaultValues,
  className,
  id,
}: FormWrapperProps<TFormValues>) {
  const methods = useForm<TFormValues>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form
        id={id}
        className={className}
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate // Let the form validation handle it
      >
        {children}
      </form>
    </FormProvider>
  );
} 