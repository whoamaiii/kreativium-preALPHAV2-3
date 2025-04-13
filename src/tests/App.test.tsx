import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../App';

describe('App', () => {
  it('renders the main title', () => {
    render(<App />);
    expect(screen.getByText('Ask123 - Tegn til Tale')).toBeInTheDocument();
  });

  it('starts with menu view', () => {
    render(<App />);
    expect(screen.getByText('Quiz')).toBeInTheDocument();
    expect(screen.getByText('Memory')).toBeInTheDocument();
    expect(screen.getByText('Øvelse')).toBeInTheDocument();
  });
});