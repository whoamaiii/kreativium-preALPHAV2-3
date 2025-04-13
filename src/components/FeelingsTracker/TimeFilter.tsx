import React from 'react';
import { EmotionFilters } from '../../types/emotion';

interface TimeFilterProps {
  currentFilter: EmotionFilters['timeframe'];
  onChange: (timeframe: EmotionFilters['timeframe']) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * TimeFilter component
 * Provides a dropdown for selecting different time periods to view emotion data
 */
export const TimeFilter: React.FC<TimeFilterProps> = ({
  currentFilter = 'day',
  onChange,
  disabled = false,
  className = ''
}) => {
  const timeframes: { value: EmotionFilters['timeframe']; label: string }[] = [
    { value: 'hour', label: 'Last Hour' },
    { value: 'day', label: 'Last Day' },
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <div className={`time-filter flex items-center ${className}`} data-testid="time-filter">
      <label 
        htmlFor="timeframe-select" 
        className="mr-3 font-medium text-white"
      >
        View data for:
      </label>
      <select
        id="timeframe-select"
        value={currentFilter || 'day'}
        onChange={(e) => onChange(e.target.value as EmotionFilters['timeframe'])}
        disabled={disabled}
        className={`
          px-3 py-2 
          bg-zinc-700 text-white 
          border border-zinc-600 
          rounded-md
          focus:outline-none focus:ring-2 focus:ring-purple-500
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        data-testid="timeframe-select"
      >
        {timeframes.map(tf => (
          <option key={tf.value} value={tf.value}>
            {tf.label}
          </option>
        ))}
      </select>
    </div>
  );
};
