import { z } from 'zod';

export const QuestionSchema = z.object({
  id: z.number(),
  category: z.string(),
  text: z.string(),
  imageUrl: z.string(),
  correctAnswer: z.string(),
  options: z.array(z.string()).optional(),
  hint: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
});

export type Question = z.infer<typeof QuestionSchema>;

export const QuizCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  unlockLevel: z.number(),
  questions: z.array(QuestionSchema),
});

export type QuizCategory = z.infer<typeof QuizCategorySchema>;

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  answers: Record<number, string>;
  isComplete: boolean;
  showFeedback: boolean;
  isCorrect: boolean;
  streak: number;
  multiplier: number;
}