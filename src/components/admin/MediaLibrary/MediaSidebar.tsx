import React from 'react';
import { Card } from '../../ui/Card';
import { FolderTree } from '../FolderTree';
import { MediaFolder } from '../../../types';

interface MediaSidebarProps {
  folders: MediaFolder[];
  selectedFolder: string | null;
  onSelectFolder: (folderId: string | null) => void;
}

export const MediaSidebar: React.FC<MediaSidebarProps> = ({
  folders,
  selectedFolder,
  onSelectFolder,
}) => {
  return (
    <Card className="lg:col-span-1 p-4">
      <FolderTree
        folders={folders}
        selectedFolder={selectedFolder}
        onSelectFolder={onSelectFolder}
      />
    </Card>
  );
};