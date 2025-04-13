import React, { useCallback, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaCard } from './MediaCard';
import { MediaList } from './MediaList';
import { MediaFile } from '../../../../types';
import { useInView } from 'react-hook-inview';
import { errorTracker } from '../../../../lib/errorTracking';

interface MediaGridProps {
  files: MediaFile[];
  view: 'grid' | 'list';
  onDelete: (id: string) => void;
  onSelect?: (file: MediaFile) => void;
  selectable?: boolean;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  files,
  view,
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

  const handleDownload = useCallback(async (file: MediaFile) => {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      errorTracker.captureException(error, {
        action: 'download_media_file',
        metadata: { fileId: file.id, fileName: file.name },
      });
    }
  }, []);

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
      resizeObserverRef.current?.disconnect();
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

  if (view === 'list') {
    return (
      <MediaList
        files={files}
        onDelete={handleDelete}
        onDownload={handleDownload}
        onSelect={onSelect}
        selectable={selectable}
      />
    );
  }

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
                  <MediaCard
                    key={file.id}
                    file={file}
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                    onSelect={onSelect}
                    selectable={selectable}
                  />
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