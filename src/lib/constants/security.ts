export const RATE_LIMITS = {
  UPLOAD: {
    WINDOW_MS: 60000, // 1 minute
    MAX_REQUESTS: 10,
  },
  DOWNLOAD: {
    WINDOW_MS: 60000,
    MAX_REQUESTS: 30,
  },
  API: {
    WINDOW_MS: 60000,
    MAX_REQUESTS: 100,
  },
};

export const SECURITY_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES_PER_REQUEST: 10,
  ALLOWED_FILE_TYPES: {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'image/gif': ['.gif'],
  },
  ALLOWED_ORIGINS: [
    'https://ask123.no',
    'https://admin.ask123.no',
  ],
  CONTENT_SECURITY_POLICY: {
    'default-src': ["'self'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'script-src': ["'self'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'connect-src': ["'self'", 'https:'],
  },
};

export const AUTH_CONFIG = {
  TOKEN_EXPIRY: 3600, // 1 hour in seconds
  REFRESH_TOKEN_EXPIRY: 2592000, // 30 days in seconds
  PASSWORD_REQUIREMENTS: {
    minLength: 8,
    requireNumbers: true,
    requireSpecialChars: true,
    requireUppercase: true,
    requireLowercase: true,
  },
};