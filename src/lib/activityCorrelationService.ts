import { nanoid } from 'nanoid';
import { User } from '../types/user';
import { EmotionLog, Emotion } from '../types/emotion';
import { EmotionDatabase } from './emotionDatabase';
import { analyzeEmotionPatterns } from './sequentialThinkingMCP';
import {
  ActivityType,
  ActivityResult,
  EmotionActivityContext,
  EmotionActivityCorrelation,
  CorrelationFilters,
  EmotionBasedRecommendation,
  EmotionLearningAnalysis
} from '../types/integration';

// Storage keys for localStorage
const ACTIVITY_RESULTS_KEY = 'activity_results';
const EMOTION_ACTIVITY_CONTEXTS_KEY = 'emotion_activity_contexts';
const RECOMMENDATIONS_KEY = 'emotion_recommendations';

/**
 * Helper function to normalize performance score to 0-100 scale
 */
const normalizePerformance = (result: ActivityResult): number => {
  if (result.activityType === 'quiz' && result.correctAnswers !== undefined && result.totalQuestions !== undefined) {
    // For quizzes, use percentage of correct answers
    return Math.round((result.correctAnswers / result.totalQuestions) * 100);
  } else if (result.activityType === 'memory_game' && result.pairs !== undefined && result.moves !== undefined) {
    // For memory game, higher score for fewer moves relative to pairs
    // Perfect score would be exactly 2 moves per pair (direct matches)
    const perfectScore = result.pairs * 2;
    const efficiency = Math.max(0, Math.min(1, perfectScore / result.moves));
    return Math.round(efficiency * 100);
  }
  
  // Default if specific calculation isn't available
  return result.score !== undefined ? Math.min(100, result.score) : 50;
};

/**
 * Initialize storage with empty arrays if not present
 */
