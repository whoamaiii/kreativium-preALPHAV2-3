import React, { useCallback, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Download, ExternalLink } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LazyImage } from '../ui/LazyImage';
import { MediaFile } from '../../types';
import { errorTracker } from '../../lib/errorTracking';
import { useInView } from 'react-hook-inview';
import { useMediaDownload } from '../../hooks/media';

interface MediaGridProps {
  files: MediaFile[];
  onDelete: (id: string) => void;
  onSelect?: (file: MediaFile) => void;
  selectable?: boolean;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  files,
  onDelete,
  onSelect,
  selectable = false,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [inViewRef, inView] = useInView({
    threshold: 0.5,
    unobserveOnEnter: false,
  });
  const resizeObserverRef = useRef<ResizeObserver>();
  const { downloadFile } = useMediaDownload();

  const calculateGridDimensions = useCallback((width: number) => {
    const minColumnWidth = 250;
    const columns = Math.max(1, Math.floor(width / minColumnWidth));
    const columnWidth = width / columns;
    const rowHeight = columnWidth;
    return { columns, columnWidth, rowHeight };
  }, []);

  const { columns, columnWidth, rowHeight } = React.useMemo(() => {
    return calculateGridDimensions(parentRef.current?.offsetWidth || 1200);
  }, [calculateGridDimensions, parentRef.current?.offsetWidth]);

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(files.length / columns),
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 3,
  });

  const handleDelete = useCallback(async (id: string) => {
    try {
      await onDelete(id);
    } catch (error) {
      errorTracker.captureException(error, {
        action: 'delete_media_file',
        metadata: { fileId: id },
      });
    }
  }, [onDelete]);

  useEffect(() => {
    if (!parentRef.current) return;

    const element = parentRef.current;
    resizeObserverRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        const { columns: newColumns } = calculateGridDimensions(width);
        if (newColumns !== columns) {
          rowVirtualizer.measure();
        }
      }
    });

    resizeObserverRef.current.observe(element);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.unobserve(element);
        resizeObserverRef.current.disconnect();
      }
    };
  }, [calculateGridDimensions, columns, rowVirtualizer]);

  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [files]);

  return (
    <div
      ref={parentRef}
      className="h-[calc(100vh-16rem)] overflow-auto"
      style={{
        contain: 'strict',
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        <AnimatePresence>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const rowStart = virtualRow.index * columns;
            const rowEnd = Math.min(rowStart + columns, files.length);
            const rowFiles = files.slice(rowStart, rowEnd);

            return (
              <motion.div
                key={virtualRow.index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: rowHeight,
                  transform: `translateY(${virtualRow.start}px)`,
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  gap: '1rem',
                }}
              >
                {rowFiles.map((file) => (
                  <Card
                    key={file.id}
                    className="group relative"
                    onClick={() => selectable && onSelect?.(file)}
                  >
                    <LazyImage
                      src={file.url}
                      alt={file.name}
                      aspectRatio="square"
                      className="rounded-t-lg"
                    />
                    
                    <div className="p-3">
                      <p className="text-sm truncate dark:text-white">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(file.createdAt).toLocaleDateString()}
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
                          downloadFile(file);
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
                          handleDelete(file.id);
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
                ))}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div ref={inViewRef} className="h-8" />
    </div>
  );
};