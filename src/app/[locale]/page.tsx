"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Calculator, Percent, Ruler, Scale, Droplets, Thermometer, Zap, TrendingUp, Shield, HelpCircle, ArrowRight } from 'lucide-react';
import AdBanner from '@/components/ads/AdBanner';
import { Button } from '@/components/ui/Button';

const HomePage: React.FC = () => {
  const t = useTranslations('common');

  // Categories data
  const categories = [
    {
      id: 'procenta',
      name: t('categories.percentages'),
      description: t('categories.percentages_description'),
      icon: <Percent className="w-8 h-8 text-blue-500" />,
      href: `/calculator/procenta`
    },
    {
      id: 'prevodnik-jednotek',
      name: t('categories.unit_converter'),
      description: t('categories.unit_converter_description'),
      icon: <Ruler className="w-8 h-8 text-green-500" />,
      href: `/calculator/prevodnik-jednotek`
    },
    {
      id: 'bmi',
      name: t('categories.bmi'),
      description: t('categories.bmi_description'),
      icon: <Scale className="w-8 h-8 text-purple-500" />,
      href: `/calculator/bmi`
    },
    {
      id: 'dph',
      name: t('categories.vat'),
      description: t('categories.vat_description'),
      icon: <TrendingUp className="w-8 h-8 text-yellow-500" />,
      href: `/calculator/dph`
    },
    {
      id: 'cista-mzda',
      name: t('categories.net_salary'),
      description: t('categories.net_salary_description'),
      icon: <Calculator className="w-8 h-8 text-red-500" />,
      href: `/calculator/cista-mzda`
    },
    {
      id: 'trojclenka',
      name: t('categories.rule_of_three'),
      description: t('categories.rule_of_three_description'),
      icon: <Zap className="w-8 h-8 text-orange-500" />,
      href: `/calculator/trojclenka`
    },
    {
      id: 'fitness-a-zdravi',
      name: t('categories.health_fitness'),
      description: t('categories.health_fitness_description'),
      icon: <Droplets className="w-8 h-8 text-pink-500" />,
      href: `/calculator/fitness-a-zdravi`
    },
    {
      id: 'pravidla',
      name: t('categories.math_rules'),
      description: t('categories.math_rules_description'),
      icon: <Shield className="w-8 h-8 text-teal-500" />,
      href: `/calculator/pravidla`
    }
  ];

  // Most used calculators
  const popularCalculators = categories.slice(0, 3);

  // FAQ items
  const faqItems = [
    {
      question: t('faq.how_to_use'),
      answer: t('faq.how_to_use_answer')
    },
    {
      question: t('faq.are_calculations_accurate'),
      answer: t('faq.are_calculations_accurate_answer')
    },
    {
      question: t('faq.supported_languages'),
      answer: t('faq.supported_languages_answer')
    },
    {
      question: t('faq.mobile_friendly'),
      answer: t('faq.mobile_friendly_answer')
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Banner */}
      <AdBanner placement="header" />

      {/* Hero Section */}
      <section className="text-center my-16 md:my-24">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('homepage.hero.title')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          {t('homepage.hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/calculator`}>
            <Button size="lg" className="gap-2">
              {t('homepage.hero.cta_primary')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            {t('homepage.hero.cta_secondary')}
          </Button>
        </div>
      </section>

      {/* In-content Ad */}
      <AdBanner placement="in-content" className="my-12" />

      {/* Most Used Calculators */}
      <section className="my-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          {t('homepage.mostUsedCalculators.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularCalculators.map((calc) => (
            <Link 
              key={calc.id}
              href={calc.href}
              className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  {calc.icon}
                </div>
                <h3 className="text-lg font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {calc.name}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {calc.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="my-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            {t('homepage.categories.title')}
          </h2>
          <Link 
            href={`/calculator`}
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-sm font-medium"
          >
            {t('homepage.categories.view_all')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
            >
              <div className="mb-4">
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {category.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust & Proof Section */}
      <section className="my-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {t('homepage.trustProof.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            {t('homepage.trustProof.description')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">141+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t('homepage.trustProof.calculators')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">100%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t('homepage.trustProof.accuracy')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">4+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t('homepage.trustProof.languages')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">24/7</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t('homepage.trustProof.support')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Ad */}
      <AdBanner placement="in-content" className="my-12" />

      {/* FAQ Section */}
      <section className="my-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t('homepage.faq.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('homepage.faq.subtitle')}
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-4 cursor-pointer bg-white dark:bg-gray-800">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {item.question}
                  </h3>
                  <svg className="w-5 h-5 text-gray-500 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 pt-0 text-gray-600 dark:text-gray-300">
                  {item.answer}
                </div>
              </details>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="my-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          {t('homepage.cta.title')}
        </h2>
        <p className="text-blue-100 max-w-2xl mx-auto mb-8">
          {t('homepage.cta.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/calculator`}>
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 gap-2">
              {t('homepage.cta.primary_button')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
            {t('homepage.cta.secondary_button')}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
