'use client';

import React from 'react';
import Link from 'next/link';
import { CardContent } from '@/components/ui/Card';
import GlassCard from '@/components/shared/GlassCard';
import { Button } from '@/components/ui/Button';
import { getCategoryBranding } from '@/config/category-branding';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface CategoryCardProps {
    category: {
        id: string;
        title: string;
        count: number;
    };
    locale: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, locale }) => {
    const t = useTranslations();
    const branding = getCategoryBranding(category.id);
    const Icon = branding.icon;

    return (
        <Link href={`/${locale}/calculator/${category.id}`} className="block h-full group">
            <GlassCard
                className="text-center h-full cursor-pointer group-hover:border-primary/30 transition-all duration-300"
                hoverEffect
            >
                <CardContent className="pt-8 pb-8 h-full flex flex-col items-center">
                    <div className={cn(
                        "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 duration-300",
                        branding.bgColor,
                        branding.color
                    )}>
                        <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 font-heading">{category.title}</h3>
                    <p className="text-muted-foreground mb-6">
                        {category.count} {t('common.calculators') || 'calculators'}
                    </p>
                    <div className="mt-auto w-full">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 text-primary hover:bg-primary/20 pointer-events-none"
                        >
                            {t('common.explore') || 'Explore'}
                        </Button>
                    </div>
                </CardContent>
            </GlassCard>
        </Link>
    );
};

export default CategoryCard;
