// src/hooks/useRatingData.ts
'use client';

import { useState } from 'react';

export interface RatingData {
  averageRating: number;
  reviewCount: number;
}

interface RatingCounters {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}

export interface UseRatingDataResult {
  rating: RatingData;
  isLoading: boolean;
  loadRatingData: (calculatorId?: string) => Promise<void>;
  saveRating: (calculatorId: string, newRating: number) => Promise<void>;
}

/**
 * Hook for managing rating data fetching and saving.
 * Handles communication with the ratings API endpoint.
 *
 * @returns Rating data and functions to load/save ratings
 */
export function useRatingData(): UseRatingDataResult {
  const [rating, setRating] = useState<RatingData>({
    averageRating: 0,
    reviewCount: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load ratings from server
  const loadRatingData = async (calculatorId?: string): Promise<void> => {
    try {
      const response = await fetch('/api/ratings');
      if (response.ok) {
        const data = await response.json();
        const allRatings = data.ratings;

        if (calculatorId && allRatings && allRatings[calculatorId]) {
          const calculatorStats = allRatings[calculatorId];
          const totalCount = Object.values(calculatorStats as RatingCounters).reduce(
            (sum: number, count: number) => sum + count,
            0
          );
          const weightedSum = Object.entries(calculatorStats as RatingCounters).reduce(
            (sum, [star, count]: [string, number]) => sum + (parseInt(star) * count),
            0
          );
          const averageRating = totalCount > 0 ? weightedSum / totalCount : 0;

          setRating({
            averageRating: Math.round(averageRating * 10) / 10,
            reviewCount: totalCount
          });
        }
      }
    } catch (error) {
      console.error('Error loading rating data:', error);
    }
  };

  // Save rating to server
  const saveRating = async (calculatorId: string, newRating: number): Promise<void> => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          calculatorId,
          rating: newRating
        })
      });

      if (response.ok) {
        const result = await response.json();

        // Update local state
        setRating({
          averageRating: result.averageRating,
          reviewCount: result.totalCount
        });
      } else {
        console.error('Failed to save rating');
      }
    } catch (error) {
      console.error('Error saving rating:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rating,
    isLoading,
    loadRatingData,
    saveRating
  };
}
