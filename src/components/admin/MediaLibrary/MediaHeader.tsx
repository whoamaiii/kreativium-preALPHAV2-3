import React from 'react';
import { FolderPlus } from 'lucide-react';
import { Button } from '../../ui/Button';

interface MediaHeaderProps {
  onCreateFolder: () => void;
}

export const MediaHeader: React.FC<MediaHeaderProps> = ({ onCreateFolder }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Media Library</h1>
        <p className="text-gray-400">Manage your images and media files</p>
      </div>
      <Button onClick={onCreateFolder}>
        <FolderPlus className="w-5 h-5 mr-2" />
        New Folder
      </Button>
    </div>
  );
};