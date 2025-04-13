import { MediaFile } from '../../types/media';
import { FILE_TYPE_ICONS, FILE_SIZE_UNITS } from '../constants/media';

export function getFileTypeIcon(file: MediaFile): keyof typeof FILE_TYPE_ICONS {
  return FILE_TYPE_ICONS[file.type as keyof typeof FILE_TYPE_ICONS] || 'file';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${FILE_SIZE_UNITS[i]}`;
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export async function generateThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Not an image file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function isImageFile(file: File | MediaFile): boolean {
  return file.type.startsWith('image/');
}

export function isVideoFile(file: File | MediaFile): boolean {
  return file.type.startsWith('video/');
}

export function isAudioFile(file: File | MediaFile): boolean {
  return file.type.startsWith('audio/');
}

export function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9-_. ]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

export function calculateAspectRatio(width: number, height: number): number {
  return Math.round((width / height) * 100) / 100;
}

export function generateFileId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2)}`;
}