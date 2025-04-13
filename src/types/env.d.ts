declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    VITE_APP_NAME: string
    VITE_APP_DESCRIPTION: string
    VITE_APP_URL: string
    VITE_API_URL: string
    VITE_ENABLE_PWA: string
    VITE_ENABLE_ANALYTICS: string
  }
}