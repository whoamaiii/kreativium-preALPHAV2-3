export type FeelingIntensity = 1 | 2 | 3 | 4 | 5;
export type FeelingType = 
  | 'happy' 
  | 'sad' 
  | 'angry' 
  | 'scared'
  | 'surprised'
  | 'disgusted'
  | 'calm'
  | 'tired'
  | 'excited'
  | 'bored'
  | 'frustrated'
  | 'proud'
  | 'nervous'
  | 'confused'
  | 'lonely'
  | 'loved'
  | 'jealous'
  | 'worried'
  | 'embarrassed'
  | 'confident'
  | 'hopeful'
  | 'disappointed'
  | 'other';

export interface FeelingEntry {
  id: string;
  userId: string;
  type: FeelingType;
  intensity: FeelingIntensity;
  notes?: string;
  triggers?: string[];
  timestamp: string; // ISO date string
  location?: string;
  activity?: string;
}

export interface FeelingStats {
  mostCommonFeeling: FeelingType;
  averageIntensity: number;
  feelingCounts: Record<FeelingType, number>;
  dateRange: {
    start: string; // ISO date string
    end: string; // ISO date string
  };
}

export interface FeelingTrend {
  feeling: FeelingType;
  data: Array<{
    date: string; // ISO date string
    intensity: FeelingIntensity;
    count: number;
  }>;
} 