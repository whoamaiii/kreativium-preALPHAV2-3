import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorBoundaryProps } from '../../types/components';
import { ErrorFallback } from './ErrorFallback';

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component that catches JavaScript errors anywhere in its child
 * component tree and displays a fallback UI instead of the component tree that crashed.
 * 
 * @example
 * <ErrorBoundary fallback={<CustomErrorComponent />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
    
    this.setState({ errorInfo });
    
    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Render custom fallback or default ErrorFallback
      if (fallback) {
        return typeof fallback === 'function' 
          ? fallback({ error: error as Error, resetErrorBoundary: this.handleReset })
          : fallback;
      }
      
      return (
        <ErrorFallback 
          error={error as Error} 
          resetErrorBoundary={this.handleReset}
          reloadPage={this.handleReload}
        />
      );
    }

    return children;
  }
}