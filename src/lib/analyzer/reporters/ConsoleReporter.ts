import { AnalysisReport, IssueSeverity } from '../types';
import chalk from 'chalk';

export class ConsoleReporter {
  private severityColors = {
    [IssueSeverity.Critical]: chalk.red,
    [IssueSeverity.High]: chalk.yellow,
    [IssueSeverity.Medium]: chalk.blue,
    [IssueSeverity.Low]: chalk.gray,
  };

  public report(analysisReport: AnalysisReport): void {
    console.log('\n=== Code Analysis Report ===\n');

    // Print summary
    console.log('Summary:');
    console.log(`Total Issues: ${analysisReport.summary.totalIssues}`);
    console.log(`Critical: ${chalk.red(analysisReport.summary.criticalCount)}`);
    console.log(`High: ${chalk.yellow(analysisReport.summary.highCount)}`);
    console.log(`Medium: ${chalk.blue(analysisReport.summary.mediumCount)}`);
    console.log(`Low: ${chalk.gray(analysisReport.summary.lowCount)}`);

    console.log('\nMost Affected Files:');
    analysisReport.summary.mostAffectedFiles.forEach(({ filePath, issueCount }) => {
      console.log(`${chalk.cyan(filePath)}: ${issueCount} issues`);
    });

    // Print issues grouped by severity
    console.log('\nDetailed Issues:');
    Object.values(IssueSeverity).forEach(severity => {
      const issues = analysisReport.issues.filter(i => i.severity === severity);
      if (issues.length > 0) {
        console.log(`\n${this.severityColors[severity](severity.toUpperCase())} Issues:`);
        issues.forEach(issue => {
          console.log(`\n  ${chalk.bold(issue.title)}`);
          console.log(`  File: ${chalk.cyan(issue.filePath)}`);
          console.log(`  Description: ${issue.description}`);
          console.log(`  Suggestion: ${chalk.green(issue.suggestion)}`);
          if (issue.originalCode) {
            console.log(`  Original Code:\n${chalk.red(issue.originalCode)}`);
          }
          if (issue.fixedCode) {
            console.log(`  Suggested Fix:\n${chalk.green(issue.fixedCode)}`);
          }
        });
      }
    });

    // Print metadata
    console.log('\nAnalysis Metadata:');
    console.log(`Analyzed at: ${new Date(analysisReport.metadata.analyzedAt).toLocaleString()}`);
    console.log(`Duration: ${analysisReport.metadata.duration}ms`);
    console.log(`Files analyzed: ${analysisReport.metadata.filesAnalyzed}`);
    console.log(`Total lines of code: ${analysisReport.metadata.totalLinesOfCode}`);
  }
}