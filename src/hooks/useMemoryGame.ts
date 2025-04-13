import { useState, useEffect, useCallback } from 'react';
import { Question } from '../types';
import { MemoryCardData } from '../types/memory';

export const useMemoryGame = (questions: Question[], categoryId: string) => {
  const [cards, setCards] = useState<MemoryCardData[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, [questions, categoryId]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && !isComplete) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, isComplete]);

  const initializeGame = useCallback(() => {
    // Create pairs of cards from questions
    const cardPairs = questions.flatMap((question, index) => [
      {
        id: index * 2,
        questionId: question.id,
        word: question.text,
        imageUrl: question.imageUrl,
        isFlipped: false,
        isMatched: false
      },
      {
        id: index * 2 + 1,
        questionId: question.id,
        word: question.correctAnswer,
        imageUrl: question.imageUrl,
        isFlipped: false,
        isMatched: false
      }
    ]);

    // Shuffle cards
    const shuffledCards = [...cardPairs].sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTime(0);
    setIsComplete(false);
    setTimerActive(false);
  }, [questions]);

  const resetGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = useCallback((cardId: number) => {
    // Start timer on first move
    if (!timerActive) {
      setTimerActive(true);
    }
    
    // Get clicked card
    const clickedCard = cards.find(card => card.id === cardId);
    if (!clickedCard || clickedCard.isMatched || clickedCard.isFlipped || flippedCards.length >= 2) {
      return;
    }

    // Flip card
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );

    setFlippedCards(prev => {
      const newFlipped = [...prev, cardId];
      
      // If two cards are flipped
      if (newFlipped.length === 2) {
        setMoves(prevMoves => prevMoves + 1);
        
        const [firstId, secondId] = newFlipped;
        const firstCard = cards.find(card => card.id === firstId);
        const secondCard = cards.find(card => card.id === secondId);
        
        // Check for match
        if (firstCard && secondCard && firstCard.questionId === secondCard.questionId) {
          // Mark cards as matched
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isMatched: true }
                : card
            )
          );
          
          setMatchedPairs(prev => {
            const newMatchedPairs = prev + 1;
            // Check if game is complete
            if (newMatchedPairs === questions.length) {
              setIsComplete(true);
              setTimerActive(false);
            }
            return newMatchedPairs;
          });
          
          return [];
        }
        
        // If no match, flip cards back after delay
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
        }, 1000);
        
        return [];
      }
      
      return newFlipped;
    });
  }, [cards, flippedCards, questions.length, timerActive]);

  return {
    cards,
    matchedPairs,
    moves,
    time,
    isComplete,
    handleCardClick,
    resetGame
  };
};
