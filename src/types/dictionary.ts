import { z } from 'zod';

export const SignSchema = z.object({
  id: z.number(),
  word: z.string(),
  category: z.string(),
  imageUrl: z.string(),
  description: z.string(),
  example: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  tags: z.array(z.string()).optional(),
});

export type Sign = z.infer<typeof SignSchema>;

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  parentId: z.string().optional(),
});

export type Category = z.infer<typeof CategorySchema>;