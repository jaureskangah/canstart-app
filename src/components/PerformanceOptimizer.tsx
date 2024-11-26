import React, { Suspense, lazy } from 'react';
import { useInView } from 'react-intersection-observer';

// Lazy load components
export const lazyLoad = (importFn: () => Promise<any>) => {
  const LazyComponent = lazy(importFn);
  return function LazyWrapper(props: any) {
    return (
      <Suspense fallback={<LoadingPlaceholder />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
};

// Loading placeholder
export function LoadingPlaceholder() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}

// Intersection Observer Hook for lazy loading
export function useInViewLoader() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  return { ref, inView };
}