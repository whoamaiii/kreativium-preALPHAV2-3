import React from 'react';
import { useTranslation } from 'react-i18next';

interface MemoryTimerProps {
  time: number;
}

export const MemoryTimer: React.FC<MemoryTimerProps> = ({ time }) => {
  const { t } = useTranslation();
  
  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center md:text-left">
      <h3 className="text-lg font-bold">{t('memory.timeElapsed')}</h3>
      <p className="text-2xl">{formatTime(time)}</p>
    </div>
  );
};
