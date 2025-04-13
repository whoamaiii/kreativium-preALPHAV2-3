import { CodeIssue, IssueSeverity, IssueCategory } from '../types';
import { analyzeSecurityIssues } from './security';
import { analyzePerformanceIssues } from './performance';
import { analyzeBestPractices } from './bestPractices';
import { analyzeAccessibility } from './accessibility';
import { analyzeMaintenanceIssues } from './maintenance';

export interface RuleContext {
  filePath: string;
  fileContent: string;
  ast?: any;
}

export interface Rule {
  id: string;
  category: IssueCategory;
  severity: IssueSeverity;
  analyze: (context: RuleContext) => Promise<CodeIssue[]>;
}

export const rules: Rule[] = [
  ...analyzeSecurityIssues,
  ...analyzePerformanceIssues,
  ...analyzeBestPractices,
  ...analyzeAccessibility,
  ...analyzeMaintenanceIssues,
];