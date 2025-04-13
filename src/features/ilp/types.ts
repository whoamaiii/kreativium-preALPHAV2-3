import { z } from 'zod';
import { GameCategory, Difficulty } from '../games/types';

export type Skill = "reading" | "math" | "social" | "motor" | "language" | "cognitive" | "emotional";
export type GoalStatus = "pending" | "in-progress" | "completed";
export type ActivityType = "quiz" | "memory" | "exercise" | "reading" | "game";

// Mapping between skills and game categories to help with recommendations
export const SkillToGameCategoryMap: Record<Skill, GameCategory[]> = {
  reading: ['letters', 'words'],
  math: ['numbers', 'shapes'],
  social: ['custom'],
  motor: ['custom'],
  language: ['words', 'letters'],
  cognitive: ['shapes', 'colors', 'numbers'],
  emotional: ['custom']
};

// Zod schemas for validation
export const SkillValues = ["reading", "math", "social", "motor", "language", "cognitive", "emotional"] as const;
export const SkillSchema = z.enum(SkillValues);

export const GoalStatusValues = ["pending", "in-progress", "completed"] as const;
export const GoalStatusSchema = z.enum(GoalStatusValues);

export const ActivityTypeValues = ["quiz", "memory", "exercise", "reading", "game"] as const;
export const ActivityTypeSchema = z.enum(ActivityTypeValues);

export const GoalSchema = z.object({
  skill: SkillSchema,
  description: z.string().min(5, "Description must be at least 5 characters"),
  targetDate: z.string().optional(), // ISO date string
  status: GoalStatusSchema.default("pending"),
  preferredActivityTypes: z.array(ActivityTypeSchema).optional(),
});

export type GoalFormData = z.infer<typeof GoalSchema>;

export const ILPSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  preferredActivityTypes: z.array(ActivityTypeSchema).optional(),
});

export type ILPFormData = z.infer<typeof ILPSchema>;

// Interface for a recommended activity
export interface RecommendedActivity {
  id: string;
  title: string;
  description: string;
  type: ActivityType;
  category: GameCategory;
  difficulty: Difficulty;
  skillsAddressed: Skill[];
  imageUrl?: string;
  url: string; // URL to navigate to when starting the activity
}

export interface ILPGoal {
  id: string; // Backend-provided ID
  ilpId: string;
  skill: Skill;
  description: string;
  targetDate?: string; // ISO date string or as needed by backend
  status: GoalStatus;
  createdAt: string; // ISO date string
  preferredActivityTypes?: ActivityType[]; // Types of activities this goal should use
  recommendedActivityIds?: string[]; // IDs of specific activities recommended for this goal
  progress?: number; // Progress percentage (0-100)
  completedActivities?: string[]; // IDs of activities completed for this goal
  lastUpdated?: string; // ISO date string of last progress update
  assessmentNotes?: string; // Optional notes from educators about progress
}

export interface ILP {
  id: string; // Backend-provided ID
  userId: string; // Link to existing user
  title: string;
  createdAt: string; // ISO date string
  goals?: ILPGoal[]; // Goals might be embedded or fetched separately
  preferredActivityTypes?: ActivityType[]; // Types of activities preferred for this ILP
} 