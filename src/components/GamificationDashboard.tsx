import React, { useMemo } from 'react';
import useGamification from '../hooks/useGamification';
import AchievementBadge from './AchievementBadge';

interface GamificationDashboardProps {
  compact?: boolean;
}

export const GamificationDashboard: React.FC<GamificationDashboardProps> = ({
  compact = false,
}) => {
  const {
    xp,
    level,
    streak,
    xpToNextLevel,
    achievements,
    totalXp,
    resetGamification,
  } = useGamification();

  // Filter unlocked achievements
  const unlockedAchievements = useMemo(
    () => achievements.filter((a) => a.unlocked),
    [achievements]
  );

  // Filter locked achievements
  const lockedAchievements = useMemo(
    () => achievements.filter((a) => !a.unlocked),
    [achievements]
  );

  // Calculate progress percentage
  const progressPercentage = (xp / xpToNextLevel) * 100;

  if (compact) {
    return (
      <div className="bg-gray-800 rounded-lg p-3 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <div className="text-white font-bold">Nivå {level}</div>
          <div className="text-sm text-gray-400">{xp}/{xpToNextLevel} XP</div>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        {streak > 0 && (
          <div className="mt-2 text-xs text-gray-400 flex items-center">
            <span className="mr-1">🔥</span>
            <span>{streak} streak</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Din fremgang</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="text-lg text-white">
            Nivå <span className="font-bold">{level}</span>
          </div>
          <div className="text-sm text-gray-400">
            {xp}/{xpToNextLevel} XP
          </div>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <div className="text-sm text-gray-400">Total XP: {totalXp}</div>
          {streak > 0 && (
            <div className="text-sm text-yellow-400 flex items-center">
              <span className="mr-1">🔥</span>
              <span>{streak} streak</span>
            </div>
          )}
        </div>
      </div>

      {unlockedAchievements.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-3">
            Achievements ({unlockedAchievements.length}/{achievements.length})
          </h3>
          <div className="space-y-2">
            {unlockedAchievements.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                name={achievement.name}
                description={achievement.description}
                unlocked={achievement.unlocked}
              />
            ))}
          </div>
        </div>
      )}

      {lockedAchievements.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white mb-3">Låste achievements</h3>
          <div className="space-y-2">
            {lockedAchievements.slice(0, 3).map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                name={achievement.name}
                description={achievement.description}
                unlocked={achievement.unlocked}
              />
            ))}
            {lockedAchievements.length > 3 && (
              <p className="text-sm text-gray-400 mt-2">
                + {lockedAchievements.length - 3} flere låste achievements
              </p>
            )}
          </div>
        </div>
      )}

      <button
        onClick={resetGamification}
        className="text-xs text-gray-500 hover:text-gray-300 mt-4"
      >
        Tilbakestill fremgang
      </button>
    </div>
  );
};

export default GamificationDashboard; 