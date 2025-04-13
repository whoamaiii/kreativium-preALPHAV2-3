import { readFile, readdir } from 'fs/promises';
import { join, extname } from 'path';
import { AnalyzerOptions, AnalysisReport, CodeIssue } from './types';
import { rules } from './rules';

export class CodeAnalyzer {
  private options: Required<AnalyzerOptions>;

  constructor(options: AnalyzerOptions) {
    this.options = {
      maxIssues: 1000,
      ...options,
    };
  }

  private async getFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const items = await readdir(dir, { withFileTypes: true });

    for (const item of items) {
      const path = join(dir, item.name);
      
      if (this.options.excludePaths.some(exclude => path.includes(exclude))) {
        continue;
      }

      if (item.isDirectory()) {
        files.push(...await this.getFiles(path));
      } else if (['.ts', '.tsx', '.js', '.jsx'].includes(extname(item.name))) {
        files.push(path);
      }
    }

    return files;
  }

  private async analyzeFile(filePath: string): Promise<CodeIssue[]> {
    const issues: CodeIssue[] = [];
    const fileContent = await readFile(filePath, 'utf-8');

    for (const rule of rules) {
      if (this.options.categories && !this.options.categories.includes(rule.category)) {
        continue;
      }

      if (this.options.severityThreshold) {
        const severityLevels = Object.values(IssueSeverity);
        const thresholdIndex = severityLevels.indexOf(this.options.severityThreshold);
        const ruleIndex = severityLevels.indexOf(rule.severity);
        
        if (ruleIndex > thresholdIndex) {
          continue;
        }
      }

      const ruleIssues = await rule.analyze({
        filePath,
        fileContent,
      });

      issues.push(...ruleIssues);
    }

    return issues;
  }

  public async analyze(): Promise<AnalysisReport> {
    const startTime = Date.now();
    const allIssues: CodeIssue[] = [];
    let totalFiles = 0;
    let totalLines = 0;

    for (const includePath of this.options.includePaths) {
      const files = await this.getFiles(includePath);
      totalFiles += files.length;

      for (const file of files) {
        const fileContent = await readFile(file, 'utf-8');
        totalLines += fileContent.split('\n').length;

        const issues = await this.analyzeFile(file);
        allIssues.push(...issues);

        if (allIssues.length >= this.options.maxIssues) {
          break;
        }
      }
    }

    // Sort issues by severity
    allIssues.sort((a, b) => {
      const severityOrder = Object.values(IssueSeverity);
      return severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity);
    });

    // Generate file statistics
    const fileStats = allIssues.reduce((acc, issue) => {
      acc[issue.filePath] = (acc[issue.filePath] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostAffectedFiles = Object.entries(fileStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([filePath, count]) => ({ filePath, issueCount: count }));

    return {
      issues: allIssues.slice(0, this.options.maxIssues),
      summary: {
        totalIssues: allIssues.length,
        criticalCount: allIssues.filter(i => i.severity === IssueSeverity.Critical).length,
        highCount: allIssues.filter(i => i.severity === IssueSeverity.High).length,
        mediumCount: allIssues.filter(i => i.severity === IssueSeverity.Medium).length,
        lowCount: allIssues.filter(i => i.severity === IssueSeverity.Low).length,
        mostAffectedFiles,
      },
      metadata: {
        analyzedAt: new Date().toISOString(),
        duration: Date.now() - startTime,
        filesAnalyzed: totalFiles,
        totalLinesOfCode: totalLines,
      },
    };
  }
}