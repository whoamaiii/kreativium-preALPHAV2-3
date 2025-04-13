import { Emotion, EmotionLog } from './emotion';

/**
 * Type of learning activity
 */
export type ActivityType = 'quiz' | 'memory_game' | 'other';

/**
 * Activity result data for tracking performance
 */
export interface ActivityResult {
  // Common fields for all activities
  id: string;
  userId: string;
  activityType: ActivityType;
  timestamp: string;
  durationSeconds: number;
  
  // Quiz specific fields
  score?: number;
  correctAnswers?: number;
  totalQuestions?: number;
  categoryId?: string;
  
  // Memory game specific fields
  moves?: number;
  pairs?: number;
  timeElapsed?: number;
}

/**
 * Link between an emotion log and an activity
 */
export interface EmotionActivityContext {
  id: string;
  emotionLogId: string;
  activityId: string;
  contextType: 'before' | 'after'; // Whether emotion was logged before or after the activity
  timestamp: string;
}

/**
 * Combined data structure for emotion and activity correlation
 */
export interface EmotionActivityCorrelation {
  emotion: Emotion;
  activityType: ActivityType;
  activityResult: ActivityResult;
  emotionLog: EmotionLog;
  contextType: 'before' | 'after';
  performanceMetric: number; // Normalized performance score 0-100
}

/**
 * Filters for querying correlations
 */
export interface CorrelationFilters {
  userId?: string;
  activityType?: ActivityType;
  emotion?: Emotion;
  contextType?: 'before' | 'after';
  timeframe?: 'hour' | 'day' | 'week' | 'month' | 'all';
  startDate?: Date;
  endDate?: Date;
  minPerformance?: number;
  maxPerformance?: number;
}

/**
 * Recommendation generated based on emotional patterns
 */
export interface EmotionBasedRecommendation {
  id: string;
  userId: string;
  targetEmotion: Emotion;
  recommendedActivity: ActivityType;
  reasoning: string;
  timestamp: string;
  confidence: number; // 0-1 confidence score
  applied: boolean; // Whether this recommendation was followed
  outcome?: string; // Outcome if recommendation was followed
}

/**
 * Analysis results for emotion-learning correlations
 */
export interface EmotionLearningAnalysis {
  // Overall statistics
  totalActivities: number;
  totalEmotionsLogged: number;
  
  // Performance by emotion (before activity)
  performanceByPreEmotion: Record<Emotion, {
    averagePerformance: number;
    count: number;
  }>;
  
  // Performance by emotion (after activity)
  performanceByPostEmotion: Record<Emotion, {
    averagePerformance: number;
    count: number;
  }>;
  
  // Emotional shifts during activities
  emotionalShifts: Array<{
    fromEmotion: Emotion;
    toEmotion: Emotion;
    count: number;
    averagePerformanceChange: number;
  }>;
  
  // Best performing emotional states
  optimalEmotionalStates: Emotion[];
  
  // Recommendations based on analysis
  recommendations: EmotionBasedRecommendation[];
  
  // Visualizable data points
  correlationMatrix: number[][]; // 2D matrix for heatmap
  timeSeriesData: Array<{
    timestamp: string;
    emotion: Emotion;
    performance: number;
  }>;
}
