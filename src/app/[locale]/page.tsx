"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Calculator, Percent, Scale, TrendingUp, Search, ArrowRight, Users, Shield, Heart, Star } from 'lucide-react';
import AdBanner from '@/components/ads/AdBanner';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import CalculatorRating from '@/components/calculators/shared/CalculatorRating';
import FAQSection from '@/components/calculators/enhanced/FAQSection';
import calculatorsJson from '@/data/calculators.json';
import PanelHeader from '@/components/ui/PanelHeader';
import CategoryCard from '@/components/home/CategoryCard';
import Footer from '@/components/navigation/Footer';

const HomePage: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = (params as any)?.locale as string || 'cs';
  const [searchQuery, setSearchQuery] = useState('');

  // Apply full-page enhanced background like BMI v3
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('force-enhanced-bg');
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('force-enhanced-bg');
      }
    };
  }, []);

  // Derive featured calculators from data to match BMI v3
  const calculators = Object.values((calculatorsJson as any).calculators || {}) as Array<any>;
  const calculatorsById: Record<string, any> = calculators.reduce((acc, c) => {
    acc[c.id] = c;
    return acc;
  }, {} as Record<string, any>);

  const iconComponentForCalculator = (id: string): React.ElementType => {
    switch (id) {
      case 'percentage':
        return Percent;
      case 'bmi':
        return Scale;
      case 'vat':
        return TrendingUp;
      default:
        return Calculator;
    }
  };

  const headerStyleForCalculator = (id: string) => {
    // Map calc id to PanelHeader color/variant to mirror BMI v3 palette
    if (id === 'bmi') return { color: 'purple' as const, variant: 'purple' as const };
    if (id === 'vat') return { color: 'green' as const, variant: 'green' as const };
    return { color: 'blue' as const, variant: 'blue' as const };
  };

  const featuredIds = ['percentage', 'bmi', 'vat'];
  const featuredCalculators = featuredIds
    .map((id) => calculatorsById[id])
    .filter(Boolean)
    .map((c) => ({
      id: c.id as string,
      name: t(c.titleKey as string),
      description: t(c.descriptionKey as string),
      Icon: iconComponentForCalculator(c.id),
      href: `/${locale}${c.path}`
    }));

  // Calculator categories derived from data
  const mathCount = calculators.filter((c) => c.category === 'math').length;
  const healthCount = calculators.filter((c) => c.category === 'health').length;
  const financeCount = calculators.filter((c) => c.category === 'finance').length;
  const calculatorCategories = [
    {
      key: 'mathematics',
      name: t('categories.mathematics'),
      Icon: Calculator,
      count: mathCount || 0,
      color: 'blue' as const,
      variant: 'blue' as const,
    },
    {
      key: 'health',
      name: t('categories.health'),
      Icon: Heart,
      count: healthCount || 0,
      color: 'amber' as const,
      variant: 'amber' as const,
    },
    {
      key: 'finance',
      name: t('categories.finance'),
      Icon: TrendingUp,
      count: financeCount || 0,
      color: 'green' as const,
      variant: 'green' as const,
    }
  ];

  // FAQ items
  const faqItems = [
    {
      question: t('homepage.faq_privacy_q'),
      answer: t('homepage.faq_privacy_a')
    },
    {
      question: t('homepage.faq_free_q'),
      answer: t('homepage.faq_free_a')
    },
    {
      question: t('homepage.faq_accuracy_q'),
      answer: t('homepage.faq_accuracy_a')
    },
    {
      question: t('homepage.faq_mobile_q'),
      answer: t('homepage.faq_mobile_a')
    }
  ];

  const scrollToCalculators = () => {
    const element = document.getElementById('calculators');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };



  return (
    <div className="relative min-h-screen">
      <div className="enhanced-page-bg" aria-hidden="true" />
      <div className="relative z-10">
      {/* Header Ad Banner */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdBanner 
            placement="header" 
            className="py-2 min-h-[60px]"
          />
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-16 lg:pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 enhanced-gradient-text">
              {t('homepage.title')}
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              {t('homepage.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                onClick={scrollToCalculators}
              >
                {t('homepage.cta_button')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('homepage.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 pr-4 text-gray-700 bg-white/80 backdrop-blur-sm border border-white/60 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Most Popular Calculators */}
      <section id="calculators" className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 enhanced-gradient-text">
              {t('homepage.popular_calculators')}
            </h2>
            <p className="text-lg text-gray-600">{t('homepage.popular_tagline')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCalculators.map((calc) => (
              <Link key={calc.id} href={calc.href} className="group">
                <Card className="h-full enhanced-card bg-white/70 backdrop-blur-md border border-white/60 hover:border-blue-300 transition-all duration-200 group-hover:scale-[1.02] pt-0">
                  {(() => {
                    const { color, variant } = headerStyleForCalculator(calc.id);
                    return (
                      <PanelHeader
                        title={calc.name}
                        icon={calc.Icon}
                        color={color}
                        variant={variant}
                        right={<CalculatorRating calculatorId={calc.id} variant="view" className="pointer-events-none" />}
                        titleClassName="text-xl"
                        className="rounded-t-xl"
                      />
                    );
                  })()}
                  <CardContent className="pt-5 pb-6 flex-1 flex flex-col gap-4 min-h-[120px] sm:min-h-[110px]">
                    <CardDescription>{calc.description}</CardDescription>
                    <div className="mt-auto flex items-center text-blue-600 font-medium">
                      <span>{t('homepage.try_it_now')}</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sidebar Ad Banner - Desktop Only */}
      <div className="hidden lg:block fixed right-4 top-1/2 transform -translate-y-1/2 z-10">
        <AdBanner 
          placement="sidebar" 
          className="w-48 min-h-[300px]"
        />
      </div>

      {/* Calculator Categories */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 enhanced-gradient-text">
              {t('homepage.calculator_categories')}
            </h2>
            <p className="text-lg text-gray-600">{t('homepage.categories_tagline')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculatorCategories.map((category, index) => (
              <CategoryCard
                key={index}
                title={category.name}
                icon={category.Icon}
                color={category.color}
                variant={category.variant}
                countLabel={t('homepage.calculators_available', { count: category.count })}
                ctaLabel={t('homepage.explore_category')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8 enhanced-gradient-text">
              {t('homepage.trusted_by')}
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mb-8">
              <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md px-5 py-4 md:px-6 md:py-5 rounded-xl border border-white/60 enhanced-card">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{t('homepage.user_count')}</div>
                  <div className="text-gray-600">{t('homepage.active_users_label')}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md px-5 py-4 md:px-6 md:py-5 rounded-xl border border-white/60 enhanced-card">
                <Star className="h-8 w-8 text-yellow-500 fill-current" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">4.8/5</div>
                  <div className="text-gray-600">{t('homepage.average_rating_label')}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md px-5 py-4 md:px-6 md:py-5 rounded-xl border border-white/60 enhanced-card">
                <Shield className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-gray-600">{t('homepage.secure_private_label')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (restore section headline; panel uses enhanced styles, BMI v3 spacing) */}
      <section className="py-16 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 enhanced-gradient-text">
              {t('homepage.faq_title')}
            </h2>
            <p className="text-lg text-gray-600">{t('homepage.common_questions_tagline')}</p>
          </div>
          <FAQSection 
            faqItems={faqItems} 
            className="enhanced-card bg-white/70 backdrop-blur-md border border-white/60"
            hideHeader
          />
        </div>
      </section>

      {/* Footer (wrapped to match main content max width) */}
      <div className="max-w-7xl mx-auto">
        <Footer />
      </div>

      {/* Sticky Bottom Ad (Mobile) - aligned with calculators layout */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-center p-2">
          <AdBanner 
            placement="sticky-bottom" 
            className="w-[320px] h-[50px]"
          />
        </div>
      </div>
      </div>
    </div>
  );
};

export default HomePage;
