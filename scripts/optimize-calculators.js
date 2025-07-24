const fs = require('fs');
const path = require('path');

// Base directory for calculator pages
const CALCULATORS_DIR = path.join(__dirname, '../src/app/[locale]/calculator');

// Template for optimized calculator page
const OPTIMIZED_TEMPLATE = `'use client';

import React, { Suspense, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import Tooltip from '@/components/ui/tooltip';

// Dynamically import components with loading states
const CalculatorComponent = dynamic(() => import('@/components/calculators/{calculatorPath}'), {
  loading: () => (
    <div className="space-y-4">
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  ),
  ssr: false
});

// Error boundary for calculator component
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Calculator error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const CalculatorPage = () => {
  const { t, ready } = useTranslation('common');

  // Memoize translations to prevent unnecessary re-renders
  const translations = useMemo(() => ({
    seoTitle: t('{calculatorKey}_title') || '{Calculator Name}',
    seoDescription: t('{calculatorKey}_seo_description') || 'Calculator description',
    tip: t('{calculatorKey}_tip') || 'Enter values to calculate',
    tipText: t('{calculatorKey}_tip_text') || 'Enter values to see the calculation',
    loadingError: t('chyba_nacitani') || 'Failed to load calculator. Please try refreshing the page.'
  }), [t]);

  const { seoTitle, seoDescription, tip, tipText, loadingError } = translations;

  // Loading state for translations
  if (!ready) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Skeleton className="h-10 w-1/2 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{seoTitle}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('kalkulacka') || 'Calculator'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ErrorBoundary 
                fallback={
                  <div className="text-destructive p-4 rounded-lg bg-destructive/10">
                    <p>{loadingError}</p>
                  </div>
                }
              >
                <Suspense fallback={
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-1/2" />
                  </div>
                }>
                  <CalculatorComponent />
                </Suspense>
              </ErrorBoundary>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {t('tip') || 'Tip'}
                <Tooltip 
                  content={tip}
                  position="top"
                >
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {tipText}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;`;

// Function to optimize a calculator page
async function optimizeCalculator(calculatorPath) {
  const pagePath = path.join(CALCULATORS_DIR, calculatorPath, 'page.tsx');
  
  try {
    // Check if page exists
    if (!fs.existsSync(pagePath)) {
      console.log(`Skipping ${calculatorPath}: page.tsx not found`);
      return;
    }

    // Read existing page content
    const content = fs.readFileSync(pagePath, 'utf8');
    
    // Skip if already optimized
    if (content.includes('use client') && content.includes('Suspense') && content.includes('ErrorBoundary')) {
      console.log(`Skipping ${calculatorPath}: already optimized`);
      return;
    }

    // Generate optimized content
    const calculatorKey = calculatorPath.replace(/\//g, '_').replace(/-/g, '_');
    const calculatorName = calculatorPath
      .split('/')
      .pop()
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const optimizedContent = OPTIMIZED_TEMPLATE
      .replace(/{calculatorPath}/g, calculatorPath.replace(/\//g, '/'))
      .replace(/{calculatorKey}/g, calculatorKey)
      .replace(/{Calculator Name}/g, calculatorName);

    // Backup original file
    const backupPath = `${pagePath}.bak`;
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(pagePath, backupPath);
      console.log(`Created backup at ${backupPath}`);
    }

    // Write optimized content
    fs.writeFileSync(pagePath, optimizedContent);
    console.log(`Optimized ${calculatorPath}`);
    
  } catch (error) {
    console.error(`Error optimizing ${calculatorPath}:`, error.message);
  }
}

// Find all calculator pages
async function optimizeAllCalculators() {
  try {
    // Get all calculator directories
    const calculators = fs.readdirSync(CALCULATORS_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name !== 'components')
      .map(dirent => dirent.name);

    console.log(`Found ${calculators.length} calculators to optimize`);
    
    // Process each calculator
    for (const calculator of calculators) {
      await optimizeCalculator(calculator);
    }

    console.log('Optimization complete!');
  } catch (error) {
    console.error('Error optimizing calculators:', error);
  }
}

// Run the optimization
optimizeAllCalculators();
