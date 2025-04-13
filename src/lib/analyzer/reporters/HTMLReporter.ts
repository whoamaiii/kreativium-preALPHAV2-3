import { AnalysisReport, IssueSeverity } from '../types';

export class HTMLReporter {
  private getSeverityColor(severity: IssueSeverity): string {
    const colors = {
      [IssueSeverity.Critical]: 'text-red-500',
      [IssueSeverity.High]: 'text-yellow-500',
      [IssueSeverity.Medium]: 'text-blue-500',
      [IssueSeverity.Low]: 'text-gray-500',
    };
    return colors[severity];
  }

  public generateReport(analysisReport: AnalysisReport): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Code Analysis Report</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
          <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold mb-8">Code Analysis Report</h1>
            
            <!-- Summary -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              ${this.renderSummaryCards(analysisReport)}
            </div>

            <!-- Most Affected Files -->
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8">
              <h2 class="text-xl font-semibold mb-4">Most Affected Files</h2>
              ${this.renderAffectedFiles(analysisReport)}
            </div>

            <!-- Issues -->
            <div class="space-y-6">
              ${this.renderIssues(analysisReport)}
            </div>

            <!-- Metadata -->
            <div class="mt-8 text-sm text-gray-600 dark:text-gray-400">
              <p>Analyzed at: ${new Date(analysisReport.metadata.analyzedAt).toLocaleString()}</p>
              <p>Duration: ${analysisReport.metadata.duration}ms</p>
              <p>Files analyzed: ${analysisReport.metadata.filesAnalyzed}</p>
              <p>Total lines of code: ${analysisReport.metadata.totalLinesOfCode}</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private renderSummaryCards(report: AnalysisReport): string {
    const cards = [
      { label: 'Critical', count: report.summary.criticalCount, color: 'red' },
      { label: 'High', count: report.summary.highCount, color: 'yellow' },
      { label: 'Medium', count: report.summary.mediumCount, color: 'blue' },
      { label: 'Low', count: report.summary.lowCount, color: 'gray' },
    ];

    return cards.map(card => `
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h3 class="text-sm font-medium text-${card.color}-500">${card.label}</h3>
        <p class="text-2xl font-bold">${card.count}</p>
      </div>
    `).join('');
  }

  private renderAffectedFiles(report: AnalysisReport): string {
    return `
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="text-left py-2">File</th>
              <th class="text-left py-2">Issues</th>
            </tr>
          </thead>
          <tbody>
            ${report.summary.mostAffectedFiles.map(file => `
              <tr>
                <td class="py-2">${file.filePath}</td>
                <td class="py-2">${file.issueCount}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  private renderIssues(report: AnalysisReport): string {
    return Object.values(IssueSeverity).map(severity => {
      const issues = report.issues.filter(i => i.severity === severity);
      if (issues.length === 0) return '';

      return `
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4 ${this.getSeverityColor(severity)}">
            ${severity.toUpperCase()} Issues
          </h2>
          <div class="space-y-4">
            ${issues.map(issue => `
              <div class="border-l-4 border-${this.getSeverityColor(issue.severity)} pl-4">
                <h3 class="font-medium">${issue.title}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">${issue.description}</p>
                <p class="text-sm"><span class="font-medium">File:</span> ${issue.filePath}</p>
                <p class="text-sm"><span class="font-medium">Suggestion:</span> ${issue.suggestion}</p>
                ${issue.originalCode ? `
                  <div class="mt-2">
                    <p class="text-sm font-medium">Original Code:</p>
                    <pre class="text-sm bg-gray-100 dark:bg-gray-900 p-2 rounded mt-1">${issue.originalCode}</pre>
                  </div>
                ` : ''}
                ${issue.fixedCode ? `
                  <div class="mt-2">
                    <p class="text-sm font-medium">Suggested Fix:</p>
                    <pre class="text-sm bg-gray-100 dark:bg-gray-900 p-2 rounded mt-1">${issue.fixedCode}</pre>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }
}