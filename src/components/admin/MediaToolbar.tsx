import React from 'react';
import { Grid, List, SortAsc, SortDesc, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { FormInput } from '../Form/FormInput';

interface MediaToolbarProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const MediaToolbar: React.FC<MediaToolbarProps> = ({
  view,
  onViewChange,
  sortOrder,
  onSortOrderChange,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
      <div className="flex-1 max-w-md">
        <FormInput
          name="search"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? (
            <SortAsc className="w-4 h-4" />
          ) : (
            <SortDesc className="w-4 h-4" />
          )}
        </Button>

        <div className="border-l border-gray-700 mx-2" />

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onViewChange('grid')}
          className={view === 'grid' ? 'bg-purple-500/20 text-purple-400' : ''}
        >
          <Grid className="w-4 h-4" />
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onViewChange('list')}
          className={view === 'list' ? 'bg-purple-500/20 text-purple-400' : ''}
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};