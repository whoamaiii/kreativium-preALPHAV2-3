import { useContext } from 'react';
import { ILPContext, ExtendedILPContextType } from '../context/ILPContext';
import { ILP, ILPProgress, ActivityType } from '../types/ilp';

/**
 * Custom hook for accessing ILP functionality
 * @returns All the ILP context methods and state
 */
export function useIlps(): ExtendedILPContextType {
  const context = useContext(ILPContext);
  
  if (!context) {
    throw new Error('useIlps must be used within an ILPProvider');
  }
  
  return context;
}

// Add enhanced functionality for the Memory game integration
export function useIlpsWithEnhancedFunctionality() {
  const ilpContext = useIlps();
  
  /**
   * Get ILPs relevant to a specific activity with enhanced filtering
   * @param activityType The type of activity
   * @param categoryId The category ID (optional)
   * @param itemId The specific item ID (optional)
   * @returns Array of relevant ILPs
   */
  const getRelevantILPsForActivity = (
    activityType: ActivityType, 
    categoryId?: string, 
    itemId?: string | number
  ): ILP[] => {
    // Get all active ILPs
    const activeILPs = ilpContext.getActiveILPs();
    
    if (activeILPs.length === 0) return [];
    
    // Filter based on activity type and skill/category match
    return activeILPs.filter(ilp => {
      // Check if the ILP has preferred activity types
      const activityTypeMatch = !ilp.preferredActivityTypes || 
        ilp.preferredActivityTypes.length === 0 || 
        ilp.preferredActivityTypes.includes(activityType);
      
      if (!activityTypeMatch) return false;
      
      // Check if category matches the target skill
      const categoryMatch = !categoryId || 
        ilp.targetSkill.toLowerCase() === categoryId.toLowerCase() ||
        // Check if the ILP has related skills
        ilp.relatedSkills?.some(skill => 
          skill.toLowerCase() === categoryId.toLowerCase()
        );
      
      // If we have a specific item ID, we could do more granular matching here
      // For example, check if the item contains keywords related to the ILP
      
      return categoryMatch;
    });
  };
  
  return {
    ...ilpContext,
    getRelevantILPsForActivity
  };
}

// Default export for the enhanced version
export default useIlpsWithEnhancedFunctionality; 