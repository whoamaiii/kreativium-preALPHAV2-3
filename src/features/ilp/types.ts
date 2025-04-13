export type Skill = "reading" | "math" | "social" | "motor" | "language" | "cognitive" | "emotional";
export type GoalStatus = "pending" | "in-progress" | "completed";

export interface ILPGoal {
  id: string; // Backend-provided ID
  ilpId: string;
  skill: Skill;
  description: string;
  targetDate?: string; // ISO date string or as needed by backend
  status: GoalStatus;
  createdAt: string; // ISO date string
}

export interface ILP {
  id: string; // Backend-provided ID
  userId: string; // Link to existing user
  title: string;
  createdAt: string; // ISO date string
  goals?: ILPGoal[]; // Goals might be embedded or fetched separately
} 