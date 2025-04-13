export type BadgeType = 'skill' | 'achievement' | 'milestone';

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string; 
  type: BadgeType;
  requiredXp?: number; // XP needed to earn badge (for milestone badges)
  dateEarned?: string; // ISO date string
}

export interface UserXP {
  total: number;
  level: number;
  currentLevelXp: number;
  nextLevelXp: number; // XP needed to reach next level
}

// XP events that can trigger XP awards
export type XPEventType = 
  | 'complete_quiz'
  | 'complete_memory_game'
  | 'ilp_goal_created'
  | 'ilp_goal_completed'
  | 'daily_login'
  | 'consecutive_login'
  | 'feelings_tracked';

export interface XPEvent {
  type: XPEventType;
  userId: string;
  value: number; // Amount of XP
  metadata?: Record<string, unknown>; // Additional context about the event
  timestamp: string; // ISO date string
}

// Level configuration
export interface LevelConfig {
  level: number;
  xpRequired: number; // Total XP required to reach this level
  title?: string; // Optional title for the level (e.g., "Beginner", "Expert")
} 