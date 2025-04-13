import React from 'react';
import { MemoryCard, MemoryCardData } from './MemoryCard';

interface MemoryGridProps {
  cards: MemoryCardData[];
  onCardClick: (id: number) => void;
}

export const MemoryGrid: React.FC<MemoryGridProps> = ({ cards, onCardClick }) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 justify-items-center w-full">
      {cards.map(card => (
        <MemoryCard 
          key={card.id} 
          card={card} 
          onClick={onCardClick} 
        />
      ))}
    </div>
  );
};
