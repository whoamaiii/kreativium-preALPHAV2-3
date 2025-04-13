import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { FileValidator, MAX_FILE_SIZE, MAX_FILES } from '../lib/fileValidation';
import { useToast } from './useToast';

interface UploadProgress {
  progress: number;
  url: string | null;
  error: string | null;
}

export function useSecureUpload() {
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgress>>({});
  const { addToast } = useToast();

  const validateAndUploadFile = async (file: File, path: string = 'media'): Promise<string> => {
    // Step 1: Basic validation
    const validationResult = FileValidator.validateFile(file);
    if (!validationResult.isValid) {
      addToast(validationResult.error!, 'error');
      throw new Error(validationResult.error);
    }

    // Step 2: Content validation
    const contentValidation = await FileValidator.validateFileContent(file);
    if (!contentValidation.isValid) {
      addToast(contentValidation.error!, 'error');
      throw new Error(contentValidation.error);
    }

    // Step 3: Malware scanning
    const scanResult = await FileValidator.scanFile(file);
    if (!scanResult.isClean) {
      addToast('File failed security scan', 'error');
      throw new Error(scanResult.error);
    }

    // Step 4: Upload file
    const fileId = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `${path}/${fileId}`);
    
    setUploadProgress(prev => ({
      ...prev,
      [fileId]: { progress: 0, url: null, error: null }
    }));

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file, {
        customMetadata: {
          uploadedBy: auth.currentUser?.uid || 'anonymous',
          originalName: file.name,
          contentType: file.type,
        },
      });

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

  const validateAndUploadMultiple = async (files: File[], path: string = 'media'): Promise<string[]> => {
    // Validate total number of files
    if (files.length > MAX_FILES) {
      addToast(`Maximum ${MAX_FILES} files allowed`, 'error');
      throw new Error(`Maximum ${MAX_FILES} files allowed`);
    }

    // Validate total size
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_FILES * MAX_FILE_SIZE) {
      addToast('Total file size exceeds limit', 'error');
      throw new Error('Total file size exceeds limit');
    }

    const uploadPromises = files.map(file => validateAndUploadFile(file, path));
    return Promise.all(uploadPromises);
  };

  return {
    uploadFile: validateAndUploadFile,
    uploadMultiple: validateAndUploadMultiple,
    uploadProgress
  };
}