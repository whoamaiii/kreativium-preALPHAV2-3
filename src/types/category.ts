import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  slug: z.string(),
  order: z.number(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export type Category = z.infer<typeof CategorySchema>;