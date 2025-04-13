import { z } from 'zod';

export const AdminUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  role: z.enum(['admin', 'editor', 'viewer']),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const AdminSettingsSchema = z.object({
  siteName: z.string(),
  siteDescription: z.string(),
  logo: z.string().optional(),
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string(),
  maintenance: z.boolean(),
  features: z.object({
    quiz: z.boolean(),
    memory: z.boolean(),
    practice: z.boolean(),
  }),
});

export type AdminUser = z.infer<typeof AdminUserSchema>;
export type AdminSettings = z.infer<typeof AdminSettingsSchema>;