import React from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { getAllCategoriesWithCalculators } from '@/lib/calculatorDataUtils';
import CalculatorsFilterableList from '@/components/calculators/CalculatorsFilterableList';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import AdBanner from '@/components/ads/AdBanner';

interface CalculatorsPageProps {
    params: Promise<{
        locale: string;
        category: string;
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
                    <p className="text-xl text-muted-foreground max-w-2xl mb-8">
                        {t('common.all_calculators_description')}
                    </p>
                </div>

                {/* Header Ad */}
                <div className="flex justify-center mb-16">
                    <AdBanner
                        placement="header"
                        className="w-full max-w-[970px] h-[90px] md:h-[120px] rounded-xl overflow-hidden shadow-sm"
                    />
                </div>

                {/* Filterable List */}
                <CalculatorsFilterableList
                    initialCategories={categories}
                    locale={locale}
                />

                {/* Sticky Bottom Ad */}
                <div className="flex justify-center mt-16">
                    <AdBanner
                        placement="sticky-bottom"
                        className="w-full max-w-[320px] md:max-w-[728px] h-[50px] md:h-[90px] shadow-sm"
                    />
                </div>
            </div>
        </div>
    );
}
