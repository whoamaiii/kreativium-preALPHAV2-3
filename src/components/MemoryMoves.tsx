import React from 'react';
import { useTranslation } from 'react-i18next';

interface MemoryMovesProps {
  moves: number;
}

export const MemoryMoves: React.FC<MemoryMovesProps> = ({ moves }) => {
  const { t } = useTranslation();

  return (
    <div className="text-center md:text-left">
      <h3 className="text-lg font-bold">{t('memory.moves')}</h3>
      <p className="text-2xl">{moves}</p>
    </div>
  );
};
