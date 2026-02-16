"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { ArrowRight, Users, Shield, Star, ChevronDown } from 'lucide-react';
import { getCategoryBranding } from '@/config/category-branding';
import AdBanner from '@/components/ads/AdBanner';
import { Button } from '@/components/ui/Button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import GlassCard from '@/components/shared/GlassCard';
import CalculatorCard from '@/components/calculators/shared/CalculatorCard';
import CalculatorSearch from '@/components/search/CalculatorSearch';
import SimpleFAQ from '@/components/shared/SimpleFAQ'; // Importing the redesigned SimpleFAQ
import { cn } from '@/lib/utils';
import { getCalculatorCategories, getQuickLinks } from '@/lib/calculatorDataUtils';

const HomePage: React.FC = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'cs';
  const [isMounted, setIsMounted] = useState(false);

  // Only use for components that actually cause hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch data safely
  const popularCalculators = getQuickLinks('popular', locale, t).slice(0, 3);
  const categories = getCalculatorCategories(locale, t);

  // Map category IDs to icons and colors using centralized config


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
    <div className="min-h-screen bg-transparent">
      {/* Ambient Background */}
      <div className="fixed top-0 left-0 right-0 h-[800px] pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 to-transparent" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated blobs */}
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-color opacity-50" />
          <div className="absolute top-40 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-color opacity-50" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 backdrop-blur-sm">
              <Star className="mr-1 h-3 w-3 fill-current" />
              <span>{t('homepage.trusted_by')} 10k+ {t('homepage.user_count')}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground mb-6 leading-tight tracking-tight">
              {t('homepage.title')}
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light">
              {t('homepage.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-primary/25 transition-all"
                onClick={scrollToCalculators}
              >
                {t('homepage.cta_button')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Search Bar */}
            <CalculatorSearch />
          </div>
        </div>
      </section>

      {/* Header Ad Banner */}
      <div className="container mx-auto px-4 mb-16">
        <div className="flex justify-center">
          <AdBanner
            placement="header"
            className="py-2 min-h-[90px] w-full max-w-[728px] rounded-xl overflow-hidden shadow-sm"
          />
        </div>
      </div>

      {/* Most Popular Calculators */}
      <section id="calculators" className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
                {t('homepage.popular_calculators')}
              </h2>
              <p className="text-lg text-muted-foreground">Quick access to our most frequently used tools</p>
            </div>
            <Button variant="ghost" className="hidden md:flex group" onClick={() => window.location.href = `/${locale}/calculators`}>
              {t('common.view_all')} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCalculators.map((calc) => (
              <div key={calc.id} className="h-full">
                <CalculatorCard calculator={calc} />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" className="w-full" onClick={() => window.location.href = `/${locale}/calculators`}>
              {t('common.view_all')}
            </Button>
          </div>
        </div>
      </section>

      {/* Calculator Categories */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              {t('homepage.calculator_categories')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive collection of calculation tools organized by category
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const branding = getCategoryBranding(category.id);
              const Icon = branding.icon;

              return (
                <GlassCard
                  key={category.id}
                  className="text-center cursor-pointer group hover:border-primary/30 transition-all duration-300"
                  hoverEffect
                  onClick={() => window.location.href = `/${locale}/calculator/${category.id}`}
                >
                  <CardContent className="pt-8 pb-8">
                    <div className={cn(
                      "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 duration-300",
                      branding.bgColor,
                      branding.color
                    )}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                    <p className="text-muted-foreground mb-6">
                      {category.count} calculators
                    </p>
                    <Button variant="secondary" size="sm" className="w-full opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 text-primary hover:bg-primary/20">
                      Explore
                    </Button>
                  </CardContent>
                </GlassCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* Sidebar Ad Banner - Desktop Only - Floating */}
      <div className="hidden xl:block fixed right-6 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <AdBanner
            placement="sidebar"
            className="w-[160px] min-h-[600px] rounded-xl overflow-hidden shadow-lg"
          />
        </div>
      </div>

      {/* Features / Social Proof */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard className="text-center p-6 border-none bg-primary/5">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold mb-2">{t('homepage.user_count')}</div>
              <div className="text-muted-foreground font-medium uppercase tracking-wide text-sm">Active Users</div>
            </GlassCard>

            <GlassCard className="text-center p-6 border-none bg-primary/5">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold mb-2">4.8/5</div>
              <div className="text-muted-foreground font-medium uppercase tracking-wide text-sm">Average Rating</div>
            </GlassCard>

            <GlassCard className="text-center p-6 border-none bg-primary/5">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-muted-foreground font-medium uppercase tracking-wide text-sm">Secure & Private</div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              {t('homepage.faq_title')}
            </h2>
            <p className="text-lg text-muted-foreground">Common questions about our calculators</p>
          </div>

          {isMounted && (
            <SimpleFAQ faq={faqItems} className="bg-transparent" />
          )}
        </div>
      </section>

      {/* Footer Ad Banner */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <AdBanner
            placement="sticky-bottom"
            className="py-4 min-h-[100px] w-full max-w-[970px] rounded-xl overflow-hidden shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
