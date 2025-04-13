import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { nanoid } from 'nanoid';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  folderId: string | null;
  createdAt: string;
}

interface MediaFolder {
  id: string;
  name: string;
  createdAt: string;
}

export function useMediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);

  useEffect(() => {
    const filesQuery = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    const foldersQuery = query(collection(db, 'mediaFolders'), orderBy('createdAt', 'desc'));

    const unsubFiles = onSnapshot(filesQuery, (snapshot) => {
      const newFiles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MediaFile[];
      setFiles(newFiles);
    });

    const unsubFolders = onSnapshot(foldersQuery, (snapshot) => {
      const newFolders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MediaFolder[];
      setFolders(newFolders);
    });

    return () => {
      unsubFiles();
      unsubFolders();
    };
  }, []);

  const uploadFiles = async (files: File[], folderId: string | null = null) => {
    const uploadPromises = files.map(async (file) => {
      const fileId = nanoid();
      const fileRef = ref(storage, `media/${fileId}-${file.name}`);
      
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'media'), {
        name: file.name,
        url,
        folderId,
        createdAt: new Date().toISOString(),
      });
    });

    await Promise.all(uploadPromises);
  };

  const deleteFile = async (fileId: string) => {
    const fileDoc = doc(db, 'media', fileId);
    const fileData = files.find(f => f.id === fileId);

    if (fileData) {
      const fileRef = ref(storage, fileData.url);
      await deleteObject(fileRef);
      await deleteDoc(fileDoc);
    }
  };

  const createFolder = async (name: string) => {
    await addDoc(collection(db, 'mediaFolders'), {
      name,
      createdAt: new Date().toISOString(),
    });
  };

  return {
    files,
    folders,
    uploadFiles,
    deleteFile,
    createFolder,
  };
}