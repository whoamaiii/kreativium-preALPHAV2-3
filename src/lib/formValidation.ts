import { FieldValues } from 'react-hook-form';
import { z } from 'zod';
import { errorTracker } from './errorTracking';

export const validateForm = async <T extends FieldValues>(
  values: T,
  schema: z.ZodType<any>
) => {
  try {
    const result = await schema.parseAsync(values);
    return { values: result, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, curr) => {
        const path = curr.path.join('.');
        acc[path] = { message: curr.message, type: 'validation' };
        return acc;
      }, {} as Record<string, { message: string; type: string; }>);
      
      return { values: {}, errors };
    }
    
    errorTracker.captureException(error, {
      action: 'form_validation',
      metadata: { schema: schema.description }
    });
    
    throw error;
  }
};