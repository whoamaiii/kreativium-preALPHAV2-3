import React from 'react';
import { useTranslation } from 'react-i18next';

export interface MemoryCardData {
  id: number;
  imageUrl: string;
  word: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryCardProps {
  card: MemoryCardData;
  onClick: (id: number) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ card, onClick }) => {
  const { t } = useTranslation();
  const { id, imageUrl, word, isFlipped, isMatched } = card;

  const handleClick = () => {
    if (!isFlipped && !isMatched) {
      onClick(id);
    }
  };

  return (
    <div 
      className={`
        relative w-24 h-32 md:w-32 md:h-44 cursor-pointer transition-transform duration-300 transform 
        ${isFlipped || isMatched ? 'rotate-y-180' : ''}
        ${isMatched ? 'opacity-70' : ''}
      `} 
      onClick={handleClick}
      aria-label={isFlipped || isMatched ? word : t('memory.findPairs')}
    >
      <div className={`
        absolute w-full h-full rounded-lg shadow-md transition-all duration-300
        ${isFlipped || isMatched ? 'opacity-0' : 'opacity-100'}
        bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center
      `}>
        <span className="text-white text-2xl font-bold">?</span>
      </div>
      
      <div className={`
        absolute w-full h-full rounded-lg shadow-md transition-all duration-300 bg-white
        ${isFlipped || isMatched ? 'opacity-100' : 'opacity-0'}
        flex flex-col items-center justify-center p-2 rotate-y-180
      `}>
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={word} 
            className="h-16 md:h-24 w-auto object-contain mb-2"
          />
        )}
        <span className="text-sm md:text-base font-medium text-center">{word}</span>
      </div>
    </div>
  );
};
