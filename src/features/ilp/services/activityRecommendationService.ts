import { Skill, ActivityType, RecommendedActivity, SkillToGameCategoryMap } from '../types';
import { GameCategory, Difficulty } from '../../games/types';

// This service integrates with the existing backend API
// Assuming there's an existing auth mechanism that provides tokens

// Function to get the auth token from wherever it's stored in the existing app
const getUserAuthToken = (): string => {
  // This should be replaced with the actual method to get the auth token
  // For example, from localStorage, a context, or a state management solution
  return localStorage.getItem('authToken') || '';
};

// Base API URL - should be replaced with the actual API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Fetch recommended activities based on skills
 */
export const fetchRecommendedActivities = async (
  skills: Skill[],
  activityTypes?: ActivityType[],
  limit: number = 10
): Promise<RecommendedActivity[]> => {
  const token = getUserAuthToken();
  
  // Build query parameters
  const params = new URLSearchParams();
  skills.forEach(skill => params.append('skills', skill));
  if (activityTypes && activityTypes.length > 0) {
    activityTypes.forEach(type => params.append('types', type));
  }
  params.append('limit', limit.toString());
  
  const response = await fetch(`${API_BASE_URL}/recommendations/activities?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to fetch recommended activities: ${response.statusText}`);
  }
  
  return await response.json() as RecommendedActivity[];
};

/**
 * Generate recommended activities client-side (fallback if no backend endpoint)
 * This can provide recommendations based on skills and game categories mapping
 */
export const generateRecommendedActivities = (
  skills: Skill[],
  activityTypes?: ActivityType[],
  limit: number = 10
): RecommendedActivity[] => {
  // Create a map of all game categories relevant to the provided skills
  const relevantCategories: GameCategory[] = [];
  
  skills.forEach(skill => {
    const categories = SkillToGameCategoryMap[skill] || [];
    categories.forEach(category => {
      if (!relevantCategories.includes(category)) {
        relevantCategories.push(category);
      }
    });
  });
  
  // Filter activity types if provided
  const types = activityTypes?.length ? activityTypes : ['quiz', 'memory'] as ActivityType[];
  
  // Generate mock recommendations
  const recommendations: RecommendedActivity[] = [];
  
  // For each skill, generate activities
  skills.forEach(skill => {
    const categories = SkillToGameCategoryMap[skill] || [];
    
    if (categories.length > 0) {
      // For each relevant category, create an activity
      categories.forEach(category => {
        // Create quiz and memory game recommendations if they match the filter
        if (types.includes('quiz')) {
          recommendations.push({
            id: `quiz-${skill}-${category}`,
            title: `${capitalizeFirstLetter(skill)} Quiz: ${capitalizeFirstLetter(category)}`,
            description: `Improve your ${skill} skills with this ${category} quiz.`,
            type: 'quiz',
            category: category,
            difficulty: 'medium' as Difficulty,
            skillsAddressed: [skill],
            imageUrl: `/images/activities/quiz-${category}.jpg`,
            url: `/quiz/${category}`
          });
        }
        
        if (types.includes('memory')) {
          recommendations.push({
            id: `memory-${skill}-${category}`,
            title: `${capitalizeFirstLetter(skill)} Memory Game: ${capitalizeFirstLetter(category)}`,
            description: `Build your ${skill} memory with these ${category} cards.`,
            type: 'memory',
            category: category,
            difficulty: 'easy' as Difficulty,
            skillsAddressed: [skill],
            imageUrl: `/images/activities/memory-${category}.jpg`,
            url: `/memory/${category}`
          });
        }
      });
    }
  });
  
  // Return only the requested number of recommendations
  return recommendations.slice(0, limit);
};

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Find activities recommended for a specific goal
 */
export const fetchActivitiesForGoal = async (
  goalId: string,
  limit: number = 5
): Promise<RecommendedActivity[]> => {
  const token = getUserAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/ilp/goals/${goalId}/activities?limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Failed to fetch activities for goal: ${response.statusText}`);
  }
  
  return await response.json() as RecommendedActivity[];
}; 