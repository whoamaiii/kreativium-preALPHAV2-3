import { useState, useCallback } from 'react';
import { MediaFile } from '../types';

interface UseMediaGridOptions {
  initialPageSize?: number;
  sortField?: keyof MediaFile;
  sortDirection?: 'asc' | 'desc';
}

export function useMediaGrid(files: MediaFile[], options: UseMediaGridOptions = {}) {
  const {
    initialPageSize = 20,
    sortField = 'createdAt',
    sortDirection = 'desc',
  } = options;

  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSort, setCurrentSort] = useState({
    field: sortField,
    direction: sortDirection,
  });

  const filteredFiles = useCallback(() => {
    let result = [...files];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(file => 
        file.name.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[currentSort.field];
      const bValue = b[currentSort.field];
      const modifier = currentSort.direction === 'asc' ? 1 : -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * modifier;
      }

      return ((aValue as any) - (bValue as any)) * modifier;
    });

    return result;
  }, [files, searchTerm, currentSort]);

  const loadMore = useCallback(() => {
    setPageSize(prev => prev + initialPageSize);
  }, [initialPageSize]);

  const toggleSort = useCallback((field: keyof MediaFile) => {
    setCurrentSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  return {
    displayedFiles: filteredFiles().slice(0, pageSize),
    totalFiles: filteredFiles().length,
    hasMore: pageSize < filteredFiles().length,
    searchTerm,
    setSearchTerm,
    currentSort,
    toggleSort,
    loadMore,
  };
}