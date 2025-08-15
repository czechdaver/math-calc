// src/components/layout/SimpleCalculatorLayout.tsx
'use client';

import React, { ReactNode, useEffect, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronRight, Home, Calculator, Info, ExternalLink, AlertCircle, Heart, BookOpen, HelpCircle, Star } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getCalculatorCategories, getQuickLinks } from '@/lib/calculatorDataUtils';
import { CalculatorRating } from '@/components/calculators/shared';
import { cn } from '@/lib/utils';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import Footer from '@/components/navigation/Footer';
import PanelHeader from '@/components/ui/PanelHeader';
import AdSlot from '@/components/ads/AdSlot';

// Dynamically import KaTeX to avoid SSR issues with loading state
const InlineMath = dynamic(() => import('react-katex').then(mod => mod.InlineMath), { 
  ssr: false,
  loading: () => <div className="h-6 bg-gray-100 animate-pulse rounded"></div>
}) as any;

const BlockMath = dynamic(() => import('react-katex').then(mod => mod.BlockMath), { 
  ssr: false,
  loading: () => <div className="h-16 bg-gray-100 animate-pulse rounded"></div>
}) as any;

// Import KaTeX CSS - only when needed
import 'katex/dist/katex.min.css';

export interface SimpleCalculatorLayoutProps {
  // Basic Info
  title: string;
  description: string;
  category: string;
  calculatorId?: string;
  enhanced?: boolean; // New prop for enhanced styling
  
  // SEO
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  
  // Formula
  formula?: {
    latex: string;
    description: string;
  };
  // Optional class override for the formula container wrapper (e.g., hide scrollbar)
  formulaContainerClassName?: string;
  
  // Main Content
  children: ReactNode;
  
  // Results Section
  resultSection?: ReactNode;
  
  // Examples & Explanation
  examples?: {
    title: string;
    description: string;
    scenarios?: Array<{
      title: string;
      description: string;
      example?: string;
    }>;
  };
  
  // FAQ
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  
  // Related Calculators
  relatedCalculators?: Array<{
    id?: string;
    title: string;
    description: string;
    href: string;
    category: string;
  }>;
  
  // Schema.org data
  schemaData?: {
    applicationCategory: string;
    operatingSystem: string;
    offers?: {
      price: string;
      priceCurrency: string;
    };
  };
}

//

