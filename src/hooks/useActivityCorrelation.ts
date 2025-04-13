import { useState, useCallback } from 'react';
import {
  EmotionActivityCorrelation,
  CorrelationFilters,
  EmotionLearningAnalysis,
  EmotionBasedRecommendation,
  ActivityResult,
  EmotionActivityContext
} from '../types/integration';
import { Emotion } from '../types/emotion';

export interface ActivityCorrelationHookResult {
  getCorrelations: (filters: CorrelationFilters) => Promise<EmotionActivityCorrelation[]>;
  analyzeCorrelations: (correlations: EmotionActivityCorrelation[]) => Promise<EmotionLearningAnalysis>;
  saveActivityResult: (result: Omit<ActivityResult, 'id' | 'timestamp'>) => Promise<ActivityResult>;
  linkEmotionToActivity: (emotionLogId: string, activityId: string, contextType: 'before' | 'after') => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export const useActivityCorrelation = (): ActivityCorrelationHookResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getCorrelations = useCallback(async (filters: CorrelationFilters): Promise<EmotionActivityCorrelation[]> => {
    try {
      // Get data from localStorage (mock data)
      const activityResults = JSON.parse(localStorage.getItem('activity_results') || '[]') as ActivityResult[];
      const emotionContexts = JSON.parse(localStorage.getItem('emotion_activity_contexts') || '[]') as EmotionActivityContext[];
      const emotionLogs = JSON.parse(localStorage.getItem('emotion_logs') || '[]');

      // Apply filters
      let filteredResults = activityResults;
      
      if (filters.activityType) {
        filteredResults = filteredResults.filter(r => r.activityType === filters.activityType);
      }

      if (filters.timeframe) {
        const now = new Date();
        let startDate = new Date();
        
        switch (filters.timeframe) {
          case 'day':
            startDate.setDate(now.getDate() - 1);
            break;
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          // 'all' case - no date filtering
        }

        if (filters.timeframe !== 'all') {
          filteredResults = filteredResults.filter(r => 
            new Date(r.timestamp) >= startDate && new Date(r.timestamp) <= now
          );
        }
      }

      // Build correlations
      const correlations: EmotionActivityCorrelation[] = [];

      for (const result of filteredResults) {
        const contexts = emotionContexts.filter(c => c.activityId === result.id);
        
        for (const context of contexts) {
          if (filters.contextType && context.contextType !== filters.contextType) {
            continue;
          }

          const emotionLog = emotionLogs.find((e: { id: string }) => e.id === context.emotionLogId);
          if (!emotionLog) continue;

          // Calculate performance metric
          let performanceMetric = 0;
          if (result.activityType === 'quiz' && result.correctAnswers !== undefined && result.totalQuestions !== undefined) {
            performanceMetric = (result.correctAnswers / result.totalQuestions) * 100;
          } else if (result.activityType === 'memory_game' && result.moves !== undefined && result.pairs !== undefined) {
            const perfectMoves = result.pairs * 2;
            performanceMetric = Math.max(0, Math.min(100, (perfectMoves / result.moves) * 100));
          }

          correlations.push({
            emotion: emotionLog.emotion,
            activityType: result.activityType,
            activityResult: result,
            emotionLog,
            contextType: context.contextType,
            performanceMetric
          });
        }
      }

      return correlations;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get correlations'));
      return [];
    }
  }, []);

