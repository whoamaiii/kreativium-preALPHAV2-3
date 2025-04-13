import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  onIntersect?: () => void;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  enabled?: boolean;
}

export function useIntersectionObserver({
  onIntersect,
  root = null,
  rootMargin = '0px',
  threshold = 0,
  enabled = true,
}: UseIntersectionObserverProps = {}) {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const observerRef = useRef<IntersectionObserver>();
  const elementRef = useRef<Element | null>(null);

  const setNode = (node: Element | null) => {
    if (elementRef.current) {
      observerRef.current?.unobserve(elementRef.current);
    }
    elementRef.current = node;
    if (node) {
      observerRef.current?.observe(node);
    }
  };

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        if (entry.isIntersecting && onIntersect) {
          onIntersect();
        }
      },
      { root, rootMargin, threshold }
    );

    observerRef.current = observer;

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [enabled, root, rootMargin, threshold, onIntersect]);

  return {
    entry,
    setNode,
    isIntersecting: entry?.isIntersecting ?? false,
  };
}