// Simple Badge Component
const SimpleBadge: React.FC<{ children: ReactNode; variant?: 'default' | 'secondary' | 'outline'; className?: string }> = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  const variantClasses = {
    default: "bg-blue-600 text-white",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 text-gray-700"
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Simple FAQ Component
const SimpleFAQ: React.FC<{ faq: Array<{ question: string; answer: string }> }> = ({ faq }) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="space-y-2">
      {faq.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">{item.question}</span>
            <ChevronRight 
              className={`w-4 h-4 text-gray-500 transition-transform ${
                openItems.includes(index) ? 'rotate-90' : ''
              }`} 
            />
          </button>
          {openItems.includes(index) && (
            <div className="px-4 pt-3 pb-3 text-gray-600 text-sm border-t border-gray-100">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// AdBlock Detection Hook
const useAdBlockDetection = () => {
  const [isAdBlockEnabled, setIsAdBlockEnabled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simple AdBlock detection
    const detectAdBlock = () => {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      testAd.style.position = 'absolute';
      testAd.style.left = '-10000px';
      document.body.appendChild(testAd);
      
      setTimeout(() => {
        const isBlocked = testAd.offsetHeight === 0;
        setIsAdBlockEnabled(isBlocked);
        if (isBlocked) {
          setShowModal(true);
        }
        document.body.removeChild(testAd);
      }, 100);
    };

    detectAdBlock();
  }, []);

  return { isAdBlockEnabled, showModal, setShowModal };
};

const SimpleCalculatorLayout: React.FC<SimpleCalculatorLayoutProps> = ({
  title,
  description,
  category,
  calculatorId,
  enhanced = false,
  seo,
  formula,
  formulaContainerClassName,
  children,
  resultSection,
  examples,
  faq,
  relatedCalculators,
  schemaData
}) => {
  const t = useTranslations();
  const params = useParams();
  const locale = params?.locale as string || 'cs';
  
  // Memoize expensive data loading operations
  const popularLinks = useMemo(() => getQuickLinks('popular', locale, t), [locale, t]);
  const calculatorCategories = useMemo(() => getCalculatorCategories(locale, t), [locale, t]);
  const { showModal, setShowModal } = useAdBlockDetection();

  // Apply full-page gradient on body for enhanced pages
  useEffect(() => {
    if (enhanced) {
      document.body.classList.add('force-enhanced-bg');
      return () => {
        document.body.classList.remove('force-enhanced-bg');
      };
    }
  }, [enhanced]);

  // Memoize breadcrumb generation for performance
  const breadcrumbItems = useMemo(() => {
    const categoryKey = `categories.${category}`;
    const categoryLabelResolved = t(categoryKey);
    const categoryLabel = !categoryLabelResolved || categoryLabelResolved === categoryKey
      ? category
      : categoryLabelResolved;

    return [
      { label: t('common.home'), href: `/${locale}` },
      // Per UX: omit generic "Calculators" step unless a real listing page exists
      { label: categoryLabel },
      { label: title, current: true }
    ];
  }, [category, t, locale, title]);

  // Memoize Schema.org structured data for performance
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": title,
    "description": description,
    "applicationCategory": schemaData?.applicationCategory || "UtilityApplication",
    "operatingSystem": schemaData?.operatingSystem || "Any",
    "offers": schemaData?.offers || {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CZK"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250"
    }
  }), [title, description, schemaData]);

  return (
    <>
      {enhanced && (
        <div className="enhanced-page-bg" aria-hidden="true" />
      )}
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className={enhanced ? "min-h-screen" : "min-h-screen bg-gray-50"}>

        <div className={`container mx-auto px-4 pt-20 pb-24 lg:py-6 ${enhanced ? "enhanced-calculator-content" : ""}`}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Breadcrumb Navigation */}
              <Breadcrumbs items={breadcrumbItems} enhanced className="mb-2" />

              {/* Top Ad (Mobile) */}
              <div className="md:hidden flex justify-center mb-2">
                <AdSlot 
                  position="calc-header"
                  className="w-[320px] h-[50px]"
                />
              </div>

              {/* Page Title and Description (enhanced styling) */}
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-4">
                  <h1 className={cn(
                    "font-bold w-full text-center",
                    enhanced ? "text-3xl md:text-4xl enhanced-gradient-text" : "text-2xl text-gray-900"
                  )}>
                    {title}
                  </h1>
                </div>
                <p className={cn('text-gray-600', enhanced ? 'text-center' : '')}>{description}</p>
                {/* Keep rating visible on mobile since sidebar is hidden */}
                <div className="md:hidden">
                  <CalculatorRating 
                    calculatorId={calculatorId || 'unknown'} 
                    
                  />
                </div>
              </div>

              {/* Formula Section */}
              {formula && (
                <Card className={enhanced ? 'enhanced-card gap-0' : ''}>
                  {enhanced ? (
                    <PanelHeader
                      title={t('common.formula')}
                      subtitle={formula.description}
                      icon={Info}
                      color="indigo"
                      variant="indigo"
                    />
                  ) : (
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Info className="w-5 h-5" />
                        <div>
                          <CardTitle>{t('common.formula')}</CardTitle>
                          <CardDescription className="mt-0.5">{formula.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  )}
                  <CardContent>
                    <div className={cn("bg-gray-50 p-4 rounded-lg", formulaContainerClassName ? formulaContainerClassName : "overflow-x-auto")}> 
                      <div className="flex justify-center items-center min-w-full">
                        <div className="katex-container">
                          {BlockMath && <BlockMath math={formula.latex} />}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Calculator Input Section */}
              <Card className={enhanced ? 'enhanced-card gap-0' : ''}>
                <PanelHeader 
                  title="Parametry výpočtu"
                  icon={Calculator}
                  color="gray"
                  variant="gray"
                />
                <CardContent>
                  {children}
                </CardContent>
              </Card>

              {/* In-Content Ad */}
              <div className="flex justify-center py-4">
                <div className="md:hidden">
                  <AdSlot 
                    position="calc-in-content"
                    className="w-[320px] h-[50px]"
                  />
                </div>
                <div className="hidden md:block">
                  <AdSlot 
                    position="calc-in-content"
                    className="w-[728px] h-[90px]"
                  />
                </div>
              </div>

              {/* Results Section */}
              {resultSection && (
                <Card className={enhanced ? 'enhanced-card gap-0' : ''}>
                  {enhanced ? (
                    <PanelHeader
                      title={t('common.results')}
                      icon={Heart}
                      color="green"
                      variant="green"
                    />
                  ) : (
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5" />
                        <CardTitle>{t('common.results')}</CardTitle>
                      </div>
                    </CardHeader>
                  )}
                  <CardContent>
                    {resultSection}
                  </CardContent>
                </Card>
              )}

              {/* Examples and Explanation */}
              {examples && (
                <Card className={enhanced ? 'enhanced-card gap-0' : ''}>
                  {enhanced ? (
                    <PanelHeader
                      title={examples.title}
                      subtitle={examples.description}
                      icon={BookOpen}
                      color="purple"
                      variant="purple"
                    />
                  ) : (
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5" />
                        <div>
                          <CardTitle>{examples.title}</CardTitle>
                          <CardDescription className="mt-0.5">{examples.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  )}
                  <CardContent className=" space-y-4">
                    {examples.scenarios?.map((scenario, index) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-4">
                        <h4 className="font-semibold text-gray-900">{scenario.title}</h4>
                        <p className="text-gray-600 mt-1">{scenario.description}</p>
                        {scenario.example && (
                          <div className="bg-gray-50 p-3 rounded mt-2 font-mono text-sm">
                            {scenario.example}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* FAQ Section */}
              {faq && faq.length > 0 && (
                <Card className={enhanced ? 'enhanced-card gap-0' : ''}>
                  {enhanced ? (
                    <PanelHeader
                      title={t('common.faq')}
                      icon={HelpCircle}
                      color="indigo"
                      variant="indigo"
                    />
                  ) : (
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5" />
                        <CardTitle>{t('common.faq')}</CardTitle>
                      </div>
                    </CardHeader>
                  )}
                  <CardContent>
                    <SimpleFAQ faq={faq} />
                  </CardContent>
                </Card>
              )}

              {/* Mid-page Ad between FAQ and Related */}
              <div className="flex justify-center py-4">
                <div className="md:hidden">
                  <AdSlot 
                    position="calc-in-content"
                    className="w-[320px] h-[50px]"
                  />
                </div>
                <div className="hidden md:block">
                  <AdSlot 
                    position="calc-in-content"
                    className="w-[728px] h-[90px]"
                  />
                </div>
              </div>

              {/* Related Calculators */}
              {relatedCalculators && relatedCalculators.length > 0 && (
                <Card className={enhanced ? 'enhanced-card gap-0' : ''}>
                  {enhanced ? (
                    <PanelHeader
                      title={t('common.related_calculators')}
                      subtitle={t('common.other_useful_calculations')}
                      icon={Calculator}
                      color="blue"
                      variant="blue"
                    />
                  ) : (
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Calculator className="w-5 h-5" />
                        <div>
                          <CardTitle>{t('common.related_calculators')}</CardTitle>
                          <CardDescription className="mt-0.5">{t('common.other_useful_calculations')}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  )}
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {relatedCalculators.map((calc, index) => (
                        <Link key={index} href={calc.href}>
                          <Card variant="outlined" hoverEffect="shadow" className={cn('transition-shadow cursor-pointer')}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="enhanced-icon-wrapper">
                                  <Calculator className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{calc.title}</h4>
                                  <p className="text-sm text-gray-600 mt-0.5">{calc.description}</p>
                                  {calc.id && (
                                    <CalculatorRating 
                                      calculatorId={calc.id} 
                                      variant="view" 
                                      className="mt-2 pointer-events-none"
                                    />
                                  )}
                                  <SimpleBadge variant="outline" className="mt-2 text-xs">
                                    {calc.category}
                                  </SimpleBadge>
                                </div>
                                <ExternalLink className="w-4 h-4 text-gray-400" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Sidebar Ad */}
              <div className="hidden lg:block">
                <AdSlot 
                  position="calc-sidebar"
                  className="w-full h-[250px]"
                />
              </div>

              {/* Calculator Rating moved near Quick Links (desktop) */}
              <div className="hidden lg:block">
                <Card className={enhanced ? 'enhanced-card gap-0' : ''}>
                  {enhanced ? (
                    <PanelHeader
                      title={t('common.calculator_rating') || 'Hodnocení kalkulačky'}
                      icon={Star}
                      color="amber"
                      variant="amber"
                    />
                  ) : (
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5" />
                        <CardTitle>{t('common.calculator_rating') || 'Hodnocení kalkulačky'}</CardTitle>
                      </div>
                    </CardHeader>
                  )}
                  <CardContent className="px-3 py-4">
                    <CalculatorRating 
                      calculatorId={calculatorId || 'unknown'} 
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Quick Links */}
              <Card className={enhanced ? 'enhanced-card gap-0' : ''}>
                {enhanced ? (
                  <PanelHeader
                    title={t('common.quick_links')}
                    icon={Home}
                    color="blue"
                    variant="blue"
                    titleClassName="text-lg"
                  />
                ) : (
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Home className="w-5 h-5" />
                      <CardTitle className="text-lg">{t('common.quick_links')}</CardTitle>
                    </div>
                  </CardHeader>
                )}
                <CardContent className=" space-y-3">
                  {/* Static links */}
                  <Link href={`/${locale}`} className="flex items-center gap-2 text-sm hover:text-blue-600 transition-colors">
                    <Home className="w-4 h-4" />
                    {t('common.all_calculators')}
                  </Link>
                  
                  {/* Popular calculators */}
                  {popularLinks.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {t('quick_links_popular')}
                      </div>
                      {popularLinks.map((calc, index) => (
                        <Link 
                          key={calc.id} 
                          href={calc.href} 
                          className="flex items-center gap-2 text-sm hover:text-blue-600 transition-colors pl-2"
                        >
                          <Calculator className="w-3 h-3" />
                          {calc.title}
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {/* Calculator categories */}
                  {calculatorCategories.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Kategorie
                      </div>
                      {calculatorCategories.slice(0, 3).map((category) => (
                        <Link 
                          key={category.id} 
                          href={`/${locale}#${category.id}`} 
                          className="flex items-center gap-2 text-sm hover:text-blue-600 transition-colors pl-2"
                        >
                          <div className={`w-3 h-3 rounded-full ${category.bgColor}`}></div>
                          <span>{category.title}</span>
                          <span className="text-xs text-gray-400">({category.count})</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Another Sidebar Ad */}
              <div className="hidden lg:block">
                <AdSlot 
                  position="calc-sidebar"
                  className="w-full h-[600px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Site Footer */}
        <Footer />

        {/* Sticky Bottom Ad (Mobile) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40 pb-[env(safe-area-inset-bottom)]">
          <div className="flex justify-center p-2">
            <AdSlot 
              position="calc-sticky-bottom"
              className="w-[320px] h-[50px]"
            />
          </div>
        </div>

        {/* AdBlock Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle>Podpořte náš web</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Zjistili jsme, že používáte blokování reklam. Naše kalkulátory jsou zdarma díky reklamám. 
                  Prosím zvažte vypnutí AdBlocku pro náš web.
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowModal(false)}
                    className="flex-1"
                  >
                    Rozumím
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default SimpleCalculatorLayout;
