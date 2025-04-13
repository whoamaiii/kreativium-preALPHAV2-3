import { Rule, RuleContext } from './index';
import { IssueSeverity, IssueCategory } from '../types';
import { nanoid } from 'nanoid';

export const analyzeSecurityIssues: Rule[] = [
  {
    id: 'SEC001',
    category: IssueCategory.Security,
    severity: IssueSeverity.Critical,
    analyze: async ({ filePath, fileContent }: RuleContext) => {
      const issues = [];

      // Check for hardcoded secrets
      const secretsRegex = /(password|secret|key|token).*?['"]\w+['"]/gi;
      const matches = fileContent.match(secretsRegex);

      if (matches) {
        issues.push({
          id: nanoid(),
          severity: IssueSeverity.Critical,
          category: IssueCategory.Security,
          title: 'Hardcoded Secrets Detected',
          description: 'Found potential hardcoded secrets in the code',
          filePath,
          suggestion: 'Move secrets to environment variables',
          originalCode: matches[0],
          effort: 2,
          createdAt: new Date().toISOString(),
        });
      }

      // Check for unsafe innerHTML usage
      if (fileContent.includes('dangerouslySetInnerHTML')) {
        issues.push({
          id: nanoid(),
          severity: IssueSeverity.High,
          category: IssueCategory.Security,
          title: 'Unsafe innerHTML Usage',
          description: 'Using dangerouslySetInnerHTML can lead to XSS vulnerabilities',
          filePath,
          suggestion: 'Use safe content rendering methods or sanitize HTML content',
          effort: 3,
          createdAt: new Date().toISOString(),
        });
      }

      return issues;
    },
  },
  // Add more security rules here
];