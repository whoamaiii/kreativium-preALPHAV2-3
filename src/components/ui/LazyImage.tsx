import React, { useState } from 'react';
import { useInView } from 'react-hook-inview';
import { motion } from 'framer-motion';
import { Skeleton } from './Skeleton';
import { cn } from '../../utils/cn';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: 'square' | '16:9' | '4:3';
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  aspectRatio = 'square',
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.1,
    unobserveOnEnter: true,
  });

  const aspectRatioClasses = {
    square: 'aspect-square',
    '16:9': 'aspect-video',
    '4:3': 'aspect-4/3',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800',
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      {inView ? (
        <>
          {!isLoaded && <Skeleton className="absolute inset-0" />}
          <motion.img
            src={src}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full object-cover"
            loading="lazy"
            {...props}
          />
        </>
      ) : (
        <Skeleton className="absolute inset-0" />
      )}
    </div>
  );
};