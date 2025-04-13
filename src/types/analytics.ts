import { z } from 'zod';

export const QuizAnalyticsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  categoryId: z.string(),
  startTime: z.string(),
  endTime: z.string().optional(),
  totalQuestions: z.number(),
  correctAnswers: z.number(),
  timePerQuestion: z.array(z.number()),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  completed: z.boolean(),
});

export type QuizAnalytics = z.infer<typeof QuizAnalyticsSchema>;

export const UserStatsSchema = z.object({
  totalQuizzes: z.number(),
  totalQuestions: z.number(),
  correctAnswers: z.number(),
  averageScore: z.number(),
  timeSpent: z.number(),
  categoryProgress: z.record(z.string(), z.number()),
  lastActive: z.string(),
  streakDays: z.number(),
  achievements: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    unlockedAt: z.string(),
  })),
});

export type UserStats = z.infer<typeof UserStatsSchema>;

export const QuizSessionSchema = z.object({
  id: z.string(),
  questions: z.array(z.object({
    id: z.number(),
    answer: z.string().optional(),
    timeSpent: z.number(),
    correct: z.boolean().optional(),
  })),
  currentIndex: z.number(),
  startTime: z.string(),
  lastActive: z.string(),
});