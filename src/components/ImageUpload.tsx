import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../hooks/useToast';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onClear,
}) => {
  const { addToast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file.type.startsWith('image/')) {
      addToast('Please select an image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      addToast('Image must be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [onChange, addToast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={value}
            alt="Upload preview"
            className="w-full h-full object-contain"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 p-1 bg-white/80 dark:bg-black/80 rounded-full hover:bg-white dark:hover:bg-gray-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <motion.div
          {...getRootProps()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            flex flex-col items-center justify-center w-full aspect-square
            border-2 border-dashed rounded-lg cursor-pointer
            transition-colors duration-200
            ${isDragActive
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-300 dark:border-gray-700 hover:border-purple-500'
            }
          `}
        >
          <input {...getInputProps()} />
          <Upload className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isDragActive
              ? 'Drop the image here'
              : 'Drag & drop an image, or click to select'
          }
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Max size: 5MB
          </p>
        </motion.div>
      )}
    </div>
  );
};