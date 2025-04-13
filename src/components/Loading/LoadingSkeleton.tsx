import React from 'react';
import { cn } from '../../utils/cn';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  count = 1
}) => {
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

export const LoadingSkeletonText: React.FC<LoadingSkeletonProps> = ({
  className
}) => {
  return (
    <div className="space-y-2">
      <LoadingSkeleton className={cn('h-4 w-[250px]', className)} />
      <LoadingSkeleton className="h-4 w-[200px]" />
      <LoadingSkeleton className="h-4 w-[150px]" />
    </div>
  );
};

export const LoadingSkeletonCard: React.FC<LoadingSkeletonProps> = ({
  className
}) => {
  return (
    <div className={cn('space-y-4 rounded-lg border p-4', className)}>
      <LoadingSkeleton className="h-32 w-full rounded-lg" />
      <LoadingSkeletonText />
    </div>
  );
};