import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { questions } from '../data/questions';
import { Sign } from '../types/dictionary';

interface UseDictionaryOptions {
  initialCategory?: string;
  initialSearchTerm?: string;
}

export function useDictionary(options: UseDictionaryOptions = {}) {
  const [searchTerm, setSearchTerm] = useState(options.initialSearchTerm || '');
  const [selectedCategory, setSelectedCategory] = useState(options.initialCategory || 'all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { data: signs, isLoading } = useQuery({
    queryKey: ['dictionary', selectedCategory],
    queryFn: async () => {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      return questions.map(q => ({
        id: q.id,
        word: q.correctAnswer,
        category: q.category,
        imageUrl: q.imageUrl,
        description: q.text,
        example: q.hint,
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filteredSigns = useCallback(
    (signs: Sign[] = []) => {
      return signs
        .filter(
          sign =>
            (selectedCategory === 'all' || sign.category === selectedCategory) &&
            (sign.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
             sign.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
          const comparison = a.word.localeCompare(b.word);
          return sortOrder === 'asc' ? comparison : -comparison;
        });
    },
    [selectedCategory, searchTerm, sortOrder]
  );

  return {
    signs: filteredSigns(signs),
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortOrder,
    setSortOrder,
  };
}