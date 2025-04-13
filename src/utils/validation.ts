import { z } from 'zod';

/**
 * Collection of reusable Zod validation schemas for common form fields.
 * These can be composed together to create form validation schemas.
 */

// Basic validation patterns
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(50, 'Name is too long')
  .regex(/^[a-zA-Z\s\-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username cannot exceed 20 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens');

export const ageSchema = z
  .number({ invalid_type_error: 'Age must be a number' })
  .int('Age must be a whole number')
  .min(1, 'Age must be at least 1')
  .max(120, 'Age must be less than 120');

export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^\+?[0-9]{8,15}$/, 'Please enter a valid phone number');

// Example of combined schemas for forms
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
});

export const signupFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export const profileFormSchema = z.object({
  name: nameSchema,
  username: usernameSchema,
  bio: z.string().max(300, 'Bio cannot exceed 300 characters').optional(),
  age: z.coerce.number().pipe(ageSchema).optional(),
  phone: phoneSchema.optional()
});

export const kidProfileSchema = z.object({
  name: nameSchema,
  age: z.coerce.number().pipe(ageSchema),
  avatar: z.string().optional(),
  favoriteColor: z.string().optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional()
});

// Types derived from schemas
export type LoginFormInputs = z.infer<typeof loginFormSchema>;
export type SignupFormInputs = z.infer<typeof signupFormSchema>;
export type ProfileFormInputs = z.infer<typeof profileFormSchema>;
export type KidProfileInputs = z.infer<typeof kidProfileSchema>; 