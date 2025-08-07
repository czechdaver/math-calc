import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales } from './i18n/settings';

// URL migration map for 301 redirects
const urlMigrationMap: Record<string, string> = {
  // Single calculators
  '/calculator/dph': '/calculator/vat',
  '/calculator/cista-mzda': '/calculator/net-salary',
  '/calculator/prevodnik-jednotek': '/calculator/unit-converter',
  '/calculator/zlomky': '/calculator/fractions',
  
  // Percentage calculators
  '/calculator/procenta': '/calculator/percentages',
  '/calculator/procenta/procento-z-cisla': '/calculator/percentages/percentage-of',
  '/calculator/procenta/kolik-procent-je-x-z-y': '/calculator/percentages/what-percent',
  '/calculator/procenta/y-je-x-kolik-je-sto': '/calculator/percentages/x-is-what-percent',
  
  // Rule of three
  '/calculator/trojclenka': '/calculator/rule-of-three',
  '/calculator/trojclenka/prima-umera': '/calculator/rule-of-three/direct',
  '/calculator/trojclenka/neprima-umera': '/calculator/rule-of-three/inverse',
  
  // Finance calculators
  '/calculator/financie-rozsirene': '/calculator/finance',
  '/calculator/financie-rozsirene/slozene-uroceni': '/calculator/finance/compound-interest',
  '/calculator/financie-rozsirene/anuitni-splatka': '/calculator/finance/annuity',
  '/calculator/financie-rozsirene/predcasne-splaceni': '/calculator/finance/early-repayment',
  '/calculator/financie-rozsirene/roi': '/calculator/finance/roi',
  '/calculator/financie-rozsirene/npv': '/calculator/finance/npv',
  '/calculator/financie-rozsirene/irr': '/calculator/finance/irr',
  
  // Health & fitness calculators
  '/calculator/fitness-a-zdravi': '/calculator/health',
  '/calculator/fitness-a-zdravi/kalkulacka-1': '/calculator/health/bmr',
  '/calculator/fitness-a-zdravi/kalkulacka-2': '/calculator/health/calories',
  '/calculator/fitness-a-zdravi/kalkulacka-3': '/calculator/health/ideal-weight',
  '/calculator/fitness-a-zdravi/kalkulacka-4': '/calculator/health/body-fat',
  '/calculator/fitness-a-zdravi/kalkulacka-5': '/calculator/health/age',
  '/calculator/fitness-a-zdravi/kalkulacka-6': '/calculator/health/tip',
  
  // Practical calculators
  '/calculator/prakticke-vypocty': '/calculator/practical',
  '/calculator/prakticke-vypocty/kalkulacka-1': '/calculator/practical/discount',
  '/calculator/prakticke-vypocty/kalkulacka-2': '/calculator/practical/fuel',
  '/calculator/prakticke-vypocty/kalkulacka-3': '/calculator/practical/time',
  '/calculator/prakticke-vypocty/kalkulacka-4': '/calculator/practical/currency',
  '/calculator/prakticke-vypocty/kalkulacka-5': '/calculator/practical/loan',
  '/calculator/prakticke-vypocty/kalkulacka-6': '/calculator/practical/material',
  
  // Construction calculators
  '/calculator/stavebni': '/calculator/construction',
  '/calculator/stavebni/beton': '/calculator/construction/concrete',
  '/calculator/stavebni/izolace': '/calculator/construction/insulation',
  '/calculator/stavebni/materialy': '/calculator/construction/materials',
  '/calculator/stavebni/objem': '/calculator/construction/volume',
  '/calculator/stavebni/plocha': '/calculator/construction/area',
};

// Create next-intl middleware
const nextIntlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'cs',
  localePrefix: 'always'
});

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check for URL migrations - handle both with and without locale prefix
  for (const [oldPath, newPath] of Object.entries(urlMigrationMap)) {
    // Check direct match (without locale)
    if (pathname === oldPath) {
      return NextResponse.redirect(new URL(`/cs${newPath}`, request.url), 301);
    }
    
    // Check with locale prefix
    for (const locale of locales) {
      if (pathname === `/${locale}${oldPath}`) {
        return NextResponse.redirect(new URL(`/${locale}${newPath}`, request.url), 301);
      }
    }
  }
  
  // Apply next-intl middleware for internationalization
  return nextIntlMiddleware(request);
}

export const config = {
  // Match all paths except for static files and API routes
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
