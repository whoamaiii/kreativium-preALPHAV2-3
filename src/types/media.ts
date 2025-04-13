import { z } from 'zod';

export const MediaFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url(),
  type: z.string(),
  size: z.number().positive(),
  folderId: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  metadata: z.object({
    uploadedBy: z.string(),
    originalName: z.string(),
    contentType: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
    duration: z.number().optional(),
  }).optional(),
});

export const MediaFolderSchema = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  metadata: z.object({
    createdBy: z.string(),
    itemCount: z.number(),
    totalSize: z.number(),
  }).optional(),
});

export const MediaUploadProgressSchema = z.object({
  progress: z.number().min(0).max(100),
  url: z.string().url().nullable(),
  error: z.string().nullable(),
});

export type MediaFile = z.infer<typeof MediaFileSchema>;
export type MediaFolder = z.infer<typeof MediaFolderSchema>;
export type MediaUploadProgress = z.infer<typeof MediaUploadProgressSchema>;

export interface MediaGridConfig {
  columnWidth: number;
  minColumns: number;
  maxColumns: number;
  gap: number;
  aspectRatio: number;
}

export interface MediaSortConfig {
  field: keyof MediaFile;
  direction: 'asc' | 'desc';
}

export interface MediaFilterConfig {
  searchTerm: string;
  types: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  minSize?: number;
  maxSize?: number;
}

export interface MediaPaginationConfig {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export type MediaViewMode = 'grid' | 'list';

export interface MediaSelectionConfig {
  selectedIds: Set<string>;
  maxSelection?: number;
  onSelect?: (file: MediaFile) => void;
  onDeselect?: (file: MediaFile) => void;
  onSelectionChange?: (selectedFiles: MediaFile[]) => void;
}

export interface MediaUploadConfig {
  maxFiles: number;
  maxSize: number;
  allowedTypes: string[];
  path: string;
  metadata?: Record<string, any>;
}

export interface MediaDownloadConfig {
  forceDownload?: boolean;
  renameFile?: boolean;
  customFileName?: string;
}