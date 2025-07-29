'use client';

import React, { Suspense, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { Skeleton } from '../../../../../components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import Tooltip from '@/components/ui/tooltip';

// Dynamically import components with loading states
const LatexRenderer = dynamic(() => import('@/components/utils/LatexRenderer'), {
  loading: () => <Skeleton className="h-6 w-full" />,
  ssr: false,
});

const SeoMetadata = dynamic(() => import('@/components/seo/SeoMetadata'), {
  ssr: false,
});

// Dynamically import the calculator component with SSR disabled and loading state
const ProcentoZCislaCalculator = dynamic(
  () =>
    import('@/components/calculators/PercentageOfNumberCalculator').then(
      (mod) => mod.default,
      (err) => {
        console.error('Failed to load calculator component:', err);
        return () => <div>Error loading calculator. Please try again.</div>;
      }
    ),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-1/2 mx-auto" />
      </div>
    ),
  }
);

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

const ProcentoZCislaPage: React.FC = () => {
  const t = useTranslations('common');

  // Memoize translations to prevent unnecessary re-renders
  const translations = useMemo(() => ({
    seoTitle: t('procento_z_cisla_title') || 'Procento z čísla',
    seoDescription: t('procento_z_cisla_seo_description') || 'Vypočítejte X procent z daného čísla. Zadejte procenta a číslo pro výpočet.',
    formula: t('procento_z_cisla_formula') || '\\text{Výsledek} = \\frac{\\text{Procenta}}{100} \\times \\text{Číslo}',
    explanation: t('procento_z_cisla_explanation') || 'Výpočet procent z čísla se používá pro zjištění, jakou hodnotu představuje dané procento z celku. Tento výpočet je užitečný například při výpočtu slev, daní, přirážek a dalších procentuálních hodnot.',
    tip: t('procento_z_cisla_tip') || 'Zadejte hodnoty do kalkulačky pro okamžitý výpočet.',
    tipText: t('procento_z_cisla_tip_text') || 'Zadejte hodnoty do kalkulačky pro okamžitý výpočet.',
    example: t('priklad') || 'Příklad',
    exampleText: t('procento_z_cisla_priklad') || 'Kolik je 20% z 150?',
    result: t('vysledek') || 'Výsledek',
    calculator: t('kalkulacka') || 'Kalkulačka',
    howToCalculate: t('jak_pocitat') || 'Jak počítat',
    loadingError: t('chyba_nacitani') || 'Nepodařilo se načíst kalkulačku. Zkuste prosím obnovit stránku.'
  }), [t]);

  const { seoTitle, seoDescription, formula, explanation } = translations;

  // No loading state needed for next-intl translations

  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<Skeleton className="h-8 w-1/3 mb-6" />}>
        <SeoMetadata title={seoTitle} description={seoDescription} />
      </Suspense>

      <h1 className="text-3xl font-bold mb-6">{seoTitle}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{translations.calculator}</CardTitle>
            </CardHeader>
            <CardContent>
              <ErrorBoundary 
                fallback={
                  <div className="text-destructive p-4 rounded-lg bg-destructive/10">
                    <p>{translations.loadingError}</p>
                  </div>
                }
              >
                <Suspense fallback={
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-1/2 mx-auto" />
                  </div>
                }>
                  <ProcentoZCislaCalculator />
                </Suspense>
              </ErrorBoundary>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{translations.howToCalculate} {translations.seoTitle.toLowerCase()}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Suspense fallback={
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton 
                      key={i} 
                      className={`h-4 ${i === 0 ? 'w-full' : i === 1 ? 'w-5/6' : i === 2 ? 'w-4/6' : 'w-3/6'}`} 
                    />
                  ))}
                </div>
              }>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p>{explanation}</p>
                  <div className="my-4 p-4 bg-muted/50 rounded-lg">
                    <LatexRenderer formula={formula} displayMode={true} />
                  </div>
                  <p>
                    <strong>{translations.example}:</strong> {translations.exampleText}
                  </p>
                  <p className="text-muted-foreground italic">
                    {translations.result}: 30
                  </p>
                </div>
              </Suspense>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {t('tip') || 'Tip'}
                <Tooltip 
                  content={translations.tip}
                  position="top"
                >
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {translations.tipText}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">{t('dalsi_informace') || 'Další informace'}</h2>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p>
            {t('procento_z_cisla_dalsi_info') || 
            'Výpočet procent z čísla je základní matematická operace, která se používá v každodenním životě. ' +
            'S touto kalkulačkou můžete snadno vypočítat jakoukoliv procentuální hodnotu z libovolného čísla. ' +
            'Stačí zadat percentages a číslo, ze kterého chcete percentages vypočítat.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcentoZCislaPage;
