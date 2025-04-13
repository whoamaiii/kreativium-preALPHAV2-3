import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { MediaFile } from '../../types';
import { useToast } from '../useToast';
import { errorTracker } from '../../lib/errorTracking';

export function useMediaData(folderId?: string | null) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const {
    data: files,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['media', folderId],
    queryFn: async () => {
      try {
        let q = collection(db, 'media');
        
        if (folderId !== undefined) {
          q = query(q, where('folderId', '==', folderId));
        }
        
        q = query(q, orderBy('createdAt', 'desc'));
        
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MediaFile[];
      } catch (error) {
        errorTracker.captureException(error, {
          action: 'fetch_media_files',
          metadata: { folderId }
        });
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (file: MediaFile) => {
      try {
        // Delete from storage
        const fileRef = ref(storage, file.url);
        await deleteObject(fileRef);

        // Delete from Firestore
        const docRef = doc(db, 'media', file.id);
        await deleteDoc(docRef);
      } catch (error) {
        errorTracker.captureException(error, {
          action: 'delete_media_file',
          metadata: { fileId: file.id }
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      addToast('File deleted successfully', 'success');
    },
    onError: () => {
      addToast('Failed to delete file', 'error');
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: async (name: string) => {
      try {
        const docRef = doc(collection(db, 'mediaFolders'));
        await setDoc(docRef, {
          name,
          createdAt: new Date().toISOString(),
        });
        return docRef.id;
      } catch (error) {
        errorTracker.captureException(error, {
          action: 'create_media_folder',
          metadata: { folderName: name }
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaFolders'] });
      addToast('Folder created successfully', 'success');
    },
    onError: () => {
      addToast('Failed to create folder', 'error');
    },
  });

  return {
    files,
    isLoading,
    error,
    deleteFile: deleteFileMutation.mutate,
    createFolder: createFolderMutation.mutate,
    isDeleting: deleteFileMutation.isPending,
    isCreatingFolder: createFolderMutation.isPending,
  };
}