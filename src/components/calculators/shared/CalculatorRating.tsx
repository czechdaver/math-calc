'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
// Card removed for cleaner design
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

interface CalculatorRatingProps {
  calculatorId: string;
  className?: string;
}

interface RatingData {
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

const CalculatorRating: React.FC<CalculatorRatingProps> = ({ 
  calculatorId, 
  className = '' 
}) => {
  const t = useTranslations();
  const [rating, setRating] = useState<RatingData>({
    averageRating: 0,
    reviewCount: 0
  });
  const [userRating, setUserRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showThankYou, setShowThankYou] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [isThankYouFading, setIsThankYouFading] = useState<boolean>(false);

  // Klíč pro localStorage (jen pro kontrolu, zda už uživatel hodnotil)
  const userRatingKey = `user_rating_${calculatorId}`;

  // Načtení dat při inicializaci
  useEffect(() => {
    loadRatingData();
    checkUserRating();
  }, [calculatorId]);

  // Načtení hodnocení ze serveru
  const loadRatingData = async () => {
    try {
      const response = await fetch('/api/ratings');
      if (response.ok) {
        const data = await response.json();
        const calculatorRatings = data.ratings[calculatorId];
        
        if (calculatorRatings) {
          // Výpočet průměru a celkového počtu z counterů
          const totalCount = Object.values(calculatorRatings as RatingCounters).reduce((sum: number, count: number) => sum + count, 0);
          const weightedSum = Object.entries(calculatorRatings as RatingCounters).reduce(
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

  // Kontrola, zda už uživatel hodnotil (localStorage)
  const checkUserRating = () => {
    try {
      const userRated = localStorage.getItem(userRatingKey);
      if (userRated) {
        setHasRated(true);
        setUserRating(parseInt(userRated, 10));
      }
    } catch (error) {
      console.error('Error checking user rating:', error);
    }
  };

  // Uložení hodnocení na server
  const saveRating = async (newUserRating: number) => {
    if (isLoading || hasRated) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          calculatorId,
          rating: newUserRating
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Aktualizace lokálního stavu
        setRating({
          averageRating: result.averageRating,
          reviewCount: result.totalCount
        });
        
        // Označení, že uživatel už hodnotil (localStorage)
        localStorage.setItem(userRatingKey, newUserRating.toString());
        setUserRating(newUserRating);
        setHasRated(true);
        
        // Zobrazit poděkování na 4 sekundy s fade-out
        setShowThankYou(true);
        setIsThankYouFading(false);
        
        // Začít fade-out po 3 sekundách
        setTimeout(() => {
          setIsThankYouFading(true);
        }, 3000);
        
        // Skrýt komponentu po 4 sekundách
        setTimeout(() => {
          setShowThankYou(false);
          setIsThankYouFading(false);
        }, 4000);
      } else {
        console.error('Failed to save rating');
      }
    } catch (error) {
      console.error('Error saving rating:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Zpracování kliknutí na hvězdičku
  const handleStarClick = (starValue: number) => {
    if (hasRated) return; // Ochrana proti opakovanému hodnocení
    saveRating(starValue);
  };

  // Zobrazení hvězdiček
  const renderStars = () => {
    const stars = [];
    // Po hlasování zobrazit průměr, před hlasováním hover nebo průměr
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
          onMouseEnter={() => {
            if (!hasRated) {
              setHoveredStar(i);
            }
          }}
          onMouseLeave={() => {
            if (!hasRated) {
              setHoveredStar(0);
            }
          }}
          disabled={hasRated || isLoading}
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              isFilled || isHovered
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />

        </Button>
      );
    }

    return stars;
  };

  return (
    <div className={`${className}`}>
      {/* Hlavní řádek - hvězdičky + counter vpravo */}
      <div className="flex items-center justify-between relative">
        <div 
          className="flex items-center"
          onMouseEnter={() => hasRated && setShowTooltip(true)}
          onMouseLeave={() => hasRated && setShowTooltip(false)}
        >
          {renderStars()}
        </div>
        
        {/* Counter průměru a počtu hlasů vpravo */}
        {rating.averageRating > 0 && (
          <div className="text-sm text-gray-600 ml-3">
            {rating.averageRating.toFixed(1)} ({rating.reviewCount})
          </div>
        )}
        
        {/* Tooltip pro již hodnocené - jednodušší pozicování */}
        {hasRated && showTooltip && (
          <div className="absolute top-8 left-0 px-3 py-2 bg-black text-white text-sm rounded-md shadow-xl z-50 whitespace-nowrap">
            {t('rating.already_rated')}
            <div className="absolute -top-1 left-4 w-2 h-2 bg-black transform rotate-45"></div>
          </div>
        )}
      </div>
      
      {/* Call to action texty dole */}
      {showThankYou && (
        <div 
          className="mt-1 text-xs text-green-600 transition-opacity duration-1000"
          style={{ opacity: isThankYouFading ? 0 : 1 }}
        >
          {t('rating.thank_you')}
        </div>
      )}
      {!hasRated && rating.averageRating === 0 && (
        <div className="mt-1 text-xs text-gray-500">
          {t('rating.no_reviews')}
        </div>
      )}
    </div>
  );
};

export default CalculatorRating;
