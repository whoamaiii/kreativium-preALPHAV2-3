import React, { ReactNode } from 'react';

interface CardProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  key?: string;
  [x: string]: any; // Allow other props to be passed through
}

export const Card: React.FC<CardProps> = ({ 
  className = '', 
  children, 
  onClick,
  ...props 
}) => {
  return (
    <div 
      className={`bg-zinc-800 text-white p-4 rounded-2xl shadow-md ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardContentProps {
  className?: string;
  children: ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ className = '', children }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};
