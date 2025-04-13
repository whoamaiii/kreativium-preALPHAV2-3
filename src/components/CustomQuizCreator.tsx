import React, { useState } from 'react';
import { Upload, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Card } from './Card';
import { useToast } from '../hooks/useToast';
import { Question } from '../types';

interface CustomQuizCreatorProps {
  onSave: (question: Question) => void;
  onClose: () => void;
}

export const CustomQuizCreator: React.FC<CustomQuizCreatorProps> = ({ onSave, onClose }) => {
  const [text, setText] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [hint, setHint] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Vennligst velg en bildefil', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      addToast('Bildet må være mindre enn 5MB', 'error');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile || !text || !correctAnswer) {
      addToast('Vennligst fyll ut alle påkrevde felt', 'error');
      return;
    }

    try {
      // In a real app, you'd upload the image to a server and get a URL back
      // For now, we'll use the data URL
      const newQuestion: Question = {
        id: Date.now(),
        category: 'custom',
        text,
        imageUrl: imagePreview!,
        correctAnswer,
        hint: hint || undefined,
      };

      onSave(newQuestion);
      addToast('Spørsmål lagt til!', 'success');
      onClose();
    } catch (error) {
      addToast('Kunne ikke lagre spørsmålet', 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <Card className="max-w-2xl w-full dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold dark:text-white">Lag nytt spørsmål</h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              type="button"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bilde (påkrevd)
            </label>
            <div className="relative">
              {imagePreview ? (
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Klikk for å laste opp bilde
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Spørsmål (påkrevd)
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="F.eks.: Hvilket tegn vises i bildet?"
              required
            />
          </div>

          {/* Correct Answer */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Riktig svar (påkrevd)
            </label>
            <input
              type="text"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="F.eks.: hund"
              required
            />
          </div>

          {/* Hint */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hint (valgfritt)
            </label>
            <input
              type="text"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="F.eks.: Et kjæledyr som liker å gå tur"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
            >
              Avbryt
            </Button>
            <Button type="submit">
              Lagre spørsmål
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};