import { useState, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { useToast } from '../useToast';
import { errorTracker } from '../../lib/errorTracking';
import { FileValidator } from '../../lib/fileValidation';

interface UploadProgress {
  progress: number;
  url: string | null;
  error: string | null;
}

export function useMediaUpload() {
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgress>>({});
  const { addToast } = useToast();

  const uploadFile = useCallback(async (file: File, path: string = 'media'): Promise<string> => {
    // Step 1: Validate file
    const validationResult = await FileValidator.validateAndScanFile(file);
    if (!validationResult.isValid) {
      addToast(validationResult.error!, 'error');
      throw new Error(validationResult.error);
    }

    const fileId = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `${path}/${fileId}`);
    
    setUploadProgress(prev => ({
      ...prev,
      [fileId]: { progress: 0, url: null, error: null }
    }));

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: { ...prev[fileId], progress }
          }));
        },
        (error) => {
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: { ...prev[fileId], error: error.message }
          }));
          errorTracker.captureException(error, {
            action: 'upload_media_file',
            metadata: { fileName: file.name, fileSize: file.size }
          });
          addToast('Failed to upload file', 'error');
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setUploadProgress(prev => ({
              ...prev,
              [fileId]: { ...prev[fileId], url }
            }));
            resolve(url);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }, [addToast]);

  const uploadMultiple = useCallback(async (files: File[], path: string = 'media'): Promise<string[]> => {
    try {
      const uploadPromises = files.map(file => uploadFile(file, path));
      const urls = await Promise.all(uploadPromises);
      addToast(`Successfully uploaded ${files.length} files`, 'success');
      return urls;
    } catch (error) {
      errorTracker.captureException(error, {
        action: 'upload_multiple_files',
        metadata: { fileCount: files.length }
      });
      throw error;
    }
  }, [uploadFile, addToast]);

  return {
    uploadFile,
    uploadMultiple,
    uploadProgress,
  };
}