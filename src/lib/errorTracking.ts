import { User } from 'firebase/auth';

interface ErrorContext {
  user?: {
    id: string;
    email: string | null;
  };
  action?: string;
  metadata?: Record<string, any>;
}

class ErrorTracker {
  private static instance: ErrorTracker;
  private readonly environment = import.meta.env.MODE;

  private constructor() {
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    this.captureException(event.reason, {
      action: 'unhandled_rejection',
      metadata: { type: 'promise_rejection' }
    });
  };

  captureException(error: unknown, context?: ErrorContext): void {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      environment: this.environment,
      ...context,
    };

    // Log to console in development
    if (this.environment === 'development') {
      console.error('Error captured:', errorDetails);
    }

    // Send to your error tracking service (e.g., Sentry)
    // this.sendToErrorService(errorDetails);

    // Log to Firebase Analytics in production
    if (this.environment === 'production') {
      // analytics.logEvent('error', errorDetails);
    }
  }

  captureMessage(message: string, context?: ErrorContext): void {
    this.captureException(new Error(message), context);
  }

  setUser(user: User | null): void {
    if (user) {
      // Set user context in error tracking service
      // Sentry.setUser({ id: user.uid, email: user.email });
    } else {
      // Clear user context
      // Sentry.setUser(null);
    }
  }

  cleanup(): void {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }
}

export const errorTracker = ErrorTracker.getInstance();