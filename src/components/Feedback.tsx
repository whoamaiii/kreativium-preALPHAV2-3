import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from './Button';

interface FeedbackProps {
  isCorrect: boolean;
  onNext: () => void;
}

export const Feedback: React.FC<FeedbackProps> = ({ isCorrect, onNext }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
        {isCorrect ? (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Riktig!</h3>
            <p className="text-gray-600 mb-6">Bra jobbet! Fortsett slik!</p>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Prøv igjen!</h3>
            <p className="text-gray-600 mb-6">Ikke gi opp, du klarer det!</p>
          </>
        )}
        <Button onClick={onNext} variant={isCorrect ? 'success' : 'primary'}>
          Neste Spørsmål
        </Button>
      </div>
    </div>
  );
};