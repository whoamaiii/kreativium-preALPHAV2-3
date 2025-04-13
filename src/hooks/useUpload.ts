import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { useToast } from './useToast';

interface UploadProgress {
  progress: number;
  url: string | null;
  error: string | null;
}

export function useUpload() {
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgress>>({});
  const { addToast } = useToast();

  const uploadFile = async (file: File, path: string = 'media'): Promise<string> => {
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
  };

  const uploadMultipleFiles = async (files: File[], path: string = 'media'): Promise<string[]> => {
    const uploadPromises = files.map(file => uploadFile(file, path));
    return Promise.all(uploadPromises);
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    uploadProgress
  };
}