'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import SimpleBadge from '@/components/shared/SimpleBadge';

interface RelatedCalculator {
    id: string;
    title: string;
    description: string;
    href: string;
    category: string;
}

interface RelatedCalculatorsProps {
    calculatorId: string;
    locale: string;
    currentCategory?: string;
}

const RelatedCalculators: React.FC<RelatedCalculatorsProps> = ({
    calculatorId,
    locale,
    currentCategory
}) => {
    const t = useTranslations();
    const [calculators, setCalculators] = useState<RelatedCalculator[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/related-calculators?id=${calculatorId}&locale=${locale}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch related calculators');
                }

                const data = await response.json();
                setCalculators(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load related calculators');
            } finally {
                setLoading(false);
            }
        };

        if (calculatorId) {
            fetchRelated();
        }
    }, [calculatorId, locale]);

    if (loading) {
        return (
            <div className="space-y-6 pt-8 border-t border-border/40">
                <div className="h-8 w-48 bg-muted/40 rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 bg-muted/20 rounded-xl animate-pulse border border-border/40" />
                    ))}
                </div>
            </div>
        );
    }

    if (error || calculators.length === 0) {
        return null;
    }

    const getCategoryColor = (cat: string) => {
        // Simple mapping based on category string content
        const lowerCat = cat.toLowerCase();
        if (lowerCat.includes('financ') || lowerCat.includes('peníze')) return "bg-emerald-500/10 text-emerald-600 border-emerald-200/50";
        if (lowerCat.includes('health') || lowerCat.includes('zdraví')) return "bg-rose-500/10 text-rose-600 border-rose-200/50";
        if (lowerCat.includes('math') || lowerCat.includes('matematika')) return "bg-indigo-500/10 text-indigo-600 border-indigo-200/50";
        if (lowerCat.includes('construction') || lowerCat.includes('stavba')) return "bg-amber-500/10 text-amber-600 border-amber-200/50";
        return "bg-primary/5 text-primary border-primary/10";
    };

    return (
        <div className="space-y-8 pt-12 border-t border-border/40">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold tracking-tight text-foreground relative inline-block">
                    {t('common.related_calculators')}
                    <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-primary/30 rounded-full" />
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {calculators.map((calc, index) => (
                    <motion.div
                        key={calc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <Link href={calc.href} className="group block h-full">
                            <div className="relative h-full overflow-hidden rounded-2xl border border-border/50 bg-background/40 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1">
                                {/* Decorative gradient blob */}
                                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

                                <div className="p-6 flex flex-col h-full relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <SimpleBadge
                                            variant="outline"
                                            className={cn("text-xs font-medium border", getCategoryColor(calc.category))}
                                        >
                                            {calc.category}
                                        </SimpleBadge>

                                        <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                            <ArrowRight className="w-4 h-4 -ml-0.5 group-hover:ml-0.5 transition-all" />
                                        </div>
                                    </div>

                                    <h4 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                        {calc.title}
                                    </h4>

                                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-grow">
                                        {calc.description}
                                    </p>

                                    <div className="pt-4 mt-auto border-t border-border/30 flex items-center text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                                        <span>Vypočítat</span>
                                        <ExternalLink className="w-3 h-3 ml-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RelatedCalculators;
