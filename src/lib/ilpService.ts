import { nanoid } from 'nanoid';
import { ILP, ILPProgress, ActivitySkillMapping, TargetSkill, ActivityType } from '../types/ilp';
import { secureLocalStorage } from '../utils/encryption';

// Storage keys
const ILP_PROGRESS_STORAGE_KEY = 'app_ilp_progress_data';
const ACTIVITY_SKILL_MAPPING_KEY = 'app_activity_skill_mapping';

// Default activity skill mappings - would be configurable in a real system
const DEFAULT_ACTIVITY_SKILL_MAPPINGS: ActivitySkillMapping[] = [
  {
    activityType: 'quiz',
    activitySubtype: 'general',
    associatedSkills: ['reading', 'cognitive']
  },
  {
    activityType: 'quiz',
    activitySubtype: 'math',
    associatedSkills: ['math', 'cognitive']
  },
  {
    activityType: 'memory',
    activitySubtype: 'visual',
    associatedSkills: ['cognitive', 'motor']
  },
  {
    activityType: 'memory',
    activitySubtype: 'word-matching',
    associatedSkills: ['reading', 'cognitive']
  },
  {
    activityType: 'exercise',
    activitySubtype: 'physical',
    associatedSkills: ['motor', 'social']
  },
  {
    activityType: 'reading',
    activitySubtype: 'story',
    associatedSkills: ['reading', 'language', 'cognitive']
  },
  {
    activityType: 'game',
    activitySubtype: 'interactive',
    associatedSkills: ['social', 'cognitive', 'emotional']
  }
];

/**
 * Initialize the activity skill mappings on first load
 */
const initializeActivitySkillMappings = (): void => {
  const existingMappings = secureLocalStorage.getItem<ActivitySkillMapping[]>(ACTIVITY_SKILL_MAPPING_KEY);
  if (!existingMappings) {
    secureLocalStorage.setItem(ACTIVITY_SKILL_MAPPING_KEY, DEFAULT_ACTIVITY_SKILL_MAPPINGS);
  }
};

/**
 * Get all ILP progress records
 */
export const getAllILPProgress = (): ILPProgress[] => {
  const progress = secureLocalStorage.getItem<ILPProgress[]>(ILP_PROGRESS_STORAGE_KEY);
  if (!progress) return [];
  
  // Convert date strings to Date objects
  return progress.map(p => ({
    ...p,
    timestamp: new Date(p.timestamp)
  }));
};

/**
 * Get ILP progress records for a specific ILP
 */
export const getILPProgress = (ilpId: string): ILPProgress[] => {
  const allProgress = getAllILPProgress();
  return allProgress.filter(p => p.ilpId === ilpId);
};

/**
 * Add a new ILP progress record
 */
export const addILPProgress = (progress: Omit<ILPProgress, 'id' | 'timestamp'>): ILPProgress => {
  const allProgress = getAllILPProgress();
  
  const newProgress: ILPProgress = {
    ...progress,
    id: nanoid(),
    timestamp: new Date()
  };
  
  secureLocalStorage.setItem(ILP_PROGRESS_STORAGE_KEY, [...allProgress, newProgress]);
  return newProgress;
};

/**
 * Calculate the overall progress percentage for an ILP
 */
export const calculateILPProgress = (ilpId: string): number => {
  const progress = getILPProgress(ilpId);
  
  if (progress.length === 0) {
    return 0; // No progress yet
  }
  
  // Sum up all progress contributions
  const totalProgress = progress.reduce((sum, p) => sum + p.progressPercentageContribution, 0);
  
  // Cap at 100%
  return Math.min(totalProgress, 100);
};

/**
 * Get activity suggestions based on the ILP's target skill
 */
export const getSuggestedActivities = (ilp: ILP): ActivitySkillMapping[] => {
  initializeActivitySkillMappings();
  
  const activityMappings = secureLocalStorage.getItem<ActivitySkillMapping[]>(ACTIVITY_SKILL_MAPPING_KEY) || DEFAULT_ACTIVITY_SKILL_MAPPINGS;
  
  // Filter mappings that match the ILP's target skill and preferred activity types
  return activityMappings.filter(mapping => 
    mapping.associatedSkills.includes(ilp.targetSkill) && 
    ilp.preferredActivityTypes.includes(mapping.activityType)
  );
};

/**
 * Record activity completion and calculate progress contribution
 */
export const recordActivityCompletion = (
  ilpId: string, 
  activityId: string,
  activityType: ActivityType,
  score: number | undefined,
  completionStatus: boolean
): ILPProgress => {
  // Base progress contribution - can be adjusted based on various factors
  const baseContribution = 5; // 5% progress per completed activity
  
  // Adjust contribution based on score if available
  let adjustedContribution = baseContribution;
  if (score !== undefined) {
    // Score is assumed to be 0-100
    adjustedContribution = baseContribution * (score / 100);
  }
  
  // Add progress record
  return addILPProgress({
    ilpId,
    activityId,
    activityType,
    score,
    completionStatus,
    progressPercentageContribution: adjustedContribution
  });
};

/**
 * Generate a PDF progress report for an ILP (placeholder)
 */
export const generateILPProgressReport = async (ilpId: string): Promise<string> => {
  // This would normally connect to a PDF generation service
  // For now, we'll just return a placeholder message
  const progress = calculateILPProgress(ilpId);
  return `ILP Progress Report - ${progress}% complete`;
};

// Initialize on module load
initializeActivitySkillMappings(); 