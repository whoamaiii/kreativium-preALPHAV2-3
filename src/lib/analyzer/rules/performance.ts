import { Rule, RuleContext } from './index';
import { IssueSeverity, IssueCategory } from '../types';
import { nanoid } from 'nanoid';

export const analyzePerformanceIssues: Rule[] = [
  {
    id: 'PERF001',
    category: IssueCategory.Performance,
    severity: IssueSeverity.High,
    analyze: async ({ filePath, fileContent }: RuleContext) => {
      const issues = [];

      // Check for missing React.memo or useMemo
      if (fileContent.includes('const') && 
          fileContent.includes('=>') && 
          !fileContent.includes('useMemo') &&
          !fileContent.includes('React.memo')) {
        
        issues.push({
          id: nanoid(),
          severity: IssueSeverity.Medium,
          category: IssueCategory.Performance,
          title: 'Missing Memoization',
          description: 'Component or calculation might benefit from memoization',
          filePath,
          suggestion: 'Consider using React.memo or useMemo for expensive calculations',
          effort: 2,
          createdAt: new Date().toISOString(),
        });
      }

      // Check for large bundle imports
      const importRegex = /import\s+{\s*([^}]+)\s*}\s+from\s+['"]([^'"]+)['"]/g;
      let match;
      while ((match = importRegex.exec(fileContent)) !== null) {
        const imports = match[1].split(',').map(i => i.trim());
        if (imports.length > 5) {
          issues.push({
            id: nanoid(),
            severity: IssueSeverity.Medium,
            category: IssueCategory.Performance,
            title: 'Large Bundle Import',
            description: `Large number of imports (${imports.length}) from a single module`,
            filePath,
            suggestion: 'Consider code splitting or importing specific components',
            originalCode: match[0],
            effort: 2,
            createdAt: new Date().toISOString(),
          });
        }
      }

      return issues;
    },
  },
  // Add more performance rules here
];