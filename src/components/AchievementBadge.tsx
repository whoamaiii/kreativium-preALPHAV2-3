import React from 'react';

interface AchievementBadgeProps {
  name: string;
  description: string;
  unlocked: boolean;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  name,
  description,
  unlocked,
}) => {
  return (
    <div
      className={`rounded-lg border p-4 mb-2 transition-all duration-300 ${
        unlocked
          ? 'bg-gradient-to-br from-green-700 to-green-900 border-green-500 shadow-lg'
          : 'bg-gray-800 border-gray-700 opacity-50'
      }`}
      aria-disabled={!unlocked}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white">{name}</h3>
        {unlocked ? (
          <span className="text-sm px-2 py-1 rounded-full bg-green-500 text-white">
            Oppnådd
          </span>
        ) : (
          <span className="text-sm px-2 py-1 rounded-full bg-gray-700 text-gray-400">
            Låst
          </span>
        )}
      </div>
      <p className="text-sm text-gray-300 mt-1">{description}</p>
    </div>
  );
};

export default AchievementBadge; 