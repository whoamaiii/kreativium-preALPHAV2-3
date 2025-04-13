import React from 'react';

export const AACIcon: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      style={{ color: 'inherit' }}
    >
      {/* Speech bubble with hand */}
      <rect x="3" y="3" width="18" height="14" rx="2" ry="2" />
      <path d="M3 9L21 9" />
      <path d="M13 17L17 21L17 17" />
      
      {/* Sign language hand */}
      <path d="M9 13v-3a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1v1" />
      <path d="M12 13v-1a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1v1" />
      <path d="M15 13v-1a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1v3" />
      <path d="M7 13h9" />
    </svg>
  );
};

export default AACIcon; 