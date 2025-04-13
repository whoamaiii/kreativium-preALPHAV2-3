import React from 'react';
import { Trophy, Clock, Zap } from 'lucide-react';
import { Card } from './ui/Card';

interface MemoryStatsProps {
  moves: number;
  pairs: number;
  totalPairs: number;
  time: number;
}

export const MemoryStats: React.FC<MemoryStatsProps> = ({
  moves,
  pairs,
  totalPairs,
  time,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <Card className="p-4 text-center">
        <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
        <p className="text-sm text-gray-400">Pairs Found</p>
        <p className="text-2xl font-bold text-white">{pairs}/{totalPairs}</p>
      </Card>

      <Card className="p-4 text-center">
        <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
        <p className="text-sm text-gray-400">Time</p>
        <p className="text-2xl font-bold text-white">
          {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
        </p>
      </Card>

      <Card className="p-4 text-center">
        <Zap className="w-6 h-6 text-orange-500 mx-auto mb-2" />
        <p className="text-sm text-gray-400">Moves</p>
        <p className="text-2xl font-bold text-white">{moves}</p>
      </Card>
    </div>
  );
};