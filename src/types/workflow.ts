import { z } from 'zod';

export const WorkflowStatus = {
  DRAFT: 'draft',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  PUBLISHED: 'published',
  REJECTED: 'rejected',
} as const;

export type WorkflowStatus = typeof WorkflowStatus[keyof typeof WorkflowStatus];

export const WorkflowItemSchema = z.object({
  id: z.string(),
  type: z.enum(['quiz', 'memory_game', 'category']),
  status: z.enum(['draft', 'in_review', 'approved', 'published', 'rejected']),
  createdBy: z.string(),
  assignedTo: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().nullable(),
  reviewedAt: z.string().nullable(),
  reviewedBy: z.string().nullable(),
  comments: z.array(z.object({
    id: z.string(),
    userId: z.string(),
    text: z.string(),
    createdAt: z.string(),
  })),
  contentId: z.string(),
  version: z.number(),
});

export type WorkflowItem = z.infer<typeof WorkflowItemSchema>;