import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params?.locale || 'en';
  
  const title = locale === 'cs' 
    ? 'Kalkulátor čisté mzdy - Výpočet mzdy po zdanění'
    : 'Net Salary Calculator - Calculate Take-Home Pay';
    
  const description = locale === 'cs'
    ? 'Bezplatný kalkulátor čisté mzdy. Vypočítejte si čistou mzdu z hrubé mzdy po odečtení daní a pojistných odvodů. Rychlý a přesný výpočet.'
    : 'Free net salary calculator. Calculate your take-home pay from gross salary after taxes and deductions. Fast and accurate calculation.';
  
  return {
    title,
    description,
    keywords: [
      locale === 'cs' ? 'čistá mzda' : 'net salary',
      locale === 'cs' ? 'hrubá mzda' : 'gross salary',
      locale === 'cs' ? 'kalkulátor mzdy' : 'salary calculator',
      locale === 'cs' ? 'daně' : 'taxes',
      locale === 'cs' ? 'pojistné odvody' : 'deductions',
      'payroll',
      'finance',
      'employment',
      locale,
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale,
      url: `${siteConfig.url}/${locale}/calculator/net-salary`,
      siteName: siteConfig.name,
    },
    alternates: {
      canonical: `${siteConfig.url}/${locale}/calculator/net-salary`,
      languages: {
        'cs': `${siteConfig.url}/cs/calculator/net-salary`,
        'en': `${siteConfig.url}/en/calculator/net-salary`,
      },
    },
  };
}