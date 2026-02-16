import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { getAllCategoriesWithCalculators } from '@/lib/calculatorDataUtils';
import GlassCard from '@/components/shared/GlassCard';
import { CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { ArrowLeft, Calculator, Star, TrendingUp, Heart, Ruler, Percent, Briefcase, Settings, HelpCircle, Hammer, DollarSign } from 'lucide-react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

interface CalculatorsPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export async function generateMetadata({ params }: CalculatorsPageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale });

    return {
        title: `${t('common.all_calculators')} - MathCalc Pro`,
        description: t('common.all_calculators_description'),
    };
}

export default async function CalculatorsPage({ params }: CalculatorsPageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    const tCommon = await getTranslations({ locale, namespace: 'common' });

    const categories = getAllCategoriesWithCalculators(locale, tCommon);

    const getCategoryIcon = (iconName: string) => {
        switch (iconName) {
            case 'TrendingUp': return <TrendingUp className="w-8 h-8" />;
            case 'Heart': return <Heart className="w-8 h-8" />;
            case 'Calculator': return <Calculator className="w-8 h-8" />;
            case 'Hammer': return <Hammer className="w-8 h-8" />;
            case 'Briefcase': return <Briefcase className="w-8 h-8" />;
            case 'Settings': return <Settings className="w-8 h-8" />;
            case 'DollarSign': return <DollarSign className="w-8 h-8" />;
            case 'HelpCircle': return <HelpCircle className="w-8 h-8" />;
            default: return <Percent className="w-8 h-8" />;
        }
    };

    return (
        <div className="min-h-screen bg-transparent pt-20 pb-12">
            {/* Ambient Background */}
            <div className="fixed top-0 left-0 right-0 h-[500px] pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 to-transparent" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb / Back Link */}
                <Breadcrumbs
                    items={[{ label: t('common.all_calculators') }]}
                    homeHref={`/${locale}`}
                />

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-3">
                        {t('common.all_calculators')}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        {t('common.all_calculators_description')}
                    </p>
                </div>

                {/* Categories List */}
                <div className="space-y-16">
                    {categories.map((category) => (
                        <div key={category.id} id={category.id} className="scroll-mt-24">
                            <Link
                                href={`/${locale}/calculator/${category.id}`}
                                className="inline-flex items-center gap-4 mb-6 group transition-colors hover:text-primary"
                            >
                                <div className={`p-3 rounded-2xl ${category.bgColor} ${category.color} group-hover:scale-110 transition-transform`}>
                                    {getCategoryIcon(category.icon)}
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
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
