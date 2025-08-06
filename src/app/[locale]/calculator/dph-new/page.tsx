// src/app/[locale]/calculator/dph-new/page.tsx
'use client';

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader2 } from 'lucide-react';

// Dynamic import with loading component
const VATCalculator = dynamic(
  () => import('@/components/calculators/VATCalculator'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Načítám DPH kalkulátor...</p>
        </div>
      </div>
    )
  }
);

// Error boundary component
function CalculatorErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
              <p className="text-gray-600">Načítám kalkulátor...</p>
            </CardContent>
          </Card>
        }>
          {children}
        </Suspense>
      </div>
    </div>
  );
}

// Metadata moved to layout or parent component since this is now a Client Component

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function VATCalculatorTestPage({ params }: PageProps) {
  // Await params in Next.js 15
  const { locale } = await params;
  
  // Basic locale validation
  const validLocales = ['cs', 'en', 'sk', 'pl', 'hu'];
  if (!validLocales.includes(locale)) {
    notFound();
  }

  return (
    <CalculatorErrorBoundary>
      <VATCalculator />
    </CalculatorErrorBoundary>
  );
}

// generateStaticParams removed - not compatible with Client Components
