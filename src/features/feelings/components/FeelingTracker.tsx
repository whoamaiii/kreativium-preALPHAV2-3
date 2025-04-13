import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeelingType, FeelingIntensity } from '../types';
import FeelingSelector from './FeelingSelector';
import { useFeelings } from '../hooks/useFeelings';
import { cn } from '../../../utils/cn';

interface FeelingTrackerProps {
  className?: string;
  onComplete?: () => void;
  xpAmount?: number;
}

export const FeelingTracker: React.FC<FeelingTrackerProps> = ({
  className,
  onComplete,
  xpAmount = 10,
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { logFeeling, isLoading, error } = useFeelings({
    autoAwardXP: true,
    xpAmount,
  });

  const handleFeelingSelect = (feeling: FeelingType, intensity: FeelingIntensity) => {
    if (showNotes) {
      handleSubmit(feeling, intensity);
    } else {
      setShowNotes(true);
    }
  };

  const handleSubmit = async (feeling: FeelingType, intensity: FeelingIntensity) => {
    const result = await logFeeling(feeling, intensity, notes || undefined);
    
    if (result) {
      setSuccessMessage(`You logged that you're feeling ${feeling} with intensity ${intensity}!`);
      setNotes('');
      setShowNotes(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
        if (onComplete) {
          onComplete();
        }
      }, 3000);
    }
  };

  const handleSkipNotes = () => {
    setShowNotes(false);
    // The actual submission happens in handleFeelingSelect
  };

  return (
    <div className={cn('relative', className)}>
      <AnimatePresence mode="wait">
        {successMessage ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg"
          >
            <p>{successMessage}</p>
            <p className="text-sm mt-1">Thank you for sharing how you feel!</p>
            {xpAmount > 0 && (
              <p className="text-sm font-medium mt-1">
                +{xpAmount} XP earned for tracking your feelings!
              </p>
            )}
          </motion.div>
        ) : showNotes ? (
          <motion.div
            key="notes"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white rounded-lg shadow-sm p-4"
          >
            <h3 className="text-lg font-semibold mb-3">Add notes (optional)</h3>
            
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows={4}
              placeholder="Anything else you want to say about how you're feeling?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            
            <div className="flex justify-between">
              <motion.button
                type="button"
                className="px-4 py-2 text-blue-600 rounded-lg font-medium focus:outline-none hover:bg-blue-50"
                onClick={handleSkipNotes}
                whileTap={{ scale: 0.98 }}
              >
                Skip
              </motion.button>
              
              <motion.button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-700"
                onClick={() => setShowNotes(false)}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Continue'}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="selector"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FeelingSelector onSelectFeeling={handleFeelingSelect} />
            
            {error && (
              <div className="mt-3 text-red-500 text-sm">
                <p>Error: {error}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeelingTracker; 