  const analyzeCorrelations = useCallback(async (correlations: EmotionActivityCorrelation[]): Promise<EmotionLearningAnalysis> => {
    // Initialize analysis structure
    const analysis: EmotionLearningAnalysis = {
      totalActivities: correlations.length,
      totalEmotionsLogged: correlations.length,
      performanceByPreEmotion: {} as Record<Emotion, { averagePerformance: number; count: number }>,
      performanceByPostEmotion: {} as Record<Emotion, { averagePerformance: number; count: number }>,
      emotionalShifts: [],
      optimalEmotionalStates: [],
      recommendations: [],
      correlationMatrix: [],
      timeSeriesData: []
    };

    // Group correlations by emotion and context type
    const preActivityCorrelations = correlations.filter(c => c.contextType === 'before');
    const postActivityCorrelations = correlations.filter(c => c.contextType === 'after');

    // Calculate performance by pre-activity emotion
    const preEmotionPerformance = new Map<Emotion, number[]>();
    preActivityCorrelations.forEach(c => {
      if (!preEmotionPerformance.has(c.emotion)) {
        preEmotionPerformance.set(c.emotion, []);
      }
      preEmotionPerformance.get(c.emotion)?.push(c.performanceMetric);
    });

    preEmotionPerformance.forEach((performances, emotion) => {
      const average = performances.reduce((a, b) => a + b, 0) / performances.length;
      analysis.performanceByPreEmotion[emotion] = {
        averagePerformance: average,
        count: performances.length
      };
    });

    // Calculate performance by post-activity emotion
    const postEmotionPerformance = new Map<Emotion, number[]>();
    postActivityCorrelations.forEach(c => {
      if (!postEmotionPerformance.has(c.emotion)) {
        postEmotionPerformance.set(c.emotion, []);
      }
      postEmotionPerformance.get(c.emotion)?.push(c.performanceMetric);
    });

    postEmotionPerformance.forEach((performances, emotion) => {
      const average = performances.reduce((a, b) => a + b, 0) / performances.length;
      analysis.performanceByPostEmotion[emotion] = {
        averagePerformance: average,
        count: performances.length
      };
    });

    // Calculate emotional shifts
    const shifts = new Map<string, { count: number; performanceChanges: number[] }>();
    
    for (let i = 0; i < correlations.length - 1; i++) {
      const current = correlations[i];
      const next = correlations[i + 1];
      
      if (current.contextType === 'before' && next.contextType === 'after') {
        const key = `${current.emotion}-${next.emotion}`;
        if (!shifts.has(key)) {
          shifts.set(key, { count: 0, performanceChanges: [] });
        }
        const shift = shifts.get(key)!;
        shift.count++;
        shift.performanceChanges.push(next.performanceMetric - current.performanceMetric);
      }
    }

    shifts.forEach((data, key) => {
      const [fromEmotion, toEmotion] = key.split('-') as [Emotion, Emotion];
      analysis.emotionalShifts.push({
        fromEmotion,
        toEmotion,
        count: data.count,
        averagePerformanceChange: data.performanceChanges.reduce((a, b) => a + b, 0) / data.count
      });
    });

    // Identify optimal emotional states
    analysis.optimalEmotionalStates = Object.entries(analysis.performanceByPreEmotion)
      .sort(([, a], [, b]) => b.averagePerformance - a.averagePerformance)
      .slice(0, 3)
      .map(([emotion]) => emotion as Emotion);

    // Generate recommendations
    analysis.recommendations = generateRecommendations(analysis);

    // Time series data
    analysis.timeSeriesData = correlations
      .filter(c => c.contextType === 'before')
      .map(c => ({
        timestamp: c.emotionLog.timestamp,
        emotion: c.emotion,
        performance: c.performanceMetric
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return analysis;
  }, []);

  const saveActivityResult = useCallback(async (result: Omit<ActivityResult, 'id' | 'timestamp'>): Promise<ActivityResult> => {
    try {
      setLoading(true);
      const existingResults = JSON.parse(localStorage.getItem('activity_results') || '[]') as ActivityResult[];
      const newResult: ActivityResult = {
        ...result,
        id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      };
      existingResults.push(newResult);
      localStorage.setItem('activity_results', JSON.stringify(existingResults));
      return newResult;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save activity result'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const linkEmotionToActivity = useCallback(async (
    emotionLogId: string,
    activityId: string,
    contextType: 'before' | 'after'
  ): Promise<void> => {
    try {
      setLoading(true);
      const existingContexts = JSON.parse(localStorage.getItem('emotion_activity_contexts') || '[]') as EmotionActivityContext[];
      
      const newContext: EmotionActivityContext = {
        id: `${emotionLogId}-${activityId}-${contextType}`,
        emotionLogId,
        activityId,
        contextType,
        timestamp: new Date().toISOString()
      };

      existingContexts.push(newContext);
      localStorage.setItem('emotion_activity_contexts', JSON.stringify(existingContexts));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to link emotion to activity'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getCorrelations,
    analyzeCorrelations,
    saveActivityResult,
    linkEmotionToActivity,
    loading,
    error
  };
};

// Helper function to generate recommendations
function generateRecommendations(analysis: EmotionLearningAnalysis): EmotionBasedRecommendation[] {
  const recommendations: EmotionBasedRecommendation[] = [];

  // Add recommendations based on optimal emotional states
  analysis.optimalEmotionalStates.forEach((emotion, index) => {
    const performance = analysis.performanceByPreEmotion[emotion];
    if (performance && performance.count >= 5) {
      recommendations.push({
        id: `rec-${index}`,
        userId: 'system',
        targetEmotion: emotion,
        recommendedActivity: 'quiz',
        reasoning: `Performance is ${Math.round(performance.averagePerformance)}% higher when feeling ${emotion}`,
        timestamp: new Date().toISOString(),
        confidence: 0.7 + (0.1 * (3 - index)), // Higher confidence for top performers
        applied: false
      });
    }
  });

  // Add recommendations based on emotional shifts
  const positiveShifts = analysis.emotionalShifts
    .filter(shift => shift.averagePerformanceChange > 0 && shift.count >= 3)
    .sort((a, b) => b.averagePerformanceChange - a.averagePerformanceChange)
    .slice(0, 2);

  positiveShifts.forEach((shift, index) => {
    recommendations.push({
      id: `shift-${index}`,
      userId: 'system',
      targetEmotion: shift.fromEmotion,
      recommendedActivity: 'memory_game',
      reasoning: `Activities tend to improve performance by ${Math.round(shift.averagePerformanceChange)}% when starting from ${shift.fromEmotion}`,
      timestamp: new Date().toISOString(),
      confidence: 0.6 + (0.1 * (2 - index)),
      applied: false
    });
  });

  return recommendations;
}
