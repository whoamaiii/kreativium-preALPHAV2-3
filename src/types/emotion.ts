export type Emotion = 'happy' | 'sad' | 'anxious' | 'angry' | 'calm' | 'excited' | 'tired' | 'frustrated';

export const EMOTIONS: Emotion[] = ['happy', 'sad', 'anxious', 'angry', 'calm', 'excited', 'tired', 'frustrated'];

export const EMOTION_ICONS: Record<Emotion, string> = {
  happy: '😊',
  sad: '😢',
  anxious: '😟',
  angry: '😠',
  calm: '😌',
  excited: '😃',
  tired: '😴',
  frustrated: '😤',
};

export const EMOTION_COLORS: Record<Emotion, string> = {
  happy: '#4CAF50', // Green
  sad: '#2196F3',   // Blue
  anxious: '#FFC107', // Amber
  angry: '#F44336',   // Red
  calm: '#00BCD4',   // Cyan
  excited: '#FF9800', // Orange
  tired: '#9E9E9E',   // Grey
  frustrated: '#673AB7', // Deep Purple
};

export interface EmotionLog {
  id: string;
  userId: string;
  role: 'child' | 'teacher';
  emotion: Emotion;
  timestamp: string;
  optionalNote?: string;
}

export interface EmotionFilters {
  userId?: string;
  timeframe?: 'hour' | 'day' | 'week' | 'month' | 'all';
  startDate?: Date;
  endDate?: Date;
  emotion?: Emotion;
  role?: 'child' | 'teacher';
}

export interface EmotionFrequency {
  emotion: Emotion;
  count: number;
}

export interface HourlyEmotionPattern {
  hour: number; // 0-23
  emotionCounts: Record<Emotion, number>;
  dominantEmotion?: Emotion;
}

export interface PatternAnalysisResult {
  overallFrequency: EmotionFrequency[];
  hourlyPatterns: HourlyEmotionPattern[];
  significantPatterns: string[];
  heatmapData: number[][];
}

// Stress response zones
export type StressZone = 'green' | 'yellow' | 'red';

// Map emotions to their stress response zones
export const EMOTION_TO_ZONE: Record<Emotion, StressZone> = {
  'happy': 'green',
  'calm': 'green',
  'excited': 'yellow', // Can be positive but elevated energy
  'sad': 'yellow',
  'tired': 'yellow',
  'anxious': 'yellow',
  'frustrated': 'yellow',
  'angry': 'red'
};

// Zone colors for UI
export const ZONE_COLORS: Record<StressZone, string> = {
  'green': '#4ade80', // Green 500
  'yellow': '#fbbf24', // Amber 400
  'red': '#ef4444'    // Red 500
};

// Zone descriptions for UI
export const ZONE_DESCRIPTIONS: Record<StressZone, string> = {
  'green': 'Calm and regulated. Ready to learn and engage.',
  'yellow': 'Heightened alertness. May need support with emotions.',
  'red': 'Overwhelmed and dysregulated. Needs immediate calming support.'
};
