import React from 'react';
import { useNavigate } from 'react-router-dom';
import AACIcon from './AAC/AACIcon';

export const StandaloneAAC: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/aac')}
      className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-colors"
      aria-label="Open communication board"
    >
      <AACIcon className="w-5 h-5" />
      <span>Kommunikasjonstavle</span>
    </button>
  );
};

export default StandaloneAAC; 