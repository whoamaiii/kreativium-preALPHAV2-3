import React, { useState } from 'react';
import { MediaHeader } from './MediaHeader';
import { MediaSidebar } from './MediaSidebar';
import { MediaContent } from './MediaContent';
import { useMediaData } from '../../../hooks/useMediaData';
import { useToast } from '../../../hooks/useToast';

export const MediaLibrary: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { files, folders, isLoading, createFolder, deleteFile } = useMediaData(selectedFolder);
  const { addToast } = useToast();

  const handleCreateFolder = async () => {
    const name = prompt('Enter folder name:');
    if (name) {
      try {
        await createFolder(name);
        addToast('Folder created successfully!', 'success');
      } catch (error) {
        addToast('Failed to create folder', 'error');
      }
    }
  };

  const handleUploadComplete = (urls: string[]) => {
    addToast(`Successfully uploaded ${urls.length} files`, 'success');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <MediaHeader onCreateFolder={handleCreateFolder} />

      <div className="grid gap-6 lg:grid-cols-4">
        <MediaSidebar
          folders={folders}
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
        />

        <MediaContent
          files={files}
          isLoading={isLoading}
          view={view}
          sortOrder={sortOrder}
          searchTerm={searchTerm}
          onViewChange={setView}
          onSortOrderChange={setSortOrder}
          onSearchChange={setSearchTerm}
          onUploadComplete={handleUploadComplete}
          onDeleteFile={deleteFile}
        />
      </div>
    </div>
  );
};