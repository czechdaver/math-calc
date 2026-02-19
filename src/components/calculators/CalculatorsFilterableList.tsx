"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { QuickLinkCategory } from '@/lib/calculatorDataUtils';
import CalculatorSearch from '@/components/search/CalculatorSearch';
import GlassCard from '@/components/shared/GlassCard';
import { CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Calculator as CalcIcon, Star } from 'lucide-react';
import { getCategoryBranding } from '@/config/category-branding';

interface CalculatorsFilterableListProps {
    initialCategories: QuickLinkCategory[];
    locale: string;
}

const CalculatorsFilterableList: React.FC<CalculatorsFilterableListProps> = ({
    initialCategories,
    locale
}) => {
    const t = useTranslations();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) {
            return initialCategories;
        }

        const query = searchQuery.toLowerCase().trim();

        return initialCategories.map(category => {
            // Check if title matches
            const titleMatch = category.title.toLowerCase().includes(query);

            // Filter calculators
            const filteredCalculators = category.calculators.filter(calc => {
                const calcTitle = t(calc.titleKey).toLowerCase();
                const calcDesc = t(calc.descriptionKey).toLowerCase();
                const tags = calc.tags ? calc.tags.join(' ').toLowerCase() : '';

                // Check alias keys
                let aliasMatch = false;
                if (calc.aliasKeys && calc.aliasKeys.length > 0) {
                    aliasMatch = calc.aliasKeys.some(key => t(key).toLowerCase().includes(query));
                }

                return calcTitle.includes(query) ||
                    calcDesc.includes(query) ||
                    tags.includes(query) ||
                    aliasMatch;
            });

            // If category title matches, show all its calculators (unless we want strict filtering)
            // Ideally, if category matches, we might want to show all, OR just show matching calculators.
            // Let's stick to showing matching calculators, but if category matches, maybe we should show all?
            // User said: "start to filter calculators and categories".
            // If I search "Finance", I expect to see the finance category.
            // If I search "Loan", I expect to see loan calculator.

            // Current approach:
            // 1. If category title matches query, include the category with ALL calculators? 
            //    Or maybe just include it even if 0 calculators match (but then it's empty).
            // 2. If calculators match, include the category with those calculators.

            // Let's go with: Include category if title matches OR if it has matching calculators.
            // If title matches but no calculators match, show all calculators? Or just show the empty category? 
            // "Filter calculators and categories" implies if category matches, show it.

            if (titleMatch) {
                // If category matches, show all its calculators
                return {
                    ...category,
                    calculators: category.calculators
                };
            }

            // Otherwise return category with only matching calculators
            return {
                ...category,
                calculators: filteredCalculators
            };
        }).filter(category => category.calculators.length > 0);
    }, [initialCategories, searchQuery, t]);

    return (
        <div className="space-y-12">
            <div className="max-w-xl">
                <CalculatorSearch
                    onSearch={setSearchQuery}
                    hideDropdown={true}
                    className="mx-0" // Left align override
                    placeholder={t('common.search_calculators')}
                />
            </div>

            {/* Categories List */}
            <div className="space-y-16">
                {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => {
                        const branding = getCategoryBranding(category.id);
                        const CategoryIcon = branding.icon;

                        return (
                            <div key={category.id} id={category.id} className="scroll-mt-24">
                                <Link
                                    href={`/${locale}/calculator/${category.id}`}
                                    className="inline-flex items-center gap-4 mb-6 group transition-colors hover:text-primary"
                                >
                                    <div className={`p-3 rounded-2xl ${branding.bgColor} ${branding.color} group-hover:scale-110 transition-transform`}>
                                        <CategoryIcon className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-3xl font-bold font-heading group-hover:text-primary transition-colors">
                                        {category.title}
                                    </h2>
                                </Link>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {category.calculators.map((calc) => (
                                        <Link key={calc.id} href={`/${locale}${calc.path}`} className="group h-full">
                                            <GlassCard hoverEffect className="h-full bg-white/60 dark:bg-slate-900/60 border-primary/10 py-6">
                                                <CardHeader>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                                <CalcIcon className="w-5 h-5" />
                                                            </div>
                                                            <CardTitle className="text-lg">{calc.titleKey ? t(calc.titleKey) : calc.titleKey}</CardTitle>
                                                        </div>
                                                        {calc.popularity > 80 && (
                                                            <div className="flex items-center text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                                                <Star className="h-3 w-3 fill-current" />
                                                                <span className="ml-1 text-xs font-bold">{t('common.popular')}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <CardDescription className="text-sm mb-4 line-clamp-2">
                                                        {calc.descriptionKey ? t(calc.descriptionKey) : calc.descriptionKey}
                                                    </CardDescription>
                                                    <div className="flex items-center text-primary text-sm font-medium group-hover:underline decoration-2 underline-offset-4">
                                                        <span>{t('common.calculate')}</span>
                                                    </div>
                                                </CardContent>
                                            </GlassCard>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p className="text-xl">{t('common.no_results_found')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalculatorsFilterableList;
