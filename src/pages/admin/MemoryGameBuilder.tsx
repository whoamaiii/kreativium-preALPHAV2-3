import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings, Download, Upload } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MemoryGameList } from '../../components/admin/MemoryGameList';
import { MemoryGameEditor } from '../../components/admin/MemoryGameEditor';
import { useMemoryGameBuilder } from '../../hooks/useMemoryGameBuilder';
import { useToast } from '../../hooks/useToast';
import { MemoryGame } from '../../types';

export const MemoryGameBuilder: React.FC = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingGame, setEditingGame] = useState<MemoryGame | null>(null);
  const { games, addGame, updateGame, deleteGame, exportGames, importGames } = useMemoryGameBuilder();
  const { addToast } = useToast();

  const handleSave = async (game: MemoryGame) => {
    try {
      if (editingGame) {
        await updateGame(game);
        addToast('Memory game updated successfully!', 'success');
      } else {
        await addGame(game);
        addToast('Memory game created successfully!', 'success');
      }
      setShowEditor(false);
      setEditingGame(null);
    } catch (error) {
      addToast('Failed to save memory game', 'error');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importGames(file);
      addToast('Memory games imported successfully!', 'success');
    } catch (error) {
      addToast('Failed to import memory games', 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Memory Game Builder</h1>
          <p className="text-gray-400">Create and manage memory card games</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setShowEditor(true)}>
            <Plus className="w-5 h-5 mr-2" />
            New Game
          </Button>

          <Button variant="secondary" onClick={exportGames}>
            <Download className="w-5 h-5 mr-2" />
            Export
          </Button>

          <label className="relative">
            <Button variant="secondary" as="div">
              <Upload className="w-5 h-5 mr-2" />
              Import
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {showEditor ? (
        <MemoryGameEditor
          game={editingGame}
          onSave={handleSave}
          onCancel={() => {
            setShowEditor(false);
            setEditingGame(null);
          }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {games.length === 0 ? (
            <Card className="p-8 text-center">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">No Memory Games Yet</h2>
              <p className="text-gray-400 mb-4">
                Get started by creating your first memory game!
              </p>
              <Button onClick={() => setShowEditor(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Create Memory Game
              </Button>
            </Card>
          ) : (
            <MemoryGameList
              games={games}
              onEdit={(game) => {
                setEditingGame(game);
                setShowEditor(true);
              }}
              onDelete={deleteGame}
            />
          )}
        </motion.div>
      )}
    </div>
  );
};