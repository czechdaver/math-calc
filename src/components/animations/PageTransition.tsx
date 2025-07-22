import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  out: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const router = useRouter();
  const scrollPositions = useRef<{ [url: string]: number }>({});
  const isBack = useRef(false);

  // Handle scroll position on navigation
  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      // Save the current scroll position
      scrollPositions.current[router.asPath] = window.scrollY;
      
      // Check if this is a back/forward navigation
      isBack.current = document.referrer.includes(window.location.origin) && 
        !router.asPath.includes('?') && 
        !url.includes('?');
    };

    const handleRouteChangeComplete = (url: string) => {
      // Restore scroll position if this is a back/forward navigation
      if (isBack.current && scrollPositions.current[url]) {
        window.scrollTo(0, scrollPositions.current[url]);
      } else {
        // Scroll to top for new navigations
        window.scrollTo(0, 0);
      }
      
      // Reset the flag
      isBack.current = false;
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={router.asPath}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
