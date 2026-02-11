// src/hooks/useThankYouMessage.ts
'use client';

import { useState } from 'react';

export interface UseThankYouMessageResult {
  showThankYou: boolean;
  isThankYouFading: boolean;
  showThankYouMessage: () => void;
}

/**
 * Hook for managing the "Thank You" message display with fade animation.
 * Shows a message for 4 seconds with a fade-out effect after 3 seconds.
 *
 * @returns Thank you message state and show function
 */
export function useThankYouMessage(): UseThankYouMessageResult {
  const [showThankYou, setShowThankYou] = useState<boolean>(false);
  const [isThankYouFading, setIsThankYouFading] = useState<boolean>(false);

  const showThankYouMessage = (): void => {
    setShowThankYou(true);
    setIsThankYouFading(false);

    // Start fade-out after 3 seconds
    setTimeout(() => {
      setIsThankYouFading(true);
    }, 3000);

    // Hide after 4 seconds
    setTimeout(() => {
      setShowThankYou(false);
      setIsThankYouFading(false);
    }, 4000);
  };

  return {
    showThankYou,
    isThankYouFading,
    showThankYouMessage
  };
}
