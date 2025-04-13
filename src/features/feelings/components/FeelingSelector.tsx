import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FeelingType, FeelingIntensity } from '../types';
import { cn } from '../../../utils/cn';

// Define feelings with their corresponding emoji and background color
const feelingOptions: Array<{
  type: FeelingType;
  emoji: string;
  label: string;
  bgColor: string;
}> = [
  { type: 'happy', emoji: '😃', label: 'Happy', bgColor: 'bg-yellow-100' },
  { type: 'sad', emoji: '😢', label: 'Sad', bgColor: 'bg-blue-100' },
  { type: 'angry', emoji: '😠', label: 'Angry', bgColor: 'bg-red-100' },
  { type: 'scared', emoji: '😨', label: 'Scared', bgColor: 'bg-purple-100' },
  { type: 'calm', emoji: '😌', label: 'Calm', bgColor: 'bg-green-100' },
  { type: 'excited', emoji: '🤩', label: 'Excited', bgColor: 'bg-pink-100' },
  { type: 'tired', emoji: '😴', label: 'Tired', bgColor: 'bg-gray-100' },
  { type: 'confused', emoji: '😕', label: 'Confused', bgColor: 'bg-orange-100' },
  { type: 'proud', emoji: '😊', label: 'Proud', bgColor: 'bg-indigo-100' },
];

interface FeelingSelectorProps {
  onSelectFeeling: (feeling: FeelingType, intensity: FeelingIntensity) => void;
  className?: string;
}

export const FeelingSelector: React.FC<FeelingSelectorProps> = ({
  onSelectFeeling,
  className,
}) => {
  const [selectedFeeling, setSelectedFeeling] = useState<FeelingType | null>(null);
  const [intensity, setIntensity] = useState<FeelingIntensity>(3);

  const handleFeelingSelect = (feelingType: FeelingType) => {
    setSelectedFeeling(feelingType);
  };

  const handleIntensityChange = (newIntensity: FeelingIntensity) => {
    setIntensity(newIntensity);
  };

  const handleSubmit = () => {
    if (selectedFeeling) {
      onSelectFeeling(selectedFeeling, intensity);
      // Reset after submission
      setSelectedFeeling(null);
      setIntensity(3);
    }
  };

  return (
    <div className={cn('bg-white rounded-lg shadow-sm p-4', className)}>
      <h3 className="text-lg font-semibold mb-3">How are you feeling today?</h3>
      
      <div className="grid grid-cols-3 gap-3 mb-6">
        {feelingOptions.map((feeling) => (
          <motion.button
            key={feeling.type}
            type="button"
            className={cn(
              'flex flex-col items-center justify-center p-3 rounded-lg',
              feeling.bgColor,
              selectedFeeling === feeling.type
                ? 'ring-2 ring-blue-400 shadow-md'
                : 'hover:shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-blue-400'
            )}
            onClick={() => handleFeelingSelect(feeling.type)}
            whileTap={{ scale: 0.95 }}
            aria-label={`Feeling ${feeling.label}`}
          >
            <span className="text-3xl mb-1">{feeling.emoji}</span>
            <span className="text-xs font-medium">{feeling.label}</span>
          </motion.button>
        ))}
      </div>

      {selectedFeeling && (
        <>
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">
              How strong is this feeling? (1-5)
            </h4>
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((value) => (
                <motion.button
                  key={value}
                  type="button"
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-lg',
                    value === intensity
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200',
                    'focus:outline-none focus:ring-2 focus:ring-blue-400'
                  )}
                  onClick={() => handleIntensityChange(value as FeelingIntensity)}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Intensity ${value}`}
                >
                  {value}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            type="button"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-700"
            onClick={handleSubmit}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            Save My Feeling
          </motion.button>
        </>
      )}
    </div>
  );
};

export default FeelingSelector; 