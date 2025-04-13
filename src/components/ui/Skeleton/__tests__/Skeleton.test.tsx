import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton, SkeletonText, SkeletonCard } from '../index';

describe('Skeleton', () => {
  it('renders single skeleton', () => {
    render(<Skeleton />);
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders multiple skeletons', () => {
    render(<Skeleton count={3} />);
    expect(document.querySelectorAll('.animate-pulse')).toHaveLength(3);
  });

  it('renders skeleton text', () => {
    render(<SkeletonText />);
    expect(document.querySelectorAll('.animate-pulse')).toHaveLength(3);
  });

  it('renders skeleton card', () => {
    render(<SkeletonCard />);
    expect(document.querySelector('.rounded-lg')).toBeInTheDocument();
  });
});