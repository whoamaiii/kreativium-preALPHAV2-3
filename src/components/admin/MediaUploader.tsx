import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useUpload } from '../../hooks/useUpload';
import { useToast } from '../../hooks/useToast';

interface MediaUploaderProps {
  onUploadComplete?: (urls: string[]) => void;
  maxFiles?: number;
  maxSize?: number;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUploadComplete,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB
}) => {
  const { uploadMultipleFiles, uploadProgress } = useUpload();
  const { addToast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const urls = await uploadMultipleFiles(acceptedFiles);
      onUploadComplete?.(urls);
      addToast('Files uploaded successfully!', 'success');
    } catch (error) {
      addToast('Failed to upload files', 'error');
    }
  }, [uploadMultipleFiles, onUploadComplete, addToast]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles,
    maxSize,
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
        <p className="text-sm text-gray-500 mt-2">
          Maximum file size: {maxSize / 1024 / 1024}MB
        </p>
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
                  className="h-full bg-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
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