// src/components/layout/SimpleCalculatorLayout.tsx
'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CardContent, CardDescription, CardHeader, CardTitle, Card } from '@/components/ui/Card'; // Keep these for content structure
import GlassCard from '@/components/shared/GlassCard';
import { Button } from '@/components/ui/Button';
import { Calculator, Info, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getCalculatorCategories, getQuickLinks } from '@/lib/calculatorDataUtils';
import { CalculatorRating } from '@/components/calculators/shared';
import { getCategoryBranding } from '@/config/category-branding';
import AdPlaceholder from '@/components/shared/AdPlaceholder';
import SimpleBadge from '@/components/shared/SimpleBadge';
import SimpleFAQ from '@/components/shared/SimpleFAQ';
import RelatedCalculators from '@/components/shared/RelatedCalculators';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

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
  seo,
  formula,
  children,
  resultSection,
  examples,
  faq,

  schemaData
}) => {
  const t = useTranslations();
  const params = useParams();
  const locale = params?.locale as string || 'cs';

  // Load centralized data for quick links and categories
  const popularLinks = getQuickLinks('popular', locale, t);
  const calculatorCategories = getCalculatorCategories(locale, t);
  const { showModal, setShowModal } = useAdBlockDetection();

  // Map normalized category string to ID for branding
  const getBrandingId = (cat: string) => {
    const lowerCat = cat.toLowerCase();
    if (lowerCat.includes('financ') || lowerCat.includes('money')) return 'finance';
    if (lowerCat.includes('health') || lowerCat.includes('zdrav') || lowerCat.includes('body')) return 'health';
    if (lowerCat.includes('math') || lowerCat.includes('mat')) return 'math';
    if (lowerCat.includes('construct') || lowerCat.includes('stav')) return 'construction';
    if (lowerCat.includes('practic') || lowerCat.includes('prakt')) return 'practical';
    if (lowerCat.includes('util') || lowerCat.includes('nástroj')) return 'utility';
    return 'others';
  };

  const brandingId = getBrandingId(category);
  const branding = getCategoryBranding(brandingId);
  const CategoryIcon = branding.icon;

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

      <div className="min-h-screen bg-transparent pb-10">

        {/* Category Ambient Background */}
        <div className={cn(
          "fixed top-0 left-0 right-0 h-[500px] pointer-events-none -z-10 bg-gradient-to-b opacity-40 dark:opacity-20",
          {
            "from-emerald-500/20 to-transparent": branding.id === 'finance',
            "from-rose-500/20 to-transparent": branding.id === 'health',
            "from-indigo-500/20 to-transparent": branding.id === 'math',
            "from-amber-500/20 to-transparent": branding.id === 'construction',
            "from-blue-500/20 to-transparent": branding.id === 'practical',
            "from-gray-500/20 to-transparent": branding.id === 'utility',
            "from-slate-500/20 to-transparent": branding.id === 'others',
          }
        )} />

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Breadcrumb Navigation */}
              <Breadcrumbs
                items={[
                  { label: t('common.all_calculators'), href: `/${locale}/calculators` },
                  { label: category, href: `/${locale}/calculator/${category.toLowerCase()}` },
                  { label: title }
                ]}
                homeHref={`/${locale}`}
              />

              {/* Header Section */}
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between w-full">
                    <SimpleBadge variant="secondary" className={cn("text-sm px-3 py-1 border shadow-sm flex items-center w-fit gap-1.5",
                      branding.id === 'finance' ? "bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 border-emerald-500/30 text-emerald-700 dark:text-emerald-400" :
                        branding.id === 'health' ? "bg-gradient-to-br from-rose-500/10 to-rose-500/20 border-rose-500/30 text-rose-700 dark:text-rose-400" :
                          branding.id === 'math' ? "bg-gradient-to-br from-indigo-500/10 to-indigo-500/20 border-indigo-500/30 text-indigo-700 dark:text-indigo-400" :
                            branding.id === 'construction' ? "bg-gradient-to-br from-amber-500/10 to-amber-500/20 border-amber-500/30 text-amber-700 dark:text-amber-400" :
                              branding.id === 'practical' ? "bg-gradient-to-br from-blue-500/10 to-blue-500/20 border-blue-500/30 text-blue-700 dark:text-blue-400" :
                                branding.id === 'utility' ? "bg-gradient-to-br from-gray-500/10 to-gray-500/20 border-gray-500/30 text-gray-700 dark:text-gray-400" :
                                  "bg-secondary text-secondary-foreground"
                    )}>
                      <CategoryIcon className="w-3.5 h-3.5" />
                      {category}
                    </SimpleBadge>

                    <CalculatorRating
                      calculatorId={calculatorId || 'unknown'}
                      className=""
                    />
                  </div>

                  <div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground tracking-tight mb-4 drop-shadow-sm">
                      {title}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">{description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {/* Calculator Input & Result Section */}
                <div className="space-y-8">
                  <GlassCard variant="glass" className="overflow-hidden border-t-4 border-t-primary/60 py-8 shadow-xl">
                    <CardHeader className="pb-4 border-b border-border/40">
                      <CardTitle className="text-2xl flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Calculator className="w-6 h-6" />
                        </div>
                        {t('common.calculator')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8 pt-8">
                      {children}
                    </CardContent>
                  </GlassCard>

                  {/* In-Content Ad */}
                  <div className="flex justify-center py-4">
                    <AdPlaceholder
                      size="300x250"
                      position="In-Content"
                      className="w-[300px] h-[250px] rounded-xl overflow-hidden shadow-sm border border-border/50 bg-background/50"
                    />
                  </div>

                  {resultSection && (
                    <div id="results-section" className="scroll-mt-24">
                      <GlassCard variant="default" className={cn("border-primary/20 py-8 shadow-lg ring-1 ring-primary/10",
                        // Use gradient based on category or default to primary if not specific enough? 
                        // The user asked for "color it in same style but in category color"
                        // branding.bgColor is typically like "bg-emerald-500/10". We can try to use that or construct a gradient.
                        // Let's reuse the branding colors data to create a subtle gradient.
                        "bg-gradient-to-br",
                        branding.id === 'finance' ? "from-emerald-500/5 via-emerald-500/10 to-emerald-500/5 ring-emerald-500/10 border-emerald-500/20" :
                          branding.id === 'health' ? "from-rose-500/5 via-rose-500/10 to-rose-500/5 ring-rose-500/10 border-rose-500/20" :
                            branding.id === 'math' ? "from-indigo-500/5 via-indigo-500/10 to-indigo-500/5 ring-indigo-500/10 border-indigo-500/20" :
                              branding.id === 'construction' ? "from-amber-500/5 via-amber-500/10 to-amber-500/5 ring-amber-500/10 border-amber-500/20" :
                                branding.id === 'practical' ? "from-blue-500/5 via-blue-500/10 to-blue-500/5 ring-blue-500/10 border-blue-500/20" :
                                  branding.id === 'utility' ? "from-gray-500/5 via-gray-500/10 to-gray-500/5 ring-gray-500/10 border-gray-500/20" :
                                    "from-primary/5 via-primary/10 to-primary/5"
                      )}>
                        <CardHeader className={cn("pb-4 border-b",
                          branding.id === 'finance' ? "border-emerald-500/10" :
                            branding.id === 'health' ? "border-rose-500/10" :
                              branding.id === 'math' ? "border-indigo-500/10" :
                                branding.id === 'construction' ? "border-amber-500/10" :
                                  "border-primary/10"
                        )}>
                          <CardTitle className={cn("flex items-center gap-3 text-2xl", branding.color)}>
                            <div className={cn("p-2 rounded-lg", branding.bgColor, branding.color)}>
                              <TrendingUp className="w-6 h-6" />
                            </div>
                            {t('common.results')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-8">
                          {resultSection}
                        </CardContent>
                      </GlassCard>
                    </div>
                  )}
                </div>
              </div>

              {/* Formula Section */}
              {formula && (
                <GlassCard className="py-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        <Info className="w-5 h-5" />
                      </div>
                      {t('common.formula')}
                    </CardTitle>
                    <CardDescription className="text-base pt-2">{formula.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="bg-muted/30 border border-border/50 p-8 rounded-2xl flex justify-center overflow-x-auto shadow-inner">
                      {BlockMath && <BlockMath math={formula.latex} />}
                    </div>
                  </CardContent>
                </GlassCard>
              )}

              {/* Examples and Explanation */}
              {examples && (
                <GlassCard className="py-8">
                  <CardHeader>
                    <CardTitle className="text-2xl">{examples.title}</CardTitle>
                    <CardDescription className="text-base pt-2">{examples.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8 pt-6">
                    {examples.scenarios?.map((scenario, index) => (
                      <div key={index} className="relative pl-8 border-l-2 border-primary/20">
                        <h4 className="font-semibold text-xl text-foreground mb-2 flex items-center gap-2">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          {scenario.title}
                        </h4>
                        <p className="text-muted-foreground mb-4 text-base leading-relaxed">{scenario.description}</p>
                        {scenario.example && (
                          <div className="bg-muted/40 p-4 rounded-xl font-mono text-sm border border-border/50 text-foreground/90 shadow-sm">
                            {scenario.example}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </GlassCard>
              )}

              {/* FAQ Section */}
              {faq && faq.length > 0 && (
                <GlassCard className="py-8 bg-gradient-to-br from-white/40 to-white/10 dark:from-slate-900/40 dark:to-slate-900/10">
                  <CardHeader>
                    <CardTitle className="text-2xl">{t('common.faq')}</CardTitle>
                    <CardDescription>Frequently asked questions about this calculator</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <SimpleFAQ faq={faq} />
                  </CardContent>
                </GlassCard>
              )}

              {/* Related Calculators */}
              {calculatorId && (
                <RelatedCalculators
                  calculatorId={calculatorId}
                  locale={locale}
                  currentCategory={category}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Sidebar Ad */}
              <div className="hidden lg:block sticky top-24">
                <div className="space-y-8">
                  <AdPlaceholder
                    size="300x250"
                    position="Sidebar"
                    className="w-full h-[250px] rounded-xl overflow-hidden shadow-sm border border-border/50 bg-background/50"
                  />

                  {/* Quick Links */}
                  <GlassCard className="overflow-hidden border-border/60">
                    <CardHeader className="p-4 bg-muted/20 border-b border-border/40">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        {t('common.quick_links')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-4">
                      <Link href={`/${locale}/calculators`} className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-primary transition-all p-2 rounded-lg hover:bg-primary/5 group mt-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Calculator className="w-4 h-4" />
                        </div>
                        {t('common.all_calculators')}
                      </Link>

                      {/* Popular calculators */}
                      {popularLinks.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest px-2 mb-1">
                            {t('quick_links_popular')}
                          </div>
                          {popularLinks.map((calc, idx) => (
                            <Link
                              key={calc.id}
                              href={calc.href}
                              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors py-2 px-2 rounded-lg hover:bg-muted/50 group"
                            >
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                {idx + 1}
                              </span>
                              <span className="line-clamp-1">{calc.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Calculator categories */}
                      {calculatorCategories.length > 0 && (
                        <div className="space-y-2 pt-3 border-t border-border/40">
                          <div className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest px-2 mb-1">
                            Kategorie
                          </div>
                          <div className="grid grid-cols-2 gap-2 px-1">
                            {calculatorCategories.slice(0, 6).map((category) => {
                              const activeBranding = getCategoryBranding(category.id); // Use category.id directly 
                              const ActiveIcon = activeBranding.icon;
                              return (
                                <Link
                                  key={category.id}
                                  href={`/${locale}/calculator/${category.id}`}
                                  className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-muted/30 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all text-center group"
                                >
                                  <div className={cn("w-8 h-8 flex items-center justify-center rounded-full transition-transform group-hover:scale-110", activeBranding.bgColor, activeBranding.color)}>
                                    <ActiveIcon className="w-4 h-4" />
                                  </div>
                                  <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors line-clamp-1">
                                    {category.title}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </GlassCard>

                  {/* Another Sidebar Ad */}
                  <AdPlaceholder
                    size="160x600"
                    position="Sidebar Bottom"
                    className="w-full h-[600px] rounded-xl overflow-hidden shadow-sm border border-border/50 bg-background/50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Ad (Mobile) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border z-40">
          <div className="flex justify-center p-2">
            <AdPlaceholder
              size="320x50"
              position="Sticky Bottom"
              className="w-[320px] h-[50px] shadow-sm"
            />
          </div>
        </div>

        {/* AdBlock Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <GlassCard className="max-w-md w-full border-destructive/20 bg-background/95 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-5 h-5" />
                  {t('layout_adblock_title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {t('layout_adblock_message')}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowModal(false)}
                    className="flex-1"
                    variant="outline"
                  >
                    {t('layout_adblock_button')}
                  </Button>
                </div>
              </CardContent>
            </GlassCard>
          </div>
        )}
      </div>
    </>
  );
};

export default SimpleCalculatorLayout;
