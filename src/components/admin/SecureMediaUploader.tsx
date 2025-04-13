import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, X, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useSecureUpload } from '../../hooks/useSecureUpload';
import { useToast } from '../../hooks/useToast';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, MAX_FILES } from '../../lib/fileValidation';

interface SecureMediaUploaderProps {
  onUploadComplete?: (urls: string[]) => void;
  maxFiles?: number;
  maxSize?: number;
}

export const SecureMediaUploader: React.FC<SecureMediaUploaderProps> = ({
  onUploadComplete,
  maxFiles = MAX_FILES,
  maxSize = MAX_FILE_SIZE,
}) => {
  const { uploadMultiple, uploadProgress } = useSecureUpload();
  const { addToast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const urls = await uploadMultiple(acceptedFiles);
      onUploadComplete?.(urls);
      addToast('Files uploaded successfully!', 'success');
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to upload files', 'error');
    }
  }, [uploadMultiple, onUploadComplete, addToast]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ALLOWED_FILE_TYPES,
    maxFiles,
    maxSize,
    validator: (file) => {
      // Additional custom validation if needed
      return null;
    },
  });

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className={`
          p-8 text-center cursor-pointer border-2 border-dashed
          transition-colors duration-200
          ${isDragActive ? 'border-purple-500 bg-purple-50/5' : 'border-gray-700'}
          ${isDragReject ? 'border-red-500 bg-red-50/5' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-400">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop files here, or click to select files'}
        </p>
        <div className="mt-4 text-sm text-gray-500">
          <p>Allowed types: {Object.values(ALLOWED_FILE_TYPES).flat().join(', ')}</p>
          <p>Maximum file size: {maxSize / 1024 / 1024}MB</p>
          <p>Maximum files: {maxFiles}</p>
        </div>
      </Card>

      {Object.entries(uploadProgress).map(([fileId, { progress, error }]) => (
        <Card key={fileId} className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">{fileId}</span>
                <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${error ? 'bg-red-500' : 'bg-purple-500'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 mt-2 text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};