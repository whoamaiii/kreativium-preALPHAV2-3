import { FILE_TYPE_ICONS } from '../constants/media';
import type { MediaFile } from '../../types/media';

export function getFileTypeIcon(file: MediaFile): keyof typeof FILE_TYPE_ICONS {
  return FILE_TYPE_ICONS[file.type as keyof typeof FILE_TYPE_ICONS] || 'file';
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