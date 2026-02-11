// src/hooks/useStarInteraction.ts
'use client';

import { useState } from 'react';

export interface UseStarInteractionResult {
  hoveredStar: number;
  showTooltip: boolean;
  setShowTooltip: (show: boolean) => void;
  handleStarMouseEnter: (starValue: number, hasRated: boolean) => void;
  handleStarMouseLeave: (hasRated: boolean) => void;
}

/**
 * Hook for managing star hover interactions and tooltip state.
 * Handles hover effects and tooltip display logic.
 *
 * @returns Star interaction state and event handlers
 */
export function useStarInteraction(): UseStarInteractionResult {
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const handleStarMouseEnter = (starValue: number, hasRated: boolean): void => {
    if (!hasRated) {
      setHoveredStar(starValue);
    }
  };

  const handleStarMouseLeave = (hasRated: boolean): void => {
    if (!hasRated) {
      setHoveredStar(0);
    }
  };

  return {
    hoveredStar,
    showTooltip,
    setShowTooltip,
    handleStarMouseEnter,
    handleStarMouseLeave
  };
}
