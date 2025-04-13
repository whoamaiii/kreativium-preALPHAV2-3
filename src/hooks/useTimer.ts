import { useState, useEffect } from 'react';

export function useTimer(isRunning: boolean = true) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: number;

    if (isRunning) {
      interval = window.setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  return {
    time,
    isRunning,
    reset: () => setTime(0),
  };
}