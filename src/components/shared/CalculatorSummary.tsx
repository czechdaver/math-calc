'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { getAllCategoriesWithCalculators } from '@/lib/calculatorDataUtils';
import { getCategoryBranding } from '@/config/category-branding';
import { cn } from '@/lib/utils';

const CalculatorSummary: React.FC = () => {
    const t = useTranslations();
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'cs';

    const categories = getAllCategoriesWithCalculators(locale, t);

    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* SEO Heading */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                        {t('homepage.calculator_summary_title')}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        {t('homepage.calculator_summary_description')}
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category) => {
                        const branding = getCategoryBranding(category.id);
                        const Icon = branding.icon;

                        return (
                            <div key={category.id} className="space-y-3">
                                {/* Category Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className={cn(
                                            'w-10 h-10 rounded-xl flex items-center justify-center',
                                            branding.bgColor,
                                            branding.color
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold font-heading text-foreground">
                                        {category.title}
                                    </h3>
                                </div>

                                {/* Calculator Links */}
                                <ul className="space-y-2 pl-1">
                                    {category.calculators.map((calc) => (
                                        <li key={calc.id}>
                                            <Link
                                                href={`/${locale}${calc.path}`}
                                                className="group flex items-start gap-2 py-1.5 text-sm hover:text-primary transition-colors"
                                            >
                                                <span className="text-primary/50 group-hover:text-primary transition-colors mt-0.5">›</span>
                                                <span>
                                                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                        {t(`${calc.id.replace(/-/g, '_')}_calculator_title`)}
                                                    </span>
                                                    <span className="text-muted-foreground ml-1.5 hidden sm:inline">
                                                        — {t(`${calc.id.replace(/-/g, '_')}_calculator_description`)}
                                                    </span>
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CalculatorSummary;
