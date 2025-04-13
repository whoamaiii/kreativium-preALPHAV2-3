import { z } from 'zod';
import { errorTracker } from '../errorTracking';

export async function validateWithSchema<T>(data: unknown, schema: z.ZodType<T>) {
  try {
    const result = await schema.parseAsync(data);
    return { success: true as const, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false as const,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }

    errorTracker.captureException(error, {
      action: 'schema_validation',
      metadata: { schema: schema.description },
    });

    return {
      success: false as const,
      errors: [{ path: 'unknown', message: 'An unexpected error occurred' }],
    };
  }
}

export function createFormValidator<T>(schema: z.ZodType<T>) {
  return async (values: unknown) => {
    const result = await validateWithSchema(values, schema);
    if (!result.success) {
      const errors = result.errors.reduce((acc, { path, message }) => {
        acc[path] = { message, type: 'validation' };
        return acc;
      }, {} as Record<string, { message: string; type: string; }>);
      return errors;
    }
    return {};
  };
}