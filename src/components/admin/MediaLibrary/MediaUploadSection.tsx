import React from 'react';
import { SecureMediaUploader } from '../SecureMediaUploader';
import { useMediaUpload } from '../../../hooks/media';
import { useToast } from '../../../hooks/useToast';

interface MediaUploadSectionProps {
  onUploadComplete: (urls: string[]) => void;
}

export const MediaUploadSection: React.FC<MediaUploadSectionProps> = ({
  onUploadComplete,
}) => {
  const { uploadMultiple, uploadProgress } = useMediaUpload();
  const { addToast } = useToast();

  const handleUpload = async (files: File[]) => {
    try {
      const urls = await uploadMultiple(files);
      onUploadComplete(urls);
    } catch (error) {
      addToast('Failed to upload files', 'error');
    }
  };

  return (
    <SecureMediaUploader
      onUploadComplete={handleUpload}
      uploadProgress={uploadProgress}
    />
  );
};