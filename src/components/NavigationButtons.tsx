import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';

interface NavigationButtonsProps {
  currentIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
}

/**
 * Navigation buttons for quiz and other multi-step interfaces
 * Includes proper accessibility attributes for keyboard navigation
 */
export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext
}) => {
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && !isFirstQuestion) {
      onPrevious();
    } else if (e.key === 'ArrowRight' && !isLastQuestion) {
      onNext();
    }
  };

  return (
    <div 
      className="flex justify-between mt-8" 
      onKeyDown={handleKeyDown}
      role="navigation"
      aria-label="Question navigation"
    >
      <Button
        onClick={onPrevious}
        disabled={isFirstQuestion}
        variant="secondary"
        aria-label="Previous question"
        className="flex items-center"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Previous
      </Button>
      
      <div className="text-center" aria-live="polite">
        <span className="text-gray-400">
          {currentIndex + 1} of {totalQuestions}
        </span>
      </div>

      <Button
        onClick={onNext}
        disabled={isLastQuestion}
        variant="primary"
        aria-label="Next question"
        className="flex items-center"
      >
        Next
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};