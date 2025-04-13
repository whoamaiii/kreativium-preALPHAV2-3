import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderPlus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SecureMediaUploader } from '../../components/admin/SecureMediaUploader';
import { MediaGrid } from '../../components/admin/MediaGrid';
import { FolderTree } from '../../components/admin/FolderTree';
import { MediaToolbar } from '../../components/admin/MediaToolbar';
import { useMediaData } from '../../hooks/useMediaData';
import { useToast } from '../../hooks/useToast';

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Media Library</h1>
          <p className="text-gray-400">Manage your images and media files</p>
        </div>
        <Button onClick={handleCreateFolder}>
          <FolderPlus className="w-5 h-5 mr-2" />
          New Folder
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-1 p-4">
          <FolderTree
            folders={folders}
            selectedFolder={selectedFolder}
            onSelectFolder={setSelectedFolder}
          />
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <SecureMediaUploader onUploadComplete={handleUploadComplete} />

          <MediaToolbar
            view={view}
            onViewChange={setView}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
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
              onDelete={deleteFile}
            />
          )}
        </div>
      </div>
    </div>
  );
};