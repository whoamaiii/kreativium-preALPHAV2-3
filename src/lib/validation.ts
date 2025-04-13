import { z } from 'zod';
import { errorTracker } from './errorTracking';

export async function validateForm<T>(values: unknown, schema: z.ZodType<T>) {
  try {
    await schema.parseAsync(values);
    return { errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, err) => {
        const path = err.path.join('.');
        acc[path] = { message: err.message, type: 'validation' };
        return acc;
      }, {} as Record<string, { message: string; type: string; }>);
      
      return { errors };
    }
    
    errorTracker.captureException(error, {
      action: 'form_validation',
      metadata: { schema: schema.description }
    });
    
    return {
      errors: {
        form: { message: 'An unexpected error occurred', type: 'error' }
      }
    };
  }
}

export function createFormValidator<T>(schema: z.ZodType<T>) {
  return async (values: unknown) => {
    const result = await validateForm(values, schema);
    return result.errors;
  };
}