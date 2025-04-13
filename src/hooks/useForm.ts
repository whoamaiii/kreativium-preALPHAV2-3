import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useHookForm, UseFormProps } from 'react-hook-form';
import { z } from 'zod';

interface UseAppFormProps<T extends z.ZodType> extends Omit<UseFormProps<z.infer<T>>, 'resolver'> {
  schema: T;
}

export function useAppForm<T extends z.ZodType>({ schema, ...props }: UseAppFormProps<T>) {
  return useHookForm<z.infer<T>>({
    ...props,
    resolver: zodResolver(schema),
  });
}