export * from './core';
export * from './types';
export * from './bestPractices';
export * from './accessibility';
export * from './maintenance';
export * from './reporters/ConsoleReporter';
export * from './reporters/HTMLReporter';

// Re-export for convenience
export { analyzeBestPractices } from './bestPractices';
export { analyzeAccessibility } from './accessibility';
export { analyzeMaintenanceIssues } from './maintenance';