const initializeStorage = (): void => {
  if (!localStorage.getItem(ACTIVITY_RESULTS_KEY)) {
    localStorage.setItem(ACTIVITY_RESULTS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(EMOTION_ACTIVITY_CONTEXTS_KEY)) {
    localStorage.setItem(EMOTION_ACTIVITY_CONTEXTS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(RECOMMENDATIONS_KEY)) {
    localStorage.setItem(RECOMMENDATIONS_KEY, JSON.stringify([]));
  }
};

// Initialize on import
initializeStorage();

/**
 * Service for managing activity-emotion correlations
 */
export const ActivityCorrelationService = {
  /**
   * Save activity result and return the created record
   */
  async saveActivityResult(
    data: Omit<ActivityResult, 'id' | 'timestamp'>,
    user: User
  ): Promise<ActivityResult> {
    const newResult: ActivityResult = {
      ...data,
      id: nanoid(),
      timestamp: new Date().toISOString()
    };

    try {
      const results = await this.getAllActivityResults();
      const updatedResults = [...results, newResult];
      localStorage.setItem(ACTIVITY_RESULTS_KEY, JSON.stringify(updatedResults));
      console.log('Activity result saved:', newResult);
      return newResult;
    } catch (error) {
      console.error('Error saving activity result:', error);
      throw error;
    }
  },

  /**
   * Get all activity results
   */
  async getAllActivityResults(): Promise<ActivityResult[]> {
    try {
      const storedData = localStorage.getItem(ACTIVITY_RESULTS_KEY);
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error('Error reading activity results:', error);
      return [];
    }
  },

  /**
   * Get activity results for a specific user with optional filters
   */
  async getActivityResults(userId: string, activityType?: ActivityType): Promise<ActivityResult[]> {
    try {
      const results = await this.getAllActivityResults();
      let filtered = results.filter(result => result.userId === userId);
      
      if (activityType) {
        filtered = filtered.filter(result => result.activityType === activityType);
      }
      
      return filtered.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
    } catch (error) {
      console.error('Error getting activity results:', error);
      return [];
    }
  },

  /**
   * Link an emotion log to an activity (before or after)
   */
  async linkEmotionToActivity(
    emotionLogId: string, 
    activityId: string, 
    contextType: 'before' | 'after',
    user: User
  ): Promise<EmotionActivityContext | null> {
    try {
      // Verify the emotion log and activity exist and belong to the user
      const emotionLogs = await EmotionDatabase.getAllLogs();
      const emotionLog = emotionLogs.find(log => log.id === emotionLogId);
      
      const activityResults = await this.getAllActivityResults();
      const activity = activityResults.find(result => result.id === activityId);
      
      if (!emotionLog || !activity) {
        console.error('Emotion log or activity not found');
        return null;
      }
      
      if (emotionLog.userId !== user.id || activity.userId !== user.id) {
        console.error('User does not own this emotion log or activity');
        return null;
      }
      
      const newContext: EmotionActivityContext = {
        id: nanoid(),
        emotionLogId,
        activityId,
        contextType,
        timestamp: new Date().toISOString()
      };
      
      const contexts = await this.getAllEmotionActivityContexts();
      const updatedContexts = [...contexts, newContext];
      
      localStorage.setItem(EMOTION_ACTIVITY_CONTEXTS_KEY, JSON.stringify(updatedContexts));
      return newContext;
    } catch (error) {
      console.error('Error linking emotion to activity:', error);
      return null;
    }
  },

  /**
   * Get all emotion-activity context links
   */
  async getAllEmotionActivityContexts(): Promise<EmotionActivityContext[]> {
    try {
      const storedData = localStorage.getItem(EMOTION_ACTIVITY_CONTEXTS_KEY);
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error('Error reading emotion-activity contexts:', error);
      return [];
    }
  },

  /**
   * Get correlation data combining emotions and activity results
   */
  async getCorrelations(filters: CorrelationFilters): Promise<EmotionActivityCorrelation[]> {
    try {
      const contexts = await this.getAllEmotionActivityContexts();
      const activities = await this.getAllActivityResults();
      const emotionLogs = await EmotionDatabase.getAllLogs();
      
      // Filter contexts by user if specified
      let filteredContexts = contexts;
      if (filters.userId) {
        // First, get all activities for this user
        const userActivities = activities.filter(activity => activity.userId === filters.userId);
        const userActivityIds = userActivities.map(activity => activity.id);
        
        // Then filter contexts that reference these activities
        filteredContexts = contexts.filter(context => userActivityIds.includes(context.activityId));
      }
      
      // Filter by context type (before/after)
      if (filters.contextType) {
        filteredContexts = filteredContexts.filter(context => context.contextType === filters.contextType);
      }
      
      // Create correlation objects
      const correlations: EmotionActivityCorrelation[] = [];
      
      for (const context of filteredContexts) {
        const activity = activities.find(a => a.id === context.activityId);
        const emotionLog = emotionLogs.find(e => e.id === context.emotionLogId);
        
        if (!activity || !emotionLog) continue;
        
        // Filter by activity type if specified
        if (filters.activityType && activity.activityType !== filters.activityType) continue;
        
        // Filter by emotion if specified
        if (filters.emotion && emotionLog.emotion !== filters.emotion) continue;
        
        // Calculate normalized performance metric
        const performanceMetric = normalizePerformance(activity);
        
        // Filter by performance range
        if (filters.minPerformance !== undefined && performanceMetric < filters.minPerformance) continue;
        if (filters.maxPerformance !== undefined && performanceMetric > filters.maxPerformance) continue;
        
        // Handle timeframe filtering
        if (filters.startDate && filters.endDate) {
          const activityTime = new Date(activity.timestamp).getTime();
          const startTime = filters.startDate.getTime();
          const endTime = filters.endDate.getTime();
          
          if (activityTime < startTime || activityTime > endTime) continue;
        }
        
        correlations.push({
          emotion: emotionLog.emotion,
          activityType: activity.activityType,
          activityResult: activity,
          emotionLog,
          contextType: context.contextType,
          performanceMetric
        });
      }
      
      return correlations;
    } catch (error) {
      console.error('Error getting correlations:', error);
      return [];
    }
  },

  /**
   * Generate recommendations based on emotional states and performance
   */
  async generateRecommendations(userId: string, user: User): Promise<EmotionBasedRecommendation[]> {
    if (user.role !== 'teacher' && user.id !== userId) {
      console.error('Only teachers or the user themselves can generate recommendations');
      return [];
    }
    
    try {
      // Get all correlations for this user
      const correlations = await this.getCorrelations({ userId });
      if (correlations.length < 5) {
        console.log('Not enough data to generate meaningful recommendations');
        return [];
      }
      
      // Group by emotion and activity type to find patterns
      const emotionePerformanceMap = new Map<string, number[]>();
      
      // Only consider 'before' emotions as predictors of performance
      const beforeCorrelations = correlations.filter(c => c.contextType === 'before');
      
      // Group performance metrics by emotion
      beforeCorrelations.forEach(correlation => {
        const key = correlation.emotion;
        if (!emotionePerformanceMap.has(key)) {
          emotionePerformanceMap.set(key, []);
        }
        emotionePerformanceMap.get(key)?.push(correlation.performanceMetric);
      });
      
      // Calculate average performance for each emotion
      const emotionPerformance: Record<string, { avg: number, count: number }> = {};
      emotionePerformanceMap.forEach((performances, emotion) => {
        if (performances.length > 0) {
          const avg = performances.reduce((sum, p) => sum + p, 0) / performances.length;
          emotionPerformance[emotion] = { 
            avg: Math.round(avg), 
            count: performances.length 
          };
        }
      });
      
      // Generate insights using Sequential Thinking
      const correlationContexts = beforeCorrelations.map((c, index) => {
        return {
          emotion: c.emotion,
          activity: c.activityType,
          performance: c.performanceMetric,
          index
        };
      });
      
      // Call MCP service to analyze patterns - this could be expanded
      const insightContext = `Analyzing ${correlationContexts.length} emotional states before learning activities for user ${userId}`;
      const analysis = await analyzeEmotionPatterns(
        correlationContexts.map(c => ({
          id: `synthetic-${c.index}`,
          userId,
          role: 'child',
          emotion: c.emotion,
          timestamp: new Date().toISOString(),
          optionalNote: `Before ${c.activity}, performance: ${c.performance}`
        })), 
        user
      );
      
      // Generate recommendations
      const recommendations: EmotionBasedRecommendation[] = [];
      
      // Find best emotion for each activity type
      const activityTypes: ActivityType[] = ['quiz', 'memory_game'];
      
      for (const activityType of activityTypes) {
        const activityCorrelations = beforeCorrelations.filter(c => c.activityType === activityType);
        
        if (activityCorrelations.length < 3) continue;
        
        // Group by emotion
        const emotionPerformanceByActivity = new Map<string, number[]>();
        
        activityCorrelations.forEach(c => {
          const key = c.emotion;
          if (!emotionPerformanceByActivity.has(key)) {
            emotionPerformanceByActivity.set(key, []);
          }
          emotionPerformanceByActivity.get(key)?.push(c.performanceMetric);
        });
        
        // Find best emotion for this activity
        let bestEmotion = '';
        let bestPerformance = 0;
        let highestConfidence = 0;
        
        emotionPerformanceByActivity.forEach((performances, emotion) => {
          if (performances.length >= 2) { // Minimum sample size
            const avg = performances.reduce((sum, p) => sum + p, 0) / performances.length;
            const confidence = Math.min(1, performances.length / 10); // More samples = higher confidence
            
            if (avg > bestPerformance || (avg === bestPerformance && confidence > highestConfidence)) {
              bestEmotion = emotion;
              bestPerformance = avg;
              highestConfidence = confidence;
            }
          }
        });
        
        if (bestEmotion && bestPerformance > 60) { // Only recommend if performance is good
          const recommendation: EmotionBasedRecommendation = {
            id: nanoid(),
            userId,
            targetEmotion: bestEmotion as any, // Type assertion since we know it's a valid emotion
            recommendedActivity: activityType,
            reasoning: `You tend to perform better at ${activityType.replace('_', ' ')} activities when you're feeling ${bestEmotion}`,
            timestamp: new Date().toISOString(),
            confidence: highestConfidence,
            applied: false
          };
          
          recommendations.push(recommendation);
        }
      }
      
      // Save recommendations
      const existingRecommendations = await this.getRecommendations(userId);
      const allRecommendations = [...existingRecommendations, ...recommendations];
      
      // Only keep the most recent 10 recommendations
      const updatedRecommendations = allRecommendations
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
      
      // Store all recommendations
      await this.saveRecommendations(updatedRecommendations);
      
      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  },

  /**
   * Get existing recommendations for a user
   */
  async getRecommendations(userId: string): Promise<EmotionBasedRecommendation[]> {
    try {
      const storedData = localStorage.getItem(RECOMMENDATIONS_KEY);
      const allRecommendations: EmotionBasedRecommendation[] = storedData ? JSON.parse(storedData) : [];
      
      return allRecommendations.filter(rec => rec.userId === userId);
    } catch (error) {
      console.error('Error reading recommendations:', error);
      return [];
    }
  },

  /**
   * Save recommendations to storage
   */
  async saveRecommendations(recommendations: EmotionBasedRecommendation[]): Promise<void> {
    try {
      localStorage.setItem(RECOMMENDATIONS_KEY, JSON.stringify(recommendations));
    } catch (error) {
      console.error('Error saving recommendations:', error);
    }
  },

  /**
   * Mark a recommendation as applied
   */
  async applyRecommendation(recommendationId: string, outcome?: string): Promise<boolean> {
    try {
      const storedData = localStorage.getItem(RECOMMENDATIONS_KEY);
      const allRecommendations: EmotionBasedRecommendation[] = storedData ? JSON.parse(storedData) : [];
      
      const updatedRecommendations = allRecommendations.map(rec => {
        if (rec.id === recommendationId) {
          return { ...rec, applied: true, outcome };
        }
        return rec;
      });
      
      localStorage.setItem(RECOMMENDATIONS_KEY, JSON.stringify(updatedRecommendations));
      return true;
    } catch (error) {
      console.error('Error applying recommendation:', error);
      return false;
    }
  },

  /**
   * Perform comprehensive analysis of emotion-learning correlations
   */
  async analyzeCorrelations(userId: string, user: User): Promise<EmotionLearningAnalysis | null> {
    if (user.role !== 'teacher' && user.id !== userId) {
      console.error('Only teachers or the user themselves can analyze correlations');
      return null;
    }
    
    try {
      // Get all correlations
      const correlations = await this.getCorrelations({ userId });
      if (correlations.length < 5) {
        console.log('Not enough data for meaningful analysis');
        return null;
      }
      
      // Initialize analysis result structure
      const analysis: EmotionLearningAnalysis = {
        totalActivities: 0,
        totalEmotionsLogged: 0,
        performanceByPreEmotion: {} as Record<string, { averagePerformance: number, count: number }>,
        performanceByPostEmotion: {} as Record<string, { averagePerformance: number, count: number }>,
        emotionalShifts: [],
        optimalEmotionalStates: [],
        recommendations: [],
        correlationMatrix: [],
        timeSeriesData: []
      };
      
      // Count unique activities and emotions
      const uniqueActivities = new Set(correlations.map(c => c.activityResult.id));
      analysis.totalActivities = uniqueActivities.size;
      
      const uniqueEmotions = new Set(correlations.map(c => c.emotionLog.id));
      analysis.totalEmotionsLogged = uniqueEmotions.size;
      
      // Calculate performance by pre-activity emotion
      const preCorrelations = correlations.filter(c => c.contextType === 'before');
      const preEmotionPerformance = new Map<string, number[]>();
      
      preCorrelations.forEach(c => {
        const key = c.emotion;
        if (!preEmotionPerformance.has(key)) {
          preEmotionPerformance.set(key, []);
        }
        preEmotionPerformance.get(key)?.push(c.performanceMetric);
      });
      
      preEmotionPerformance.forEach((performances, emotion) => {
        if (performances.length > 0) {
          const avg = performances.reduce((sum, p) => sum + p, 0) / performances.length;
          analysis.performanceByPreEmotion[emotion as Emotion] = {
            averagePerformance: Math.round(avg),
            count: performances.length
          };
        }
      });
      
      // Calculate performance by post-activity emotion
      const postCorrelations = correlations.filter(c => c.contextType === 'after');
      const postEmotionPerformance = new Map<string, number[]>();
      
      postCorrelations.forEach(c => {
        const key = c.emotion;
        if (!postEmotionPerformance.has(key)) {
          postEmotionPerformance.set(key, []);
        }
        postEmotionPerformance.get(key)?.push(c.performanceMetric);
      });
      
      postEmotionPerformance.forEach((performances, emotion) => {
        if (performances.length > 0) {
          const avg = performances.reduce((sum, p) => sum + p, 0) / performances.length;
          analysis.performanceByPostEmotion[emotion as Emotion] = {
            averagePerformance: Math.round(avg),
            count: performances.length
          };
        }
      });
      
      // Find emotional shifts
      // Group activities with both before and after emotions logged
      const activitiesWithBothEmotions = new Map<string, { before: string, after: string, performance: number }>();
      
      // Find all 'before' emotions
      preCorrelations.forEach(c => {
        activitiesWithBothEmotions.set(c.activityResult.id, {
          before: c.emotion,
          after: '', // Will be filled later if exists
          performance: c.performanceMetric
        });
      });
      
      // Fill in 'after' emotions where they exist
      postCorrelations.forEach(c => {
        if (activitiesWithBothEmotions.has(c.activityResult.id)) {
          const existing = activitiesWithBothEmotions.get(c.activityResult.id);
          if (existing) {
            existing.after = c.emotion;
          }
        }
      });
      
      // Count emotional shifts
      const shiftMap = new Map<string, { count: number, performanceChanges: number[] }>();
      
      activitiesWithBothEmotions.forEach(({ before, after, performance }) => {
        if (before && after) {
          const key = `${before}->${after}`;
          if (!shiftMap.has(key)) {
            shiftMap.set(key, { count: 0, performanceChanges: [] });
          }
          const data = shiftMap.get(key);
          if (data) {
            data.count++;
            data.performanceChanges.push(performance);
          }
        }
      });
      
      // Convert shift map to array
      shiftMap.forEach((data, key) => {
        const [fromEmotion, toEmotion] = key.split('->');
        const avgPerformance = data.performanceChanges.reduce((sum, p) => sum + p, 0) / data.performanceChanges.length;
        
        analysis.emotionalShifts.push({
          fromEmotion: fromEmotion as any, // Type assertion
          toEmotion: toEmotion as any, // Type assertion
          count: data.count,
          averagePerformanceChange: Math.round(avgPerformance)
        });
      });
      
      // Find optimal emotional states
      const optimalStates = Object.entries(analysis.performanceByPreEmotion)
        .filter(([_, data]) => data.count >= 3) // Require minimum sample size
        .sort((a, b) => b[1].averagePerformance - a[1].averagePerformance)
        .slice(0, 3)
        .map(([emotion, _]) => emotion);
      
      analysis.optimalEmotionalStates = optimalStates as any[]; // Type assertion
      
      // Get recommendations
      analysis.recommendations = await this.getRecommendations(userId);
      
      // Generate time series data
      analysis.timeSeriesData = correlations
        .filter(c => c.contextType === 'before')
        .map(c => ({
          timestamp: c.activityResult.timestamp,
          emotion: c.emotion,
          performance: c.performanceMetric
        }))
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      // Generate correlation matrix
      // This would be a matrix of emotions vs. performance ranges
      const emotionsList = Object.keys(analysis.performanceByPreEmotion);
      const performanceRanges = [0, 20, 40, 60, 80]; // 0-19, 20-39, etc.
      
      const matrix: number[][] = emotionsList.map(() => performanceRanges.map(() => 0));
      
      preCorrelations.forEach(c => {
        const emotionIndex = emotionsList.indexOf(c.emotion);
        if (emotionIndex >= 0) {
          const performanceIndex = Math.floor(c.performanceMetric / 20);
          if (performanceIndex >= 0 && performanceIndex < performanceRanges.length) {
            matrix[emotionIndex][performanceIndex]++;
          }
        }
      });
      
      analysis.correlationMatrix = matrix;
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing correlations:', error);
      return null;
    }
  }
};
