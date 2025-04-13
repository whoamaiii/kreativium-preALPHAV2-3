import { z } from 'zod';

// Define the skill types that can be targeted in ILPs
export const TargetSkillEnum = z.enum([
  'reading',
  'math',
  'social',
  'motor',
  'language',
  'cognitive',
  'emotional'
]);

export type TargetSkill = z.infer<typeof TargetSkillEnum>;

// Define the status types for ILPs
export const ILPStatusEnum = z.enum([
  'active',
  'achieved',
  'archived',
  'paused'
]);

export type ILPStatus = z.infer<typeof ILPStatusEnum>;

// Define the activity types
export const ActivityTypeEnum = z.enum([
  'quiz',
  'memory',
  'exercise',
  'reading',
  'game'
]);

export type ActivityType = z.infer<typeof ActivityTypeEnum>;

// Define the approval status for ILPs
export const ApprovalStatusEnum = z.enum([
  'pending',
  'approved',
  'requires_revision'
]);

export type ApprovalStatus = z.infer<typeof ApprovalStatusEnum>;

// Define the Objective schema
export const ObjectiveSchema = z.object({
  id: z.string(),
  description: z.string(),
  targetValue: z.number(),
  currentValue: z.number(),
  isCompleted: z.boolean()
});

export type Objective = z.infer<typeof ObjectiveSchema>;

// Define the ILP schema
export const ILPSchema = z.object({
  id: z.string(),
  childId: z.string(),
  goalDescription: z.string(),
  targetSkill: TargetSkillEnum,
  timeframeStart: z.date(),
  timeframeEnd: z.date(),
  preferredActivityTypes: z.array(ActivityTypeEnum),
  relatedSkills: z.array(z.string()).optional(),
  accommodationsNotes: z.string().optional(),
  status: ILPStatusEnum,
  statusReason: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  objectives: z.array(ObjectiveSchema).optional(),
  educatorNotes: z.string().optional(),
  approvalStatus: ApprovalStatusEnum.optional()
});

export type ILP = z.infer<typeof ILPSchema>;

// Define the ILP Progress schema
export const ILPProgressSchema = z.object({
  id: z.string(),
  ilpId: z.string(),
  activityId: z.string(),
  activityType: ActivityTypeEnum,
  score: z.number().optional(),
  completionStatus: z.boolean(),
  progressPercentageContribution: z.number(),
  timestamp: z.date(),
  objectiveId: z.string().optional()
});

export type ILPProgress = z.infer<typeof ILPProgressSchema>;

// Define the Activity Skill Mapping schema
export const ActivitySkillMappingSchema = z.object({
  activityType: ActivityTypeEnum,
  activitySubtype: z.string(),
  associatedSkills: z.array(TargetSkillEnum),
});

export type ActivitySkillMapping = z.infer<typeof ActivitySkillMappingSchema>;

// Define the ILP state for managing ILPs in the frontend
export interface ILPState {
  ilps: ILP[];
  selectedIlpId: string | null;
  isLoading: boolean;
  error: string | null;
}

// Define the ILP actions for state management
export type ILPAction =
  | { type: 'ADD_ILP'; payload: ILP }
  | { type: 'UPDATE_ILP'; payload: ILP }
  | { type: 'DELETE_ILP'; payload: string }
  | { type: 'SELECT_ILP'; payload: string | null }
  | { type: 'SET_ILPS'; payload: ILP[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Define the ILP context type for React context
export interface ILPContextType {
  state: ILPState;
  addIlp: (ilp: Omit<ILP, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateIlp: (ilp: Partial<ILP> & { id: string }) => Promise<void>;
  deleteIlp: (id: string) => Promise<void>;
  selectIlp: (id: string) => void;
} 