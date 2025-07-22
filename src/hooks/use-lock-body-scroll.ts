import { useEffect, useLayoutEffect } from 'react';

// Use the layout effect to prevent hydration warnings in Next.js
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Hook that locks body scrolling when a modal is open
 * @param lock Whether to lock the body scroll
 */
const useLockBodyScroll = (lock: boolean = true): void => {
  useIsomorphicLayoutEffect(() => {
    if (!lock) return;

    // Get the original body overflow value so we can revert to it later
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Prevent scrolling on mount
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [lock]);
};

export { useLockBodyScroll };
