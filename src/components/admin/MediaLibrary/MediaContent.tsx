import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../ui/Card';
import { SecureMediaUploader } from '../SecureMediaUploader';
import { MediaGrid } from '../MediaGrid';
import { MediaToolbar } from '../MediaToolbar';
import { MediaFile } from '../../../types';

interface MediaContentProps {
  files: MediaFile[];
  isLoading: boolean;
  view: 'grid' | 'list';
  sortOrder: 'asc' | 'desc';
  searchTerm: string;
  onViewChange: (view: 'grid' | 'list') => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  onSearchChange: (term: string) => void;
  onUploadComplete: (urls: string[]) => void;
  onDeleteFile: (id: string) => void;
}

export const MediaContent: React.FC<MediaContentProps> = ({
  files,
  isLoading,
  view,
  sortOrder,
  searchTerm,
  onViewChange,
  onSortOrderChange,
  onSearchChange,
  onUploadComplete,
  onDeleteFile,
}) => {
  return (
    <div className="lg:col-span-3 space-y-6">
      <SecureMediaUploader onUploadComplete={onUploadComplete} />

      <MediaToolbar
        view={view}
        onViewChange={onViewChange}
        sortOrder={sortOrder}
        onSortOrderChange={onSortOrderChange}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        >
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="aspect-square animate-pulse" />
          ))}
        </motion.div>
      ) : (
        <MediaGrid
          files={files}
          view={view}
          onDelete={onDeleteFile}
        />
      )}
    </div>
  );
};