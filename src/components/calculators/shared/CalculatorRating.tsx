// src/components/calculators/shared/CalculatorRating.tsx
'use client';

import React, { useEffect } from 'react';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      let starColorClass = "text-muted-foreground/30 stroke-muted-foreground/50"; // Empty state - better visibility
      if (isFilled && !isHovered) {
        // Rated state - bright yellow with soft glow and subtle stroke
        starColorClass = "text-yellow-400 fill-yellow-400 stroke-yellow-500 drop-shadow-[0_0_3px_rgba(250,204,21,0.5)]";
      } else if (isHovered) {
        // Hover state - brighter glow
        starColorClass = "text-yellow-400 fill-yellow-400 stroke-yellow-500 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)] scale-110";
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
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="flex items-center gap-1">
        {/* Stars Container */}
        <div
          className="flex items-center"
          onMouseLeave={() => handleStarMouseLeave(hasRated)}
        >
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
        <AnimatePresence>
          {rating.averageRating > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/50 border border-border/50 text-xs font-medium text-muted-foreground"
            >
              <span className="text-foreground">{rating.averageRating.toFixed(1)}</span>
              <span className="w-0.5 h-3 bg-border rounded-full"></span>
              <span>{rating.reviewCount}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animated Feedback Messages - Positioned inline or below depending on space */}
      <AnimatePresence mode="wait">
        {showThankYou ? (
          <motion.div
            key="thank-you"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-1 text-sm font-medium text-emerald-500"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {t('rating.thank_you')}
          </motion.div>
        ) : (
          !hasRated && rating.averageRating > 0 && (
            <motion.span
              key="cta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground/60 hidden sm:inline-block"
            >
              {t('rating.rate_this')}
            </motion.span>
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalculatorRating;
