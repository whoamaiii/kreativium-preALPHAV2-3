import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging class names with Tailwind CSS
 * It combines clsx for conditional classes and tailwind-merge to handle conflicting utility classes
 * @param inputs Class names or conditions to combine
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}