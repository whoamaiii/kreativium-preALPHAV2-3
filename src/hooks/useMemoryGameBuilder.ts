import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MemoryGame } from '../types';
import { useToast } from './useToast';

export function useMemoryGameBuilder() {
  const [games, setGames] = useState<MemoryGame[]>([]);
  const { addToast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'memoryGames'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newGames = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MemoryGame[];
      setGames(newGames);
    });

    return () => unsubscribe();
  }, []);

  const addGame = async (game: Omit<MemoryGame, 'id'>) => {
    try {
      await addDoc(collection(db, 'memoryGames'), {
        ...game,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      addToast('Failed to create memory game', 'error');
      throw error;
    }
  };

  const updateGame = async (game: MemoryGame) => {
    try {
      const gameRef = doc(db, 'memoryGames', game.id);
      await updateDoc(gameRef, {
        ...game,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      addToast('Failed to update memory game', 'error');
      throw error;
    }
  };

  const deleteGame = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'memoryGames', id));
      addToast('Memory game deleted successfully', 'success');
    } catch (error) {
      addToast('Failed to delete memory game', 'error');
      throw error;
    }
  };

  const exportGames = () => {
    try {
      const data = {
        games,
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `memory_games_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast('Memory games exported successfully', 'success');
    } catch (error) {
      addToast('Failed to export memory games', 'error');
      throw error;
    }
  };

  const importGames = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data.games)) {
        throw new Error('Invalid file format');
      }

      const importPromises = data.games.map((game: Omit<MemoryGame, 'id'>) =>
        addDoc(collection(db, 'memoryGames'), {
          ...game,
          createdAt: new Date().toISOString(),
        })
      );

      await Promise.all(importPromises);
      addToast('Memory games imported successfully', 'success');
    } catch (error) {
      addToast('Failed to import memory games', 'error');
      throw error;
    }
  };

  return {
    games,
    addGame,
    updateGame,
    deleteGame,
    exportGames,
    importGames,
  };
}