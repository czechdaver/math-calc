// src/components/calculators/shared/CalculatorRating.tsx
'use client';

import React, { useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';
import { useRatingData } from '@/hooks/useRatingData';
import { useUserRating } from '@/hooks/useUserRating';
import { useStarInteraction } from '@/hooks/useStarInteraction';
import { useThankYouMessage } from '@/hooks/useThankYouMessage';

export interface CalculatorRatingProps {
  calculatorId: string;
  className?: string;
}

/**
 * CalculatorRating component - displays interactive star rating for calculators.
 * Features:
 * - 5-star interactive rating system
 * - Average rating display with review count
 * - Hover effects and tooltips
 * - LocalStorage-based rate-once enforcement
 * - "Thank You" message with fade animation
 * - API integration for rating persistence
 *
 * @param calculatorId - Unique identifier for the calculator
 * @param className - Additional CSS classes
 */
const CalculatorRating: React.FC<CalculatorRatingProps> = ({
  calculatorId,
  className = ''
}) => {
  const t = useTranslations();

  // Custom hooks for separated concerns
  const { rating, isLoading, loadRatingData, saveRating } = useRatingData();
  const { hasRated, checkUserRating, saveUserRatingToStorage } = useUserRating();
  const { hoveredStar, showTooltip, setShowTooltip, handleStarMouseEnter, handleStarMouseLeave } = useStarInteraction();
  const { showThankYou, isThankYouFading, showThankYouMessage } = useThankYouMessage();

  // Load data and check user rating on mount
  useEffect(() => {
    loadRatingData();
    checkUserRating(calculatorId);
  }, [calculatorId]);

  // Handle star click - save to API and localStorage
  const handleStarClick = async (starValue: number) => {
    if (hasRated || isLoading) return;

    await saveRating(calculatorId, starValue);
    saveUserRatingToStorage(calculatorId, starValue);
    showThankYouMessage();
  };

  // Render interactive stars
  const renderStars = () => {
    const stars = [];
    // Display average rating after voting, or hover state / average before voting
    const displayRating = hasRated ? rating.averageRating : (hoveredStar || rating.averageRating);

    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= displayRating;
      const isHovered = !hasRated && i <= hoveredStar;

      stars.push(
        <Button
          key={i}
          variant="ghost"
          size="sm"
          className={`p-1 h-auto ${hasRated ? 'cursor-default' : 'cursor-pointer'} relative`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarMouseEnter(i, hasRated)}
          onMouseLeave={() => handleStarMouseLeave(hasRated)}
          disabled={hasRated || isLoading}
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              isFilled || isHovered
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            }`}
          />
        </Button>
      );
    }

    return stars;
  };

  return (
    <div className={className}>
      {/* Main row - stars + counter on the right */}
      <div className="flex items-center justify-between relative">
        <div
          className="flex items-center"
          onMouseEnter={() => hasRated && setShowTooltip(true)}
          onMouseLeave={() => hasRated && setShowTooltip(false)}
        >
          {renderStars()}
        </div>

        {/* Average rating and review count */}
        {rating.averageRating > 0 && (
          <div className="text-sm text-muted-foreground ml-3">
            {rating.averageRating.toFixed(1)} ({rating.reviewCount})
          </div>
        )}

        {/* Tooltip for already rated users */}
        {hasRated && showTooltip && (
          <div className="absolute top-8 left-0 px-3 py-2 bg-foreground text-background text-sm rounded-md shadow-xl z-50 whitespace-nowrap">
            {t('rating.already_rated')}
            <div className="absolute -top-1 left-4 w-2 h-2 bg-foreground transform rotate-45"></div>
          </div>
        )}
      </div>

      {/* Thank you message and call-to-action texts */}
      {showThankYou && (
        <div
          className="mt-1 text-xs text-green-600 transition-opacity duration-1000"
          style={{ opacity: isThankYouFading ? 0 : 1 }}
        >
          {t('rating.thank_you')}
        </div>
      )}
      {!hasRated && rating.averageRating === 0 && (
        <div className="mt-1 text-xs text-muted-foreground">
          {t('rating.no_reviews')}
        </div>
      )}
    </div>
  );
};

export default CalculatorRating;
