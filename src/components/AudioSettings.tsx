import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioSettingsProps {
  onVolumeChange: (volume: number) => void;
  onMute: (muted: boolean) => void;
  initialVolume?: number;
  initialMuted?: boolean;
}

export const AudioSettings: React.FC<AudioSettingsProps> = ({
  onVolumeChange,
  onMute,
  initialVolume = 0.5,
  initialMuted = false,
}) => {
  const [volume, setVolume] = useState(initialVolume);
  const [muted, setMuted] = useState(initialMuted);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    onVolumeChange(newVolume);
  };

  const handleMute = () => {
    setMuted(!muted);
    onMute(!muted);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleMute}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
      >
        {muted ? (
          <VolumeX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>
      
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 'auto', opacity: 1 }}
        className="relative w-32"
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div 
          className="absolute h-2 bg-purple-500 rounded-l-lg pointer-events-none"
          style={{ width: `${volume * 100}%` }}
        />
      </motion.div>
    </div>
  );
}