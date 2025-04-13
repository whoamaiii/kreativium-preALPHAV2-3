import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Grid } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MemoryGame } from '../../types';

interface MemoryGameListProps {
  games: MemoryGame[];
  onEdit: (game: MemoryGame) => void;
  onDelete: (id: string) => void;
}

export const MemoryGameList: React.FC<MemoryGameListProps> = ({
  games,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <motion.div
          key={game.id}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <Card className="h-full flex flex-col dark:bg-gray-800">
            <div className="p-4 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Grid className="w-6 h-6 text-purple-500" />
                <h3 className="text-lg font-semibold dark:text-white">
                  {game.title}
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {game.description}
              </p>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {game.cardPairs.length} pairs
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {game.difficulty}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(game)}
                  className="flex-1"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onDelete(game.id)}
                  className="flex-1 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};