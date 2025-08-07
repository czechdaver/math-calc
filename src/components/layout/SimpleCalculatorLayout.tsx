// src/components/layout/SimpleCalculatorLayout.tsx
'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronRight, Home, Calculator, Info, ExternalLink, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getCalculatorCategories, getQuickLinks } from '@/lib/calculatorDataUtils';
import { CalculatorRating } from '@/components/calculators/shared';

// Dynamically import KaTeX to avoid SSR issues
const InlineMath = dynamic(() => import('react-katex').then(mod => mod.InlineMath), { ssr: false }) as any;
const BlockMath = dynamic(() => import('react-katex').then(mod => mod.BlockMath), { ssr: false }) as any;

// Import KaTeX CSS
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

// Ad Placeholder Component
const AdPlaceholder: React.FC<{ 
  size: string; 
  position: string; 
  className?: string;
}> = ({ size, position, className = '' }) => (
  <div 
    className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 text-sm ${className}`}
    style={{ minHeight: size.includes('x') ? size.split('x')[1] + 'px' : '100px' }}
  >
    Ad Space ({size}) - {position}
  </div>
);

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
            <div className="px-4 pb-3 text-gray-600 text-sm border-t border-gray-100">
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
  
  // Load centralized data for quick links and categories
  const popularLinks = getQuickLinks('popular', locale, t);
  const calculatorCategories = getCalculatorCategories(locale, t);
  const { showModal, setShowModal } = useAdBlockDetection();

  // Generate breadcrumb
  const breadcrumbs = [
    { label: t('common.home'), href: `/${locale}` },
    { label: t('common.calculators'), href: `/${locale}` },
    { label: category, href: `/${locale}#${category.toLowerCase()}` },
    { label: title, href: '', current: true }
  ];

  // Schema.org structured data
  const structuredData = {
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
  };

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className={enhanced ? "enhanced-calculator-bg" : "min-h-screen bg-gray-50"}>

        <div className={`container mx-auto px-4 py-6 ${enhanced ? "enhanced-calculator-content" : ""}`}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Breadcrumb Navigation */}
              <nav className="text-sm text-gray-500 mb-2">
                <Link href={`/${locale}`} className="hover:text-blue-600">
                  {t('common.home')}
                </Link>
                <span className="mx-2">/</span>
                <span>{title}</span>
              </nav>

              {/* Page Title and Description with Rating */}
              <div className="space-y-3">
                {/* Title row with rating on desktop */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-4">
                  <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                  <div className="hidden md:block">
                    <CalculatorRating 
                      calculatorId={calculatorId || 'unknown'} 
                      className="" 
                    />
                  </div>
                </div>
                
                <p className="text-gray-600">{description}</p>
                
                {/* Rating on mobile - below description */}
                <div className="md:hidden">
                  <CalculatorRating 
                    calculatorId={calculatorId || 'unknown'} 
                    className="" 
                  />
                </div>
              </div>

              {/* Formula Section */}
              {formula && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      {t('common.formula')}
                    </CardTitle>
                    <CardDescription>{formula.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      {BlockMath && <BlockMath math={formula.latex} />}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Calculator Input Section */}
              <Card>
                <CardContent className="pt-6">
                  {children}
                </CardContent>
              </Card>

              {/* In-Content Ad */}
              <div className="flex justify-center py-4">
                <AdPlaceholder 
                  size="300x250" 
                  position="In-Content"
                  className="w-[300px] h-[250px]"
                />
              </div>

              {/* Results Section */}
              {resultSection && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('common.results')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {resultSection}
                  </CardContent>
                </Card>
              )}

              {/* Examples and Explanation */}
              {examples && (
                <Card>
                  <CardHeader>
                    <CardTitle>{examples.title}</CardTitle>
                    <CardDescription>{examples.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                <Card>
                  <CardHeader>
                    <CardTitle>{t('common.faq')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimpleFAQ faq={faq} />
                  </CardContent>
                </Card>
              )}

              {/* Related Calculators */}
              {relatedCalculators && relatedCalculators.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('common.related_calculators')}</CardTitle>
                    <CardDescription>{t('common.other_useful_calculations')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {relatedCalculators.map((calc, index) => (
                        <Link key={index} href={calc.href}>
                          <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{calc.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{calc.description}</p>
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
                <AdPlaceholder 
                  size="300x250" 
                  position="Sidebar"
                  className="w-full h-[250px]"
                />
              </div>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('common.quick_links')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
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
                <AdPlaceholder 
                  size="160x600" 
                  position="Sidebar Bottom"
                  className="w-full h-[600px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Ad (Mobile) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
          <div className="flex justify-center p-2">
            <AdPlaceholder 
              size="320x50" 
              position="Sticky Bottom"
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
