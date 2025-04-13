import React from 'react';
import { useTranslation } from 'react-i18next';
import { MemoryTimer } from './MemoryTimer';
import { MemoryScore } from './MemoryScore';
import { MemoryMoves } from './MemoryMoves';

interface MemoryHeaderProps {
  pairsFound: number;
  totalPairs: number;
  moves: number;
  timeElapsed: number;
}

export const MemoryHeader: React.FC<MemoryHeaderProps> = ({
  pairsFound,
  totalPairs,
  moves,
  timeElapsed
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg mb-4 w-full">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold text-white">{t('memory.pairsFound')}</h3>
          <p className="text-2xl text-white">
            {pairsFound} / {totalPairs}
          </p>
        </div>
        
        <MemoryMoves moves={moves} />
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center mt-2 md:mt-0">
        <MemoryTimer time={timeElapsed} />
      </div>
    </div>
  );
};
