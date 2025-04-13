import { v4 as uuidv4 } from 'uuid';
import { ILP, ILPProgress, ActivityType, Objective } from '../types/ilp';
import { secureLocalStorage } from '../utils/encryption';

// Local storage key
const ILP_PROGRESS_STORAGE_KEY = 'app_ilp_progress_data';

/**
 * Service for managing ILP progress tracking and calculation
 */
export class ILPProgressService {
  /**
   * Records progress for an ILP based on activity completion
   */
  static async recordProgress(
    progressData: Omit<ILPProgress, 'id' | 'timestamp' | 'progressPercentageContribution'>
  ): Promise<ILPProgress> {
    try {
      // Get the ILP to calculate progress contribution
      const storedIlps = secureLocalStorage.getItem<ILP[]>('app_ilps_data') || [];
      const ilp = storedIlps.find(i => i.id === progressData.ilpId);
      
      if (!ilp) {
        throw new Error('ILP not found');
      }
      
      // Calculate progress contribution based on activity type, score, and ILP settings
      const progressContribution = this.calculateProgressContribution(
        progressData.activityType,
        progressData.score || 0,
        progressData.completionStatus,
        ilp
      );
      
      const progressEntry: ILPProgress = {
        ...progressData,
        id: uuidv4(),
        timestamp: new Date(),
        progressPercentageContribution: progressContribution
      };
      
      // Save progress entry
      const existingProgress = secureLocalStorage.getItem<ILPProgress[]>(ILP_PROGRESS_STORAGE_KEY) || [];
      const updatedProgress = [...existingProgress, progressEntry];
      secureLocalStorage.setItem(ILP_PROGRESS_STORAGE_KEY, updatedProgress);
      
      // Update ILP objectives if needed
      if (progressData.objectiveId) {
        await this.updateObjectiveProgress(ilp, progressData.objectiveId, progressContribution);
      }
      
      return progressEntry;
    } catch (error) {
      console.error('Error recording ILP progress:', error);
      throw error;
    }
  }
  
  /**
   * Calculates the contribution of an activity to overall ILP progress
   */
  private static calculateProgressContribution(
    activityType: ActivityType,
    score: number,
    isCompleted: boolean,
    ilp: ILP
  ): number {
    // Base contribution depends on activity type matching preferred types
    let baseContribution = ilp.preferredActivityTypes.includes(activityType) ? 5 : 3;
    
    // Adjust based on score (0-100 scale)
    let scoreMultiplier = score / 100;
    
    // Completion bonus
    let completionBonus = isCompleted ? 2 : 0;
    
    // Calculate final contribution (max 10%)
    return Math.min(baseContribution * scoreMultiplier + completionBonus, 10);
  }
  
  /**
   * Updates the progress of a specific objective within an ILP
   */
  private static async updateObjectiveProgress(
    ilp: ILP, 
    objectiveId: string, 
    progressContribution: number
  ): Promise<void> {
    if (!ilp.objectives) return;
    
    const objective = ilp.objectives.find(o => o.id === objectiveId);
    
    if (!objective) return;
    
    // Update the current value based on progress contribution
    const newCurrentValue = Math.min(
      objective.currentValue + (objective.targetValue * (progressContribution / 100)),
      objective.targetValue
    );
    
    // Update objective completion status
    objective.currentValue = newCurrentValue;
    objective.isCompleted = newCurrentValue >= objective.targetValue;
    
    // Save updated ILP
    const storedIlps = secureLocalStorage.getItem<ILP[]>('app_ilps_data') || [];
    const updatedILPs = storedIlps.map(i => 
      i.id === ilp.id ? {...i, objectives: ilp.objectives, updatedAt: new Date()} : i
    );
    
    secureLocalStorage.setItem('app_ilps_data', updatedILPs);
  }
  
  /**
   * Gets all progress entries for a specific ILP
   */
  static async getProgressByILP(ilpId: string): Promise<ILPProgress[]> {
    try {
      const allProgress = secureLocalStorage.getItem<ILPProgress[]>(ILP_PROGRESS_STORAGE_KEY) || [];
      return allProgress.filter(p => p.ilpId === ilpId);
    } catch (error) {
      console.error('Error getting ILP progress:', error);
      return [];
    }
  }
  
  /**
   * Calculates overall progress percentage for an ILP
   */
  static async getOverallProgress(ilpId: string): Promise<number> {
    try {
      const progressEntries = await this.getProgressByILP(ilpId);
      
      // If there are no progress entries, return 0
      if (progressEntries.length === 0) {
        return 0;
      }
      
      const totalContribution = progressEntries.reduce(
        (sum, entry) => sum + entry.progressPercentageContribution, 
        0
      );
      
      // Cap at 100%
      return Math.min(totalContribution, 100);
    } catch (error) {
      console.error('Error calculating overall progress:', error);
      return 0;
    }
  }
  
  /**
   * Checks if a milestone has been reached 
   * (useful for notifications)
   */
  static isMilestoneReached(previousProgress: number, currentProgress: number): number | null {
    const milestones = [25, 50, 75, 100];
    
    for (const milestone of milestones) {
      if (previousProgress < milestone && currentProgress >= milestone) {
        return milestone;
      }
    }
    
    return null;
  }
} 