import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, setDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { MediaFile } from '../types/media';
import { useToast } from './useToast';
import { getTypedCollection } from '../lib/firebase/utils';
import { convertToMediaFiles } from '../utils/typeConverters';

export function useMediaData(folderId?: string | null) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  // Fetch media files with caching
  const {
    data: files,
    isLoading,
    error,
  } = useQuery<MediaFile[]>({
    queryKey: ['media', folderId],
    queryFn: async () => {
      try {
        const constraints = [];
        
        if (folderId !== undefined) {
          constraints.push(where('folderId', '==', folderId));
        }
        
        constraints.push(orderBy('createdAt', 'desc'));
        
        return getTypedCollection<MediaFile>('media', constraints);
      } catch (error) {
        console.error('Error fetching media files:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Cache persists for 30 minutes
  });

  // Upload file mutation
  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, folderId }: { file: File; folderId?: string }) => {
      const fileRef = ref(storage, `media/${Date.now()}-${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      const docRef = doc(db, 'media');
      await setDoc(docRef, {
        name: file.name,
        url,
        type: file.type,
        size: file.size,
        folderId: folderId || null,
        createdAt: new Date().toISOString(),
      });

      return docRef.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      addToast('File uploaded successfully', 'success');
    },
    onError: () => {
      addToast('Failed to upload file', 'error');
    },
  });

  // Delete file mutation
  const deleteFileMutation = useMutation({
    mutationFn: async (file: MediaFile) => {
      // Delete from storage
      const fileRef = ref(storage, file.url);
      await deleteObject(fileRef);

      // Delete from Firestore
      const docRef = doc(db, 'media', file.id);
      await deleteDoc(docRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      addToast('File deleted successfully', 'success');
    },
    onError: () => {
      addToast('Failed to delete file', 'error');
    },
  });

  return {
    files,
    isLoading,
    error,
    uploadFile: uploadFileMutation.mutate,
    deleteFile: deleteFileMutation.mutate,
    isUploading: uploadFileMutation.isPending,
    isDeleting: deleteFileMutation.isPending,
  };
}