import { useQuery } from '@tanstack/react-query';
import { questions } from '../data/questions';
import { Question } from '../types';
import { useToast } from './useToast';

export function useQuestions(categoryId?: string) {
  const { addToast } = useToast();

  return useQuery({
    queryKey: ['questions', categoryId],
    queryFn: async (): Promise<Question[]> => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!categoryId) {
          // If no category ID, flatten all questions into a single array
          return Object.values(questions).flat();
        }

        // Get the questions for the specified category
        const categoryQuestions = questions[categoryId];
        
        if (!categoryQuestions || categoryQuestions.length === 0) {
          throw new Error(`No questions found for category: ${categoryId}`);
        }

        return categoryQuestions;
      } catch (error) {
        addToast(error instanceof Error ? error.message : 'Failed to load questions', 'error');
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry if category doesn't exist
  });
}
