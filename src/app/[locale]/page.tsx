"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/hooks/useTranslations';
import { Calculator, Percent, Ruler, Scale, TrendingUp, Search, ArrowRight, Users, Shield, Star, Heart, ChevronDown } from 'lucide-react';
import AdBanner from '@/components/ads/AdBanner';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Accordion from '@/components/ui/Accordion';

const HomePage: React.FC = () => {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Only use for components that actually cause hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Popular calculators data
  const popularCalculators = [
    {
      id: 'procenta',
      name: t('categories.percentages'),
      description: t('categories.percentages_description'),
      icon: <Percent className="w-8 h-8 text-blue-500" />,
      href: `/calculator/percentages`,
      rating: 4.8
    },
    {
      id: 'bmi',
      name: t('categories.bmi'),
      description: t('categories.bmi_description'),
      icon: <Scale className="w-8 h-8 text-purple-500" />,
      href: `/calculator/bmi`,
      rating: 4.9
    },
    {
      id: 'dph',
      name: t('categories.vat'),
      description: t('categories.vat_description'),
      icon: <TrendingUp className="w-8 h-8 text-green-500" />,
      href: `/calculator/vat`,
      rating: 4.7
    }
  ];

  // Calculator categories
  const calculatorCategories = [
    {
      name: t('categories.mathematics'),
      icon: <Calculator className="w-8 h-8" />,
      count: 12,
      color: 'bg-blue-500'
    },
    {
      name: t('categories.percentages'),
      icon: <Percent className="w-8 h-8" />,
      count: 8,
      color: 'bg-purple-500'
    },
    {
      name: t('categories.health'),
      icon: <Heart className="w-8 h-8" />,
      count: 6,
      color: 'bg-red-500'
    },
    {
      name: t('categories.finance'),
      icon: <TrendingUp className="w-8 h-8" />,
      count: 10,
      color: 'bg-green-500'
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
    <div className="min-h-screen bg-white">
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
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              {t('homepage.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
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
                  className="w-full px-4 py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
      <section id="calculators" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('homepage.popular_calculators')}
            </h2>
            <p className="text-lg text-gray-600">Quick access to our most frequently used tools</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCalculators.map((calc) => (
              <Link key={calc.id} href={calc.href} className="group">
                <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-blue-300 group-hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {calc.icon}
                        <CardTitle className="text-xl ml-3">{calc.name}</CardTitle>
                      </div>
                      <div className="flex items-center text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">{calc.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{calc.description}</CardDescription>
                    <div className="flex items-center text-blue-600 font-medium">
                      <span>Try it now</span>
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('homepage.calculator_categories')}
            </h2>
            <p className="text-lg text-gray-600">Explore all our calculation tools organized by category</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {calculatorCategories.map((category, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`${category.color} text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                    {category.icon}
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {category.count} calculators available
                  </CardDescription>
                  <Button variant="outline" size="sm" className="w-full">
                    Explore Category
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {t('homepage.trusted_by')}
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{t('homepage.user_count')}</div>
                  <div className="text-gray-600">Active users</div>
                </div>
              </div>
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500 mr-3 fill-current" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">4.8/5</div>
                  <div className="text-gray-600">Average rating</div>
                </div>
              </div>
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-gray-600">Secure & Private</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Only render Accordion on client */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('homepage.faq_title')}
            </h2>
            <p className="text-lg text-gray-600">Common questions about our calculators</p>
          </div>
          
          {isMounted && (
            <Accordion allowMultiple className="space-y-4">
              {faqItems.map((item, index) => (
                <Accordion.Item
                  key={index}
                  title={item.question}
                  className="bg-white rounded-lg border border-gray-200"
                >
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </Accordion.Item>
              ))}
            </Accordion>
          )}
        </div>
      </section>

      {/* Footer Ad Banner */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdBanner 
            placement="sticky-bottom" 
            className="py-4 min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
