import { useState, useEffect, useCallback } from 'react';
import { EmotionLog, PatternAnalysisResult } from '../types/emotion';
import { analyzeEmotionPatterns } from '../lib/sequentialThinkingMCP';
import { useAuthContext } from './useAuthContext';

interface PatternAnalysisHookResult {
  analysisResult: PatternAnalysisResult | null;
  isAnalyzing: boolean;
  error: Error | null;
  runAnalysis: () => Promise<void>;
}

const emptyResult: PatternAnalysisResult = {
  overallFrequency: [],
  hourlyPatterns: [],
  significantPatterns: [],
  heatmapData: []
};

/**
 * Hook for analyzing patterns in emotion logs
 * Uses Sequential Thinking MCP for advanced analysis
 */
export function usePatternAnalysis(
  logs: EmotionLog[],
  autoAnalyze: boolean = true
): PatternAnalysisHookResult {
  const { user } = useAuthContext();
  const [analysisResult, setAnalysisResult] = useState<PatternAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to run the analysis
  const runAnalysis = useCallback(async () => {
    if (!user || logs.length === 0) {
      setAnalysisResult(emptyResult);
      return;
    }

    // Only teachers can access full analysis features
    if (user.role !== 'teacher') {
      console.warn('Pattern analysis is only available for teachers');
      setAnalysisResult(emptyResult);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Process logs using Sequential Thinking MCP
      const result = await analyzeEmotionPatterns(logs, user);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Error analyzing emotion patterns:', err);
      setError(err instanceof Error ? err : new Error('Failed to analyze emotion patterns'));
      setAnalysisResult(emptyResult);
    } finally {
      setIsAnalyzing(false);
    }
  }, [logs, user]);

  // Auto-run analysis when logs change if autoAnalyze is true
  useEffect(() => {
    if (autoAnalyze && user?.role === 'teacher' && logs.length > 0) {
      runAnalysis();
    } else if (logs.length === 0) {
      setAnalysisResult(emptyResult);
    }
  }, [logs, user, autoAnalyze, runAnalysis]);

  return {
    analysisResult,
    isAnalyzing,
    error,
    runAnalysis
  };
}
