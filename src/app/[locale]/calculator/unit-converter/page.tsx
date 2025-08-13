import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import SimpleCalculatorLayout from '@/components/layout/SimpleCalculatorLayout';
import EnhancedUnitConverterCalculator from '@/components/calculators/enhanced/EnhancedUnitConverterCalculator';
import { buildCalculatorMetadata } from '@/lib/metadata';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  
  try {
    return await buildCalculatorMetadata({
      locale,
      slug: 'unit-converter',
      urlPath: '/calculator/unit-converter',
      category: 'utility',
      enhancedFeatures: true,
      priority: 'high'
    });
  } catch (error) {
    console.error('Error generating metadata for unit-converter calculator:', error);
    return {
      title: 'Unit Converter Calculator',
      description: 'Convert between different units of measurement including length, weight, temperature, volume, and area.'
    };
  }
}

export default async function UnitConverterPage({ params }: PageProps) {
  const { locale } = await params;
  
  // Validate locale
  const validLocales = ['cs', 'en', 'sk', 'pl', 'hu'];
  if (!validLocales.includes(locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'calculators.unit_converter' });

  return (
    <ErrorBoundary level="page">
      <SimpleCalculatorLayout
        title={t('title', { fallback: 'Unit Converter Calculator' })}
        description={t('description', { fallback: 'Convert between different units of measurement including length, weight, temperature, volume, and area with precise calculations and helpful formulas.' })}
        category="conversion"
        enhanced={true}
        seo={{
          title: t('title', { fallback: 'Unit Converter Calculator' }),
          description: t('description', { fallback: 'Convert between different units of measurement including length, weight, temperature, volume, and area with precise calculations and helpful formulas.' }),
          keywords: [
            t('keyword_converter', { fallback: 'unit converter' }),
            t('keyword_measurement', { fallback: 'measurement conversion' }),
            t('keyword_length', { fallback: 'length conversion' }),
            t('keyword_weight', { fallback: 'weight conversion' }),
            t('keyword_temperature', { fallback: 'temperature conversion' }),
            t('keyword_volume', { fallback: 'volume conversion' }),
            t('keyword_area', { fallback: 'area conversion' }),
          ]
        }}
      >
        <ErrorBoundary level="component">
          <EnhancedUnitConverterCalculator />
        </ErrorBoundary>
      </SimpleCalculatorLayout>
    </ErrorBoundary>
  );
}