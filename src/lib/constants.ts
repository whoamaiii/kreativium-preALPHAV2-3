export const APP_NAME = 'Ask123 - Tegn til Tale';
export const APP_DESCRIPTION = 'Lær tegnspråk gjennom et engasjerende spill';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  QUIZ: '/quiz',
  QUIZ_CATEGORIES: '/quiz/categories',
  CUSTOM: '/custom',
  DICTIONARY: '/dictionary',
  SETTINGS: '/settings',
  STATS: '/stats',
} as const;

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  QUIZ: '/api/quiz',
  STATS: '/api/stats',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  SETTINGS: 'settings',
  QUIZ_PROGRESS: 'quiz_progress',
} as const;

export const DEFAULT_SETTINGS = {
  theme: 'system',
  language: 'nb',
  soundEnabled: true,
  volume: 0.7,
  timerEnabled: true,
  timerDuration: 30,
} as const;