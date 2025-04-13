import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
  glowColor: string;
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  icon,
  onClick,
  color,
  glowColor,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card
        onClick={onClick}
        className={`
          relative p-6 overflow-hidden
          bg-gray-900/50 backdrop-blur-sm cursor-pointer
          before:absolute before:inset-0 before:opacity-0
          before:transition-opacity before:rounded-lg
          before:blur-xl hover:before:opacity-100
          ${glowColor}
        `}
      >
        <div className="relative z-10">
          <div className={`w-12 h-12 mx-auto mb-4 ${color}`}>
            {icon}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </Card>
    </motion.div>
  );
};