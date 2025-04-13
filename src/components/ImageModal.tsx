import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './ui/Button';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative max-w-4xl w-full bg-white dark:bg-gray-800 rounded-2xl p-2"
        onClick={e => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute -top-4 -right-4 p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg"
        >
          <X className="w-5 h-5" />
        </Button>
        
        <div className="aspect-square w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900">
          <img
            src={imageUrl}
            alt="Sign language sign - enlarged"
            className="w-full h-full object-contain"
          />
        </div>
      </motion.div>
    </div>
  );
};