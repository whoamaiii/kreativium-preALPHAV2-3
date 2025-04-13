import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import confetti from 'canvas-confetti';

interface GameCompleteProps {
  score: number;
  moves: number;
  onRestart: () => void;
  onExit: () => void;
}

export const GameComplete: React.FC<GameCompleteProps> = ({
  score,
  moves,
  onRestart,
  onExit,
}) => {
  React.useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      <Card className="p-8 text-center">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Game Complete! 🎉</h2>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-center gap-4">
            <div>
              <p className="text-sm text-gray-400">Score</p>
              <p className="text-3xl font-bold text-white">{score}</p>
            </div>
            <div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Moves</p>
              <p className="text-3xl font-bold text-white">{moves}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button onClick={onRestart}>
            Play Again
          </Button>
          <Button variant="secondary" onClick={onExit}>
            Back to Menu
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};