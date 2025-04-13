import React from 'react';
import { Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';
import { MediaFolder } from '../../types';

interface FolderTreeProps {
  folders: MediaFolder[];
  selectedFolder: string | null;
  onSelectFolder: (folderId: string | null) => void;
}

export const FolderTree: React.FC<FolderTreeProps> = ({
  folders,
  selectedFolder,
  onSelectFolder,
}) => {
  return (
    <div className="space-y-1">
      <button
        onClick={() => onSelectFolder(null)}
        className={`
          w-full flex items-center gap-2 px-3 py-2 rounded-lg
          transition-colors duration-200
          ${selectedFolder === null
            ? 'bg-purple-500/20 text-purple-400'
            : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
          }
        `}
      >
        <Folder className="w-4 h-4" />
        <span>All Files</span>
      </button>

      {folders.map((folder) => (
        <button
          key={folder.id}
          onClick={() => onSelectFolder(folder.id)}
          className={`
            w-full flex items-center gap-2 px-3 py-2 rounded-lg
            transition-colors duration-200
            ${selectedFolder === folder.id
              ? 'bg-purple-500/20 text-purple-400'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
            }
          `}
        >
          {selectedFolder === folder.id ? (
            <FolderOpen className="w-4 h-4" />
          ) : (
            <Folder className="w-4 h-4" />
          )}
          <span>{folder.name}</span>
        </button>
      ))}
    </div>
  );
};