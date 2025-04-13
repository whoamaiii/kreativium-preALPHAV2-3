import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../index';

describe('LoadingSpinner', () => {
  it('renders with default size', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-8 h-8');
  });

  it('renders with custom size', () => {
    render(<LoadingSpinner size="lg" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-12 h-12');
  });

  it('renders in fullscreen mode', () => {
    render(<LoadingSpinner fullScreen />);
    expect(screen.getByRole('status').parentElement).toHaveClass('fixed inset-0');
  });
});