import React from 'react';
import { useTranslation } from 'react-i18next';

interface MemoryScoreProps {
  score: number;
}

export const MemoryScore: React.FC<MemoryScoreProps> = ({ score }) => {
  const { t } = useTranslation();

  return (
    <div className="text-center md:text-left">
      <h3 className="text-lg font-bold">{t('memory.score')}</h3>
      <p className="text-2xl">{score}</p>
    </div>
  );
};
