import { EmotionLog, EmotionFilters, Emotion } from '../types/emotion';
import { User } from '../types/user';
import { nanoid } from 'nanoid';

// Storage key for localStorage
const STORAGE_KEY = 'emotion_logs';

/**
 * Helper function to parse a date from an ISO string
 */
const parseDate = (isoString: string): Date => new Date(isoString);

/**
 * Helper function to filter logs by timeframe
 */
const filterByTimeframe = (logs: EmotionLog[], filters: EmotionFilters): EmotionLog[] => {
  if (!filters.startDate || !filters.endDate) return logs;

  const start = filters.startDate.getTime();
  const end = filters.endDate.getTime();

  return logs.filter(log => {
    const logTime = parseDate(log.timestamp).getTime();
    return logTime >= start && logTime <= end;
  });
};

/**
 * Helper function to calculate date range based on timeframe
 */
const calculateTimeRange = (timeframe: 'hour' | 'day' | 'week' | 'month' | 'all'): { startDate: Date, endDate: Date } => {
  const endDate = new Date();
  let startDate = new Date();

  switch (timeframe) {
    case 'hour':
      startDate.setHours(endDate.getHours() - 1);
      break;
    case 'day':
      startDate.setDate(endDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'week':
      startDate.setDate(endDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'month':
      startDate.setMonth(endDate.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'all':
    default:
      startDate = new Date(0); // Epoch time
      break;
  }
  return { startDate, endDate };
};

// Sample emotion data
const SAMPLE_DATA: EmotionLog[] = [
  // Child emotion logs
  {
    id: 'log001',
    userId: 'child123',
    role: 'child',
    emotion: 'happy',
    timestamp: '2023-10-27T09:15:00.000Z',
    optionalNote: 'Played with blocks'
  },
  {
    id: 'log002',
    userId: 'child123',
    role: 'child',
    emotion: 'frustrated',
    timestamp: '2023-10-27T11:05:00.000Z',
    optionalNote: 'Maths was hard'
  },
  {
    id: 'log003',
    userId: 'child123',
    role: 'child',
    emotion: 'calm',
    timestamp: '2023-10-27T14:30:00.000Z'
  },
  {
    id: 'log004',
    userId: 'child456',
    role: 'child',
    emotion: 'sad',
    timestamp: '2023-10-26T10:00:00.000Z',
    optionalNote: 'Missed my friend'
  },
  {
    id: 'log005',
    userId: 'child456',
    role: 'child',
    emotion: 'excited',
    timestamp: '2023-10-27T08:00:00.000Z',
    optionalNote: 'Going to the park later!'
  },
  
  // Teacher emotion logs
  {
    id: 'log006',
    userId: 'teacher789',
    role: 'teacher',
    emotion: 'happy',
    timestamp: '2023-10-27T08:30:00.000Z',
    optionalNote: 'Great start to the day'
  },
  {
    id: 'log007',
    userId: 'teacher789',
    role: 'teacher',
    emotion: 'tired',
    timestamp: '2023-10-27T13:15:00.000Z',
    optionalNote: 'Busy morning with meetings'
  },
  {
    id: 'log008',
    userId: 'teacher789',
    role: 'teacher',
    emotion: 'calm',
    timestamp: '2023-10-27T16:00:00.000Z',
    optionalNote: 'Productive afternoon session'
  }
];

/**
 * Initialize the database with sample data if empty
 */
const initializeDatabase = (): void => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    
    if (!storedData) {
      console.log('Initializing emotion database with sample data');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA));
    }
  } catch (error) {
    console.error('Error initializing emotion database:', error);
    // Force re-initialization with sample data on error
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA));
  }
};

// Function to reset database (for development/testing)
export const resetDatabase = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA));
    console.log('Emotion database has been reset with fresh sample data');
  } catch (error) {
    console.error('Error resetting emotion database:', error);
  }
};

// Initialize the database
initializeDatabase();

/**
 * Database operations for emotion logs
 */
export const EmotionDatabase = {
  /**
   * Get all emotion logs from storage
   */
  async getAllLogs(): Promise<EmotionLog[]> {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (!storedData) {
        console.warn('No emotion logs found in storage, reinitializing with sample data');
        initializeDatabase();
        return SAMPLE_DATA;
      }
      return JSON.parse(storedData);
    } catch (error) {
      console.error('Error reading emotion logs:', error);
      // Return sample data on error
      return SAMPLE_DATA;
    }
  },

  /**
   * Add a new emotion log
   */
  async addLog(
    logData: { emotion: Emotion; optionalNote?: string; },
    currentUser: User
  ): Promise<EmotionLog | null> {
    // Validate user can log emotions
    if (currentUser.role !== 'child' && currentUser.role !== 'teacher') {
      console.warn(`User ${currentUser.id} (${currentUser.role}) does not have permission to log emotions.`);
      return null;
    }

    const newLog: EmotionLog = {
      id: nanoid(),
      userId: currentUser.id,
      role: currentUser.role as 'child' | 'teacher',
      emotion: logData.emotion,
      timestamp: new Date().toISOString(),
      optionalNote: logData.optionalNote,
    };

    try {
      const currentLogs = await this.getAllLogs();
      const updatedLogs = [...currentLogs, newLog];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
      console.log('Emotion log added:', newLog);
      return newLog;
    } catch (error) {
      console.error('Error adding emotion log:', error);
      return null;
    }
  },

  /**
   * Get filtered emotion logs
   */
  async getLogs(filters: EmotionFilters, currentUser: User): Promise<EmotionLog[]> {
    let logs = await this.getAllLogs();

    // User-based filtering (for privacy)
    if (currentUser.role === 'child') {
      // Children can only see their own logs
      logs = logs.filter(log => log.userId === currentUser.id);
    } else if (filters.userId) {
      // Teachers can filter by specific user
      logs = logs.filter(log => log.userId === filters.userId);
    }

    // Role filtering
    if (filters.role) {
      logs = logs.filter(log => log.role === filters.role);
    }

    // Emotion filtering
    if (filters.emotion) {
      logs = logs.filter(log => log.emotion === filters.emotion);
    }

    // Timeframe filtering
    if (filters.timeframe && filters.timeframe !== 'all') {
      const { startDate, endDate } = calculateTimeRange(filters.timeframe);
      filters = { ...filters, startDate, endDate };
      logs = filterByTimeframe(logs, filters);
    } else if (filters.startDate && filters.endDate) {
      logs = filterByTimeframe(logs, filters);
    }

    // Sort by timestamp (most recent first)
    logs.sort((a, b) => parseDate(b.timestamp).getTime() - parseDate(a.timestamp).getTime());

    return logs;
  },

  /**
   * Delete an emotion log by ID (future feature)
   */
  async deleteLog(logId: string, currentUser: User): Promise<boolean> {
    try {
      const logs = await this.getAllLogs();
      const logToDelete = logs.find(log => log.id === logId);
      
      // Validate permissions
      if (!logToDelete) return false;
      if (currentUser.role !== 'teacher' && logToDelete.userId !== currentUser.id) {
        console.warn('User does not have permission to delete this log');
        return false;
      }
      
      const updatedLogs = logs.filter(log => log.id !== logId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
      
      return true;
    } catch (error) {
      console.error('Error deleting emotion log:', error);
      return false;
    }
  }
};
