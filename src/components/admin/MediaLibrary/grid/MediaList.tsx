import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Download, ExternalLink, FileIcon } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { MediaFile } from '../../../../types';
import { formatFileSize } from '../../../../utils/mediaHelpers';

interface MediaListProps {
  files: MediaFile[];
  onDelete: (id: string) => void;
  onDownload: (file: MediaFile) => void;
  onSelect?: (file: MediaFile) => void;
  selectable?: boolean;
}

export const MediaList: React.FC<MediaListProps> = ({
  files,
  onDelete,
  onDownload,
  onSelect,
  selectable = false,
}) => {
  return (
    <div className="space-y-2">
      {files.map((file) => (
        <motion.div
          key={file.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`
            flex items-center gap-4 p-4 bg-gray-900/50 backdrop-blur-sm rounded-lg
            ${selectable ? 'cursor-pointer hover:bg-gray-800/50' : ''}
          `}
          onClick={() => selectable && onSelect?.(file)}
        >
          <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
            <FileIcon className="w-6 h-6 text-gray-400" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{file.name}</p>
            <p className="text-xs text-gray-400">
              {formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(file.url, '_blank');
              }}
              className="text-gray-400 hover:text-white"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(file);
              }}
              className="text-gray-400 hover:text-white"
            >
              <Download className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(file.id);
              }}
              className="text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};