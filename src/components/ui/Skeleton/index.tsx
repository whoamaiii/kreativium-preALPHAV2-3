import React from 'react';
import { cn } from '../../../utils/cn';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
            className
          )}
        />
      ))}
    </>
  );
};

export const SkeletonText: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className="space-y-2">
      <Skeleton className={cn('h-4 w-[250px]', className)} />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
    </div>
  );
};

export const SkeletonCard: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn('space-y-4 rounded-lg border p-4', className)}>
      <Skeleton className="h-32 w-full rounded-lg" />
      <SkeletonText />
    </div>
  );
};