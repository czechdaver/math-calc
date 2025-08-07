import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params?.locale || 'en';
  
  const title = locale === 'cs' 
    ? 'DPH Kalkulátor - Výpočet daně z přidané hodnoty'
    : 'VAT Calculator - Value Added Tax Calculator';
    
  const description = locale === 'cs'
    ? 'Bezplatný DPH kalkulátor pro výpočet daně z přidané hodnoty. Jednoduše vypočítejte DPH, cenu s DPH nebo základní cenu bez DPH. Rychlý a přesný.'
    : 'Free VAT calculator for Value Added Tax calculations. Easily calculate VAT amount, price with VAT, or base price without VAT. Fast and accurate.';
  
  return {
    title,
    description,
    keywords: [
      locale === 'cs' ? 'DPH kalkulátor' : 'VAT calculator',
      locale === 'cs' ? 'daň z přidané hodnoty' : 'value added tax',
      locale === 'cs' ? 'výpočet DPH' : 'VAT calculation',
      locale === 'cs' ? 'cena s DPH' : 'price with VAT',
      locale === 'cs' ? 'cena bez DPH' : 'price without VAT',
      'tax',
      'finance',
      'business',
      locale,
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale,
      url: `${siteConfig.url}/${locale}/calculator/vat`,
      siteName: siteConfig.name,
    },
    alternates: {
      canonical: `${siteConfig.url}/${locale}/calculator/vat`,
      languages: {
        'cs': `${siteConfig.url}/cs/calculator/vat`,
        'en': `${siteConfig.url}/en/calculator/vat`,
      },
    },
  };
}