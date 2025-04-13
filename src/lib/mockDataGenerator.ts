import { nanoid } from 'nanoid';
import {
  Emotion,
  EmotionLog,
  EMOTIONS
} from '../types/emotion';
import {
  ActivityResult,
  EmotionActivityContext,
  ActivityType
} from '../types/integration';
import { ActivityCorrelationService } from './activityCorrelationService';
import { EmotionDatabase } from './emotionDatabase';

// Constants
const ALEX_USER_ID = 'alex-mock-user';
const ALEX_USER_NAME = 'Alex';
const EMOTION_LOGS_KEY = 'emotion_logs';
const ACTIVITY_RESULTS_KEY = 'activity_results';
const EMOTION_ACTIVITY_CONTEXTS_KEY = 'emotion_activity_contexts';

// Fixed dates for consistent testing
const CURRENT_DATE = new Date();
const TWO_WEEKS_AGO = new Date(CURRENT_DATE);
TWO_WEEKS_AGO.setDate(CURRENT_DATE.getDate() - 14);

// Categories for quiz activities
const QUIZ_CATEGORIES = ['math', 'science', 'language', 'history', 'geography'];

// Helper functions
const getDateInPast = (dayOffset: number, hour: number, minute: number): string => {
  const date = new Date(CURRENT_DATE);
  date.setDate(date.getDate() - dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

const getDayOfWeek = (isoDate: string): number => {
  return new Date(isoDate).getDay();
};

const getHourOfDay = (isoDate: string): number => {
  return new Date(isoDate).getHours();
};

const getDateOfMonth = (isoDate: string): number => {
  return new Date(isoDate).getDate();
};

// Generate timestamps for activities
const generateActivityTimestamps = (): string[] => {
  const timestamps: string[] = [];
  const activityCount = 30 + Math.floor(Math.random() * 10); // 30-40 activities
  
  for (let i = 0; i < activityCount; i++) {
    let dayOffset;
    const recencyRoll = Math.random();
    
    if (recencyRoll < 0.4) {
      dayOffset = Math.floor(Math.random() * 4); // 0-3 days ago (40%)
    } else if (recencyRoll < 0.7) {
      dayOffset = 4 + Math.floor(Math.random() * 4); // 4-7 days ago (30%)
    } else {
      dayOffset = 8 + Math.floor(Math.random() * 7); // 8-14 days ago (30%)
    }
    
    let hour;
    const timeRoll = Math.random();
    
    if (timeRoll < 0.1) {
      hour = 5 + Math.floor(Math.random() * 4); // 5-8 AM (10%)
    } else if (timeRoll < 0.3) {
      hour = 9 + Math.floor(Math.random() * 3); // 9-11 AM (20%)
    } else if (timeRoll < 0.6) {
      hour = 12 + Math.floor(Math.random() * 5); // 12-4 PM (30%)
    } else if (timeRoll < 0.9) {
      hour = 17 + Math.floor(Math.random() * 4); // 5-8 PM (30%)
    } else {
      hour = 21 + Math.floor(Math.random() * 3); // 9-11 PM (10%)
    }
    
    const minute = Math.floor(Math.random() * 60);
    timestamps.push(getDateInPast(dayOffset, hour, minute));
  }
  
  return timestamps.sort();
};

// Generate emotion based on time patterns
const getEmotionByTimePattern = (timestamp: string): Emotion => {
  const hour = getHourOfDay(timestamp);
  const day = getDayOfWeek(timestamp);
  const date = getDateOfMonth(timestamp);
  
  let probabilities: Record<Emotion, number> = {
    'happy': 0.15,
    'sad': 0.05,
    'anxious': 0.1,
    'angry': 0.05,
    'calm': 0.2,
    'excited': 0.15,
    'tired': 0.2,
    'frustrated': 0.1
  };
  
  // Time of day patterns
  if (hour >= 6 && hour <= 10) {
    probabilities.calm += 0.2;
    probabilities.tired -= 0.15;
  } else if (hour >= 10 && hour <= 12) {
    probabilities.happy += 0.25;
    probabilities.excited += 0.15;
  } else if (hour >= 13 && hour <= 16) {
    probabilities.excited += 0.2;
    probabilities.calm -= 0.1;
  } else if (hour >= 17 && hour <= 20) {
    probabilities.tired += 0.2;
    probabilities.excited -= 0.1;
  } else if (hour >= 21 || hour <= 5) {
    probabilities.anxious += 0.15;
    probabilities.tired += 0.1;
  }
  
  // Day of week patterns
  if (day === 1) { // Monday
    probabilities.anxious += 0.15;
    probabilities.frustrated += 0.15;
  } else if (day === 3) { // Wednesday (hidden pattern)
    probabilities.frustrated += 0.2;
  } else if (day === 5) { // Friday
    probabilities.happy += 0.2;
    probabilities.excited += 0.15;
  } else if (day === 0 || day === 6) { // Weekend
    probabilities.happy += 0.15;
    probabilities.calm += 0.1;
  }
  
  // Date patterns
  if (date <= 15) {
    const factor = date / 15;
    probabilities.happy += 0.05 * factor;
    probabilities.calm += 0.05 * factor;
  } else {
    const factor = (date - 15) / 15;
    probabilities.tired += 0.1 * factor;
    probabilities.frustrated += 0.1 * factor;
  }
  
  // Normalize probabilities
  Object.keys(probabilities).forEach(emotion => {
    probabilities[emotion as Emotion] = Math.max(0.01, probabilities[emotion as Emotion]);
  });
  
  const total = Object.values(probabilities).reduce((sum, p) => sum + p, 0);
  Object.keys(probabilities).forEach(emotion => {
    probabilities[emotion as Emotion] /= total;
  });
  
  // Select emotion based on probabilities
  const roll = Math.random();
  let cumulative = 0;
  
  for (const [emotion, probability] of Object.entries(probabilities)) {
    cumulative += probability;
    if (roll <= cumulative) {
      return emotion as Emotion;
    }
  }
  
  return 'calm';
};

// Calculate performance metrics
const calculatePerformance = (
  activityType: ActivityType,
  preEmotion: Emotion,
  timestamp: string,
  hasBoost: boolean = false
): {
  score?: number;
  correctAnswers?: number;
  totalQuestions?: number;
  pairs?: number;
  moves?: number;
  timeElapsed?: number;
  durationSeconds: number;
} => {
  const hour = getHourOfDay(timestamp);
  const day = getDayOfWeek(timestamp);
  const date = getDateOfMonth(timestamp);
  
  // Base performance level (0-1)
  let performanceLevel = 0.6;
  
  // Emotion effects
  if (activityType === 'quiz') {
    if (preEmotion === 'happy') {
      performanceLevel += 0.25; // Primary pattern
    } else if (preEmotion === 'calm') {
      performanceLevel += 0.1;
    }
  } else {
    if (preEmotion === 'calm') {
      performanceLevel += 0.25; // Primary pattern
    } else if (preEmotion === 'happy') {
      performanceLevel += 0.1;
    }
  }
  
  // Time effects
  if (hour >= 10 && hour <= 12) {
    performanceLevel += 0.1;
  } else if (hour >= 13 && hour <= 16) {
    performanceLevel -= 0.05;
  }
  
  // Day effects
  if (day === 1) {
    performanceLevel -= 0.15;
  } else if (day === 3 && preEmotion === 'frustrated') {
    performanceLevel += 0.2; // Hidden pattern
  }
  
  // Date effects
  if (date <= 15) {
    performanceLevel += (date / 15) * 0.05;
  } else {
    performanceLevel -= ((date - 15) / 15) * 0.05;
  }
  
  // Performance boost from previous success
  if (hasBoost) {
    performanceLevel += 0.1;
  }
  
  // Add randomness
  performanceLevel += (Math.random() - 0.5) * 0.1;
  performanceLevel = Math.max(0.2, Math.min(1.0, performanceLevel));
  
  if (activityType === 'quiz') {
    const totalQuestions = 10;
    const correctAnswers = Math.round(performanceLevel * totalQuestions);
    return {
      totalQuestions,
      correctAnswers,
      score: correctAnswers * 10,
      durationSeconds: 30 + Math.floor(Math.random() * 90)
    };
  } else {
    const pairs = 8;
    const perfectMoves = pairs * 2;
    const maxExtraMoves = pairs * 3;
    const moves = perfectMoves + Math.round((1 - performanceLevel) * maxExtraMoves);
    const timeElapsed = (pairs * 5) + Math.round((1 - performanceLevel) * pairs * 20);
    return {
      pairs,
      moves,
      timeElapsed,
      durationSeconds: timeElapsed
    };
  }
};

// Generate post-activity emotion
const getPostActivityEmotion = (
  preEmotion: Emotion,
  performance: number,
  activityType: ActivityType
): Emotion => {
  let probabilities: Record<Emotion, number> = {
    'happy': 0.1,
    'sad': 0.05,
    'anxious': 0.05,
    'angry': 0.05,
    'calm': 0.2,
    'excited': 0.1,
    'tired': 0.3,
    'frustrated': 0.15
  };
  
  // Performance impact
  if (performance >= 85) {
    probabilities.happy += 0.3;
    probabilities.excited += 0.2;
  } else if (performance >= 70) {
    probabilities.happy += 0.2;
    probabilities.calm += 0.1;
  } else if (performance <= 30) {
    probabilities.frustrated += 0.25;
    probabilities.sad += 0.2;
  }
  
  // Special patterns
  if (activityType === 'quiz' && preEmotion === 'anxious' && performance >= 70) {
    probabilities.happy += 0.4; // Hidden pattern
  } else if (activityType === 'memory_game' && preEmotion === 'angry' && performance >= 70) {
    probabilities.calm += 0.4; // Hidden pattern
  }
  
  // Normalize probabilities
  Object.keys(probabilities).forEach(emotion => {
    probabilities[emotion as Emotion] = Math.max(0.01, probabilities[emotion as Emotion]);
  });
  
  const total = Object.values(probabilities).reduce((sum, p) => sum + p, 0);
  Object.keys(probabilities).forEach(emotion => {
    probabilities[emotion as Emotion] /= total;
  });
  
  // Select emotion
  const roll = Math.random();
  let cumulative = 0;
  
  for (const [emotion, probability] of Object.entries(probabilities)) {
    cumulative += probability;
    if (roll <= cumulative) {
      return emotion as Emotion;
    }
  }
  
  return 'tired';
};

// Main data generation function for Alex (original)
export const generateAlexMockData = async (): Promise<{
  emotionLogsCount: number;
  activitiesCount: number;
  contextsCount: number;
}> => {
  return generateMockDataForKid(ALEX_USER_ID, ALEX_USER_NAME);
};

// New function to generate mock data for any kid
export const generateMockDataForKid = async (
  kidId: string,
  kidName: string
): Promise<{
  emotionLogsCount: number;
  activitiesCount: number;
  contextsCount: number;
}> => {
  try {
    // Generate activity timestamps
    const timestamps = generateActivityTimestamps();
    
    // Initialize storage arrays
    const emotionLogs: EmotionLog[] = [];
    const activityResults: ActivityResult[] = [];
    const emotionActivityContexts: EmotionActivityContext[] = [];
    
    // Generate data for each activity
    for (let i = 0; i < timestamps.length; i++) {
      const timestamp = timestamps[i];
      const hasBoost = timestamp.includes('|boost');
      const cleanTimestamp = hasBoost ? timestamp.split('|')[0] : timestamp;
      
      // Determine activity type with sequence effect
      let activityType: ActivityType;
      if (i >= 3 &&
          activityResults[i-1]?.activityType === activityResults[i-2]?.activityType &&
          activityResults[i-2]?.activityType === activityResults[i-3]?.activityType) {
        const previousType = activityResults[i-1].activityType;
        activityType = Math.random() < 0.8 
          ? (previousType === 'quiz' ? 'memory_game' : 'quiz')
          : previousType;
      } else {
        activityType = Math.random() < 0.5 ? 'quiz' : 'memory_game';
      }
      
      // Generate pre-activity emotion
      const preActivityTime = new Date(cleanTimestamp);
      preActivityTime.setMinutes(preActivityTime.getMinutes() - 5);
      const preEmotion = getEmotionByTimePattern(preActivityTime.toISOString());
      
      const preEmotionLog: EmotionLog = {
        id: nanoid(),
        userId: kidId,
        role: 'child',
        emotion: preEmotion,
        timestamp: preActivityTime.toISOString(),
        optionalNote: `Before ${activityType}`
      };
      
      emotionLogs.push(preEmotionLog);
      
      // Generate activity result
      const performance = calculatePerformance(activityType, preEmotion, cleanTimestamp, hasBoost);
      
      const activityResult: ActivityResult = {
        id: nanoid(),
        userId: kidId,
        activityType,
        timestamp: cleanTimestamp,
        ...performance,
        categoryId: activityType === 'quiz' 
          ? QUIZ_CATEGORIES[Math.floor(Math.random() * QUIZ_CATEGORIES.length)]
          : undefined
      };
      
      activityResults.push(activityResult);
      
      // Link pre-activity emotion
      emotionActivityContexts.push({
        id: nanoid(),
        emotionLogId: preEmotionLog.id,
        activityId: activityResult.id,
        contextType: 'before',
        timestamp: preEmotionLog.timestamp
      });
      
      // Generate post-activity emotion
      const postActivityTime = new Date(cleanTimestamp);
      postActivityTime.setSeconds(postActivityTime.getSeconds() + performance.durationSeconds + 10);
      
      const performanceMetric = activityType === 'quiz'
        ? ((performance.correctAnswers || 0) / (performance.totalQuestions || 1)) * 100
        : (performance.pairs && performance.moves)
          ? Math.max(0, Math.min(1, (performance.pairs * 2) / performance.moves)) * 100
          : 50;
      
      const postEmotion = getPostActivityEmotion(preEmotion, performanceMetric, activityType);
      
      const postEmotionLog: EmotionLog = {
        id: nanoid(),
        userId: kidId,
        role: 'child',
        emotion: postEmotion,
        timestamp: postActivityTime.toISOString(),
        optionalNote: `After ${activityType}`
      };
      
      emotionLogs.push(postEmotionLog);
      
      // Link post-activity emotion
      emotionActivityContexts.push({
        id: nanoid(),
        emotionLogId: postEmotionLog.id,
        activityId: activityResult.id,
        contextType: 'after',
        timestamp: postEmotionLog.timestamp
      });
      
      // Add performance boost marker for next activity if applicable
      if (i < timestamps.length - 1 && performanceMetric >= 80) {
        const nextTimestamp = new Date(timestamps[i+1]);
        const currentTimestamp = new Date(cleanTimestamp);
        const hoursDifference = (nextTimestamp.getTime() - currentTimestamp.getTime()) / (1000 * 60 * 60);
        
        if (hoursDifference <= 3) {
          timestamps[i+1] = `${timestamps[i+1]}|boost`;
        }
      }
    }
    
    // Generate extra random emotion logs
    const extraEmotionCount = 20 + Math.floor(Math.random() * 10);
    for (let i = 0; i < extraEmotionCount; i++) {
      const dayOffset = Math.floor(Math.random() * 14);
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      const timestamp = getDateInPast(dayOffset, hour, minute);
      
      emotionLogs.push({
        id: nanoid(),
        userId: kidId,
        role: 'child',
        emotion: getEmotionByTimePattern(timestamp),
        timestamp,
        optionalNote: `${kidName}'s mood check`
      });
    }
    
    // Get existing data
    const existingLogsJSON = localStorage.getItem(EMOTION_LOGS_KEY);
    const existingResultsJSON = localStorage.getItem(ACTIVITY_RESULTS_KEY);
    const existingContextsJSON = localStorage.getItem(EMOTION_ACTIVITY_CONTEXTS_KEY);
    
    // Parse existing data or use empty arrays
    const existingLogs: EmotionLog[] = existingLogsJSON ? JSON.parse(existingLogsJSON) : [];
    const existingResults: ActivityResult[] = existingResultsJSON ? JSON.parse(existingResultsJSON) : [];
    const existingContexts: EmotionActivityContext[] = existingContextsJSON ? JSON.parse(existingContextsJSON) : [];
    
    // Merge new data with existing data
    const allLogs = [...existingLogs, ...emotionLogs];
    const allResults = [...existingResults, ...activityResults];
    const allContexts = [...existingContexts, ...emotionActivityContexts];
    
    // Sort all data chronologically
    allLogs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    allResults.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    allContexts.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    // Store merged data
    localStorage.setItem(EMOTION_LOGS_KEY, JSON.stringify(allLogs));
    localStorage.setItem(ACTIVITY_RESULTS_KEY, JSON.stringify(allResults));
    localStorage.setItem(EMOTION_ACTIVITY_CONTEXTS_KEY, JSON.stringify(allContexts));
    
    return {
      emotionLogsCount: emotionLogs.length,
      activitiesCount: activityResults.length,
      contextsCount: emotionActivityContexts.length
    };
  } catch (error) {
    console.error('Error generating mock data:', error);
    throw error;
  }
};
