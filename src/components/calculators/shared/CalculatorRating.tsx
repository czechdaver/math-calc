// src/components/calculators/shared/CalculatorRating.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useRatingData } from '@/hooks/useRatingData';
import { useUserRating } from '@/hooks/useUserRating';
import { useStarInteraction } from '@/hooks/useStarInteraction';
import { useThankYouMessage } from '@/hooks/useThankYouMessage';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip';

export interface CalculatorRatingProps {
  calculatorId: string;
  className?: string;
}

/**
 * CalculatorRating component - displays interactive star rating for calculators.
 * rededigned with Framer Motion for smooth animations and glassmorphism feel.
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
  const { hoveredStar, handleStarMouseEnter, handleStarMouseLeave } = useStarInteraction();
  const { showThankYou, showThankYouMessage } = useThankYouMessage();

  // Load data and check user rating on mount
  useEffect(() => {
    loadRatingData(calculatorId);
    checkUserRating(calculatorId);
  }, [calculatorId]);

  // Handle star click - save to API and localStorage
  const handleStarClick = async (starValue: number) => {
    if (hasRated || isLoading) return;

    // Optimistic UI update could be added here if needed, 
    // but the hooks handle the flow well enough.
    await saveRating(calculatorId, starValue);
    saveUserRatingToStorage(calculatorId, starValue);
    showThankYouMessage();
  };

  // Render interactive stars
  const renderStars = () => {
    const stars = [];
    // Display average rating after voting, or hover state / average before voting
    // If not rated and hovering, show hover state. Otherwise show average (or user rating if just rated, but logic implies average updates).
    // Actually, `rating.averageRating` is from server. If user JUST rated, `saveRating` updates it.

    const displayRating = (hasRated || hoveredStar === 0) ? rating.averageRating : hoveredStar;
    const isInteractive = !hasRated && !isLoading;

    for (let i = 1; i <= 5; i++) {
      // Logic for filling stars:
      // If interactive (hovering), fill up to hoveredStar.
      // If displaying average (static), fill if i <= displayRating (rounded?).
      // Let's stick to the previous logic which was solid:
      // const isFilled = i <= displayRating;
      // But we can improve partial stars if we wanted, for now full stars are fine.

      const isFilled = i <= Math.round(displayRating);
      const isHovered = !hasRated && i <= hoveredStar;

      // Determine color
      let starColorClass = "text-muted-foreground/40"; // Empty state
      if (isFilled && !isHovered) {
        starColorClass = "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_2px_rgba(250,204,21,0.4)]";
      } else if (isHovered) {
        starColorClass = "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.6)]";
      }

      stars.push(
        <motion.button
          key={i}
          whileHover={isInteractive ? { scale: 1.2 } : {}}
          whileTap={isInteractive ? { scale: 0.9 } : {}}
          className={cn(
            "p-1 focus:outline-none transition-colors",
            !isInteractive && "cursor-default"
          )}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarMouseEnter(i, hasRated)}
          onMouseLeave={() => handleStarMouseLeave(hasRated)}
          disabled={!isInteractive}
          aria-label={`Rate ${i} stars`}
        >
          <Star
            className={cn(
              "w-5 h-5 transition-all duration-200",
              starColorClass
            )}
            strokeWidth={1.5}
          />
        </motion.button>
      );
    }

    return stars;
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-1", className)}>
      <div className="flex items-center gap-1 relative">
        {/* Stars Container */}
        <div className="flex items-center">
          {hasRated ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex cursor-help">
                    {renderStars()}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('rating.already_rated')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            renderStars()
          )}
        </div>

        {/* Rating Value / Review Count Pill */}
        {rating.averageRating > 0 && (
          <div className="ml-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/40 border border-border/50 text-xs font-medium text-muted-foreground/80">
            <span>{rating.averageRating.toFixed(1)}</span>
            <span className="w-0.5 h-2.5 bg-border/80 rounded-full"></span>
            <span>({rating.reviewCount})</span>
          </div>
        )}
      </div>

      {/* Animated Feedback Messages */}
      <div className="h-4 relative w-full flex justify-center overflow-visible">
        <AnimatePresence mode="wait">
          {showThankYou ? (
            <motion.span
              key="thank-you"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute text-xs font-medium text-emerald-500"
            >
              {t('rating.thank_you')}
            </motion.span>
          ) : (
            !hasRated && rating.averageRating === 0 && (
              <motion.span
                key="no-reviews"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute text-[10px] text-muted-foreground/60"
              >
                {t('rating.no_reviews')}
              </motion.span>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CalculatorRating;
