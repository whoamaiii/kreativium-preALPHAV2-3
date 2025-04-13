import { EmotionLog, PatternAnalysisResult, EMOTIONS } from '../types/emotion';
import { User } from '../types/user';

// Extend the Window interface to include mcpClient
declare global {
  interface Window {
    mcpClient?: {
      callTool: (params: {
        serverName: string;
        toolName: string;
        arguments: any;
      }) => Promise<any>;
    };
  }
}

/**
 * Integration with the Sequential Thinking MCP server
 * This module handles communication with the MCP server for analyzing emotion data
 */

type SequentialThinkingResponse = {
  analysis: string;
  recommendations: string[];
  patternDetected: boolean;
  confidenceScore: number;
};

/**
 * Processes an emotion log through the Sequential Thinking MCP server
 * @param emotionLog The emotion log to process
 * @param context Additional context about the user or situation
 * @returns Analysis of the emotion log
 */
export async function processEmotionLog(emotionLog: EmotionLog, stepNumber: number, context?: string): Promise<SequentialThinkingResponse> {
  try {
    // Format the emotion log as a thought to be processed
    const thought = `User ${emotionLog.userId} is feeling ${emotionLog.emotion} at ${new Date(emotionLog.timestamp).toLocaleTimeString()}${emotionLog.optionalNote ? ` and noted: "${emotionLog.optionalNote}"` : ''}`;
    
    // Call the MCP server to process the thought
    if (!window.mcpClient) {
      throw new Error('MCP client not available');
    }
    
    const result = await window.mcpClient.callTool({
      serverName: 'github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking',
      toolName: 'processThought',
      arguments: {
        thought,
        stepNumber,
        context
      }
    });
    
    // Parse and return the response
    return {
      analysis: result.analysis || "No analysis available",
      recommendations: result.recommendations || [],
      patternDetected: result.patternDetected || false,
      confidenceScore: result.confidenceScore || 0
    };
  } catch (error) {
    console.error('Error processing emotion log with Sequential Thinking MCP:', error);
    return {
      analysis: "Error processing emotion data",
      recommendations: [],
      patternDetected: false,
      confidenceScore: 0
    };
  }
}

/**
 * Analyzes a batch of emotion logs to detect patterns
 * @param logs Array of emotion logs to analyze
 * @param user The user requesting the analysis
 * @returns Analysis results including patterns and recommendations
 */
export async function analyzeEmotionPatterns(logs: EmotionLog[], user: User): Promise<PatternAnalysisResult> {
  // Default empty result
  const emptyResult: PatternAnalysisResult = {
    overallFrequency: [],
    hourlyPatterns: [],
    significantPatterns: [],
    heatmapData: []
  };
  
  try {
    if (logs.length === 0) return emptyResult;
    
    // Create context for the analysis
    const context = `Analyzing ${logs.length} emotion logs for ${user.role === 'teacher' ? 'a teacher review' : 'user insights'}`;
    
    // Process each log as a sequential thinking step
    const processedLogs = await Promise.all(
      logs.map((log, index) => processEmotionLog(log, index + 1, context))
    );
    
    // Combine the results to identify patterns
    const significantPatterns = processedLogs
      .filter(result => result.patternDetected && result.confidenceScore > 0.7)
      .map(result => result.analysis);
    
    // Calculate frequency data
    const frequencyMap = new Map<string, number>();
    logs.forEach(log => {
      const count = frequencyMap.get(log.emotion) || 0;
      frequencyMap.set(log.emotion, count + 1);
    });
    
    // Calculate overall frequency
    const overallFrequency = EMOTIONS.map(emotion => ({
      emotion,
      count: frequencyMap.get(emotion) || 0
    })).sort((a, b) => b.count - a.count);
    
    // Calculate hourly patterns
    const hourlyPatternsMap = new Map<number, Record<string, number>>();
    for (let i = 0; i < 24; i++) {
      const emotionCounts: Record<string, number> = {};
      EMOTIONS.forEach(emotion => { emotionCounts[emotion] = 0; });
      hourlyPatternsMap.set(i, emotionCounts);
    }
    
    logs.forEach(log => {
      const hour = new Date(log.timestamp).getHours();
      const hourData = hourlyPatternsMap.get(hour);
      if (hourData) {
        hourData[log.emotion] = (hourData[log.emotion] || 0) + 1;
      }
    });
    
    const hourlyPatterns = Array.from(hourlyPatternsMap.entries()).map(([hour, emotionCounts]) => {
      let dominantEmotion = EMOTIONS[0];
      let maxCount = 0;
      
      EMOTIONS.forEach(emotion => {
        if (emotionCounts[emotion] > maxCount) {
          maxCount = emotionCounts[emotion];
          dominantEmotion = emotion;
        }
      });
      
      return {
        hour,
        emotionCounts: emotionCounts as Record<string, number>,
        dominantEmotion: maxCount > 0 ? dominantEmotion : undefined
      };
    });
    
    // Create heatmap data
    const heatmapData = Array(24).fill(0).map(() => Array(EMOTIONS.length).fill(0));
    logs.forEach(log => {
      const hour = new Date(log.timestamp).getHours();
      const emotionIndex = EMOTIONS.indexOf(log.emotion);
      if (emotionIndex >= 0) {
        heatmapData[hour][emotionIndex]++;
      }
    });
    
    // Return the analysis results with calculated metrics
    return {
      overallFrequency,
      hourlyPatterns,
      significantPatterns,
      heatmapData
    };
  } catch (error) {
    console.error('Error analyzing emotion patterns:', error);
    return emptyResult;
  }
}
