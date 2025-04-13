export const ALLOWED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
} as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILES = 10;

export const FILE_TYPE_ICONS = {
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/webp': 'image',
  'video/mp4': 'video',
  'video/webm': 'video',
  'audio/mp3': 'audio',
  'audio/wav': 'audio',
  'application/pdf': 'file',
} as const;

export const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

export const MEDIA_GRID_CONFIG = {
  MIN_COLUMN_WIDTH: 250,
  GAP: 16,
  OVERSCAN: 3,
  INITIAL_PAGE_SIZE: 20,
  LOAD_MORE_THRESHOLD: 0.8,
};

export const UPLOAD_CONFIG = {
  CHUNK_SIZE: 256 * 1024, // 256KB chunks
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  CONCURRENT_UPLOADS: 3,
};