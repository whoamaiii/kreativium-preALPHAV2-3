import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Download, ExternalLink } from 'lucide-react';
import { Card } from '../../../ui/Card';
import { Button } from '../../../ui/Button';
import { LazyImage } from '../../../ui/LazyImage';
import { MediaFile } from '../../../../types';
import { formatFileSize } from '../../../../utils/mediaHelpers';

interface MediaCardProps {
  file: MediaFile;
  onDelete: (id: string) => void;
  onDownload: (file: MediaFile) => void;
  onSelect?: (file: MediaFile) => void;
  selectable?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  file,
  onDelete,
  onDownload,
  onSelect,
  selectable = false,
}) => {
  return (
    <Card className="group relative">
      <LazyImage
        src={file.url}
        alt={file.name}
        aspectRatio="square"
        className="rounded-t-lg"
      />
      
      <div className="p-3">
        <p className="text-sm truncate dark:text-white">{file.name}</p>
        <p className="text-xs text-gray-500">
          {formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            window.open(file.url, '_blank');
          }}
          className="bg-black/50 hover:bg-black/70"
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDownload(file);
          }}
          className="bg-black/50 hover:bg-black/70"
        >
          <Download className="w-4 h-4" />
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(file.id);
          }}
          className="bg-black/50 hover:bg-red-500/70"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {selectable && (
        <button
          onClick={() => onSelect?.(file)}
          className="absolute inset-0 bg-purple-500/0 hover:bg-purple-500/20 transition-colors"
        />
      )}
    </Card>
  );
};