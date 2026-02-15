'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Calculator, Star, ArrowRight } from 'lucide-react';
import GlassCard from '@/components/shared/GlassCard';
import { CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { useRatingData } from '@/hooks/useRatingData';
import { RelatedCalculator } from '@/lib/calculatorDataUtils';

interface CalculatorCardProps {
    calculator: RelatedCalculator;
    showRating?: boolean;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({
    calculator,
    showRating = true
}) => {
    const t = useTranslations();
    const { rating, loadRatingData } = useRatingData();

    useEffect(() => {
        if (showRating) {
            loadRatingData(calculator.id);
        }
    }, [calculator.id, showRating]);

    // Determine if popular based on popularity score (standard is > 80)
    const isPopular = calculator.popularity > 80;

    return (
        <Link href={calculator.href} className="group h-full block">
            <GlassCard hoverEffect className="h-full bg-white/60 dark:bg-slate-900/60 border-primary/10 py-6 transition-all duration-300">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                                <Calculator className="w-5 h-5" />
                            </div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {calculator.title}
                            </CardTitle>
                        </div>

                        {/* Popular Badge */}
                        {isPopular && (
                            <div className="flex items-center text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full ring-1 ring-amber-500/20">
                                <Star className="h-3 w-3 fill-current" />
                                <span className="ml-1 text-xs font-bold">Popular</span>
                            </div>
                        )}
                    </div>
                </CardHeader>

                <CardContent>
                    <CardDescription className="text-sm mb-4 line-clamp-2 min-h-[40px]">
                        {calculator.description}
                    </CardDescription>

                    <div className="flex flex-col gap-4 mt-auto">
                        {/* Dynamic Rating Display */}
                        {showRating && rating.averageRating > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-3.5 h-3.5 ${star <= Math.round(rating.averageRating)
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-muted-foreground/20"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <div className="text-xs font-medium text-muted-foreground">
                                    <span className="text-foreground font-bold">{rating.averageRating}</span>
                                    <span className="mx-1">•</span>
                                    <span>{rating.reviewCount} {t('rating.reviews_count_suffix') || 'reviews'}</span>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center text-primary text-sm font-medium group-hover:underline decoration-2 underline-offset-4 pt-2">
                            <span>{t('common.calculate')}</span>
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </CardContent>
            </GlassCard>
        </Link>
    );
};

export default CalculatorCard;
