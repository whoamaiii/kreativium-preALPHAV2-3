import { z } from 'zod';

/**
 * Severity level for an issue
 */
export enum IssueSeverity {
  Critical = 'Critical',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

/**
 * Category type for an issue
 */
export enum IssueCategory {
  BestPractice = 'BestPractice',
  Accessibility = 'Accessibility',
  Performance = 'Performance',
  Security = 'Security',
  Maintenance = 'Maintenance',
  TypeScript = 'TypeScript'
}

/**
 * Represents an issue found by an analyzer
 */
export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: IssueSeverity | keyof typeof IssueSeverity;
  category: IssueCategory | keyof typeof IssueCategory;
  line?: number;
  column?: number;
  file?: string;
  code?: string;
  solution?: string;
}

/**
 * Options for analyzer configuration
 */
export interface AnalyzerOptions {
  includePaths?: string[];
  excludePaths?: string[];
  severityThreshold?: IssueSeverity | keyof typeof IssueSeverity;
  categories?: Array<IssueCategory | keyof typeof IssueCategory>;
  maxIssues?: number;
}

/**
 * Result of an analysis
 */
export interface AnalysisResult {
  issues: Issue[];
  summary: {
    totalIssues: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    categories: Record<IssueCategory | string, number>;
  };
  timestamp: Date;
}

export const CodeIssueSchema = z.object({
  id: z.string(),
  severity: z.nativeEnum(IssueSeverity),
  category: z.nativeEnum(IssueCategory),
  title: z.string(),
  description: z.string(),
  filePath: z.string(),
  lineNumber: z.number().optional(),
  suggestion: z.string(),
  originalCode: z.string().optional(),
  fixedCode: z.string().optional(),
  effort: z.number(), // 1-5 scale
  createdAt: z.string(),
});

export type CodeIssue = z.infer<typeof CodeIssueSchema>;

export interface AnalysisReport {
  issues: CodeIssue[];
  summary: {
    totalIssues: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    mostAffectedFiles: Array<{
      filePath: string;
      issueCount: number;
    }>;
  };
  metadata: {
    analyzedAt: string;
    duration: number;
    filesAnalyzed: number;
    totalLinesOfCode: number;
  };
}