// src/hooks/useUserRating.ts
'use client';

import { useState, useEffect } from 'react';

export interface UseUserRatingResult {
  userRating: number;
  hasRated: boolean;
  setUserRating: (rating: number) => void;
  setHasRated: (rated: boolean) => void;
  checkUserRating: (calculatorId: string) => void;
  saveUserRatingToStorage: (calculatorId: string, rating: number) => void;
}

/**
 * Hook for managing user's rating state.
 * Handles localStorage persistence and user rating status.
 *
 * @returns User rating state and management functions
 */
export function useUserRating(): UseUserRatingResult {
  const [userRating, setUserRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(false);

  // Check if user has already rated (localStorage)
  const checkUserRating = (calculatorId: string): void => {
    try {
      const userRatingKey = `user_rating_${calculatorId}`;
      const userRated = localStorage.getItem(userRatingKey);
      if (userRated) {
        setHasRated(true);
        setUserRating(parseInt(userRated, 10));
      }
    } catch (error) {
      console.error('Error checking user rating:', error);
    }
  };

  // Save user rating to localStorage
  const saveUserRatingToStorage = (calculatorId: string, rating: number): void => {
    try {
      const userRatingKey = `user_rating_${calculatorId}`;
      localStorage.setItem(userRatingKey, rating.toString());
      setUserRating(rating);
      setHasRated(true);
    } catch (error) {
      console.error('Error saving user rating:', error);
    }
  };

  return {
    userRating,
    hasRated,
    setUserRating,
    setHasRated,
    checkUserRating,
    saveUserRatingToStorage
  };
}
