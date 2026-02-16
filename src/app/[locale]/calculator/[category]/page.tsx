import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { getCategoryById, getCalculatorCategories } from '@/lib/calculatorDataUtils';
import GlassCard from '@/components/shared/GlassCard';
import { CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calculator, Star } from 'lucide-react';
import { getCategoryBranding } from '@/config/category-branding';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

interface CategoryPageProps {
    params: Promise<{
        locale: string;
        category: string;
    }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
    const { locale, category } = await params;
    const t = await getTranslations({ locale, namespace: 'common' });
    const categoryData = getCategoryById(category, locale, (key) => t(key));

    if (!categoryData) {
        return {
            title: 'Category Not Found',
        };
    }

    return {
        title: `${categoryData.title} Calculators - MathCalc Pro`,
        description: categoryData.description,
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { locale, category } = await params;
    const t = await getTranslations({ locale });

    const categoryData = getCategoryById(category, locale, t);

    if (!categoryData) {
        notFound();
    }

    const branding = getCategoryBranding(categoryData.id);
    const CategoryIcon = branding.icon;

    return (
        <div className="min-h-screen bg-transparent pt-20 pb-12">
            {/* Ambient Background */}
            <div className="fixed top-0 left-0 right-0 h-[500px] pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 to-transparent" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb / Back Link */}
                <Breadcrumbs
                    items={[
                        { label: t('common.all_calculators'), href: `/${locale}/calculators` },
                        { label: categoryData.title }
                    ]}
                    homeHref={`/${locale}`}
                />

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                    <div className={`p-3 rounded-2xl ${branding.bgColor} ${branding.color}`}>
                        <CategoryIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-3">
                            {categoryData.title}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl">
                            {categoryData.description}
                        </p>
                    </div>
                </div>

                {/* Calculator Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {categoryData.calculators.map((calc) => (
                        <Link key={calc.id} href={`/${locale}${calc.path}`} className="group h-full">
                            <GlassCard hoverEffect className="h-full bg-white/60 dark:bg-slate-900/60 border-primary/10 py-6">
                                <CardHeader>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                <Calculator className="w-5 h-5" />
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

                {/* SEO Text Section (Placeholder for now, populated via translations) */}
                <div className="prose dark:prose-invert max-w-none bg-muted/30 p-8 rounded-2xl mb-16">
                    <h3>{t('common.about_category')} {categoryData.title}</h3>
                    <p>{t(`category_${categoryData.id}_long_description`)}</p>
                </div>

                {/* Other Categories Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">{t('common.other_categories')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {getCalculatorCategories(locale, t)
                            .filter(c => c.id !== category)
                            .map(cat => {
                                const catBranding = getCategoryBranding(cat.id);
                                const CatIcon = catBranding.icon;
                                return (
                                    <Link key={cat.id} href={`/${locale}/calculator/${cat.id}`} className="block group">
                                        <div className={`p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/50 transition-all flex items-center gap-4`}>
                                            <div className={`p-2 rounded-lg ${catBranding.bgColor} ${catBranding.color}`}>
                                                <CatIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{cat.title}</h3>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
}
