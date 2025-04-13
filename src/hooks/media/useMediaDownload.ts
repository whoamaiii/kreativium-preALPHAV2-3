import { useCallback } from 'react';
import { MediaFile } from '../../types';
import { useToast } from '../useToast';
import { errorTracker } from '../../lib/errorTracking';

export function useMediaDownload() {
  const { addToast } = useToast();

  const downloadFile = useCallback(async (file: MediaFile) => {
    try {
      const response = await fetch(file.url);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      addToast('File downloaded successfully', 'success');
    } catch (error) {
      errorTracker.captureException(error, {
        action: 'download_media_file',
        metadata: { fileId: file.id, fileName: file.name },
      });
      addToast('Failed to download file', 'error');
    }
  }, [addToast]);

  return { downloadFile };
}