import React from 'react';
import { Trophy, Clock, Zap } from 'lucide-react';
import { Card } from './ui/Card';

interface GameStatsProps {
  score: number;
  moves: number;
  streak: number;
}

export const GameStats: React.FC<GameStatsProps> = ({
  score,
  moves,
  streak,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <Card className="p-4 text-center">
        <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
        <p className="text-sm text-gray-400">Score</p>
        <p className="text-2xl font-bold text-white">{score}</p>
      </Card>

      <Card className="p-4 text-center">
        <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
        <p className="text-sm text-gray-400">Moves</p>
        <p className="text-2xl font-bold text-white">{moves}</p>
      </Card>

      <Card className="p-4 text-center">
        <Zap className="w-6 h-6 text-orange-500 mx-auto mb-2" />
        <p className="text-sm text-gray-400">Streak</p>
        <p className="text-2xl font-bold text-white">{streak}</p>
      </Card>
    </div>
  );
};