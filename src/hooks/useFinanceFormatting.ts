// src/hooks/useFinanceFormatting.ts
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface FinanceFormatting {
  formatCurrency: (amount: number) => string;
  formatPercentage: (value: number) => string;
  formatMonths: (months: number) => string;
  formatYears: (years: number) => string;
  formatRatio: (value: number) => string;
  locale: string;
}

export function useFinanceFormatting(): FinanceFormatting {
  const params = useParams();
  const locale = (params.locale as string) || 'cs';
  const t = useTranslations();

  const numberLocale = locale === 'cs' || locale === 'sk' ? 'cs-CZ' :
    locale === 'pl' ? 'pl-PL' :
    locale === 'hu' ? 'hu-HU' : 'en-US';

  const currencySuffix = locale === 'en' ? '' : ' Kč';
  const currencyPrefix = locale === 'en' ? '$' : '';

  const formatCurrency = (amount: number): string => {
    const formatted = amount.toLocaleString(numberLocale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return locale === 'en' ? `${currencyPrefix}${formatted}` : `${formatted}${currencySuffix}`;
  };

  const formatPercentage = (value: number): string => {
    return value.toLocaleString(numberLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + '%';
  };

  const formatMonths = (months: number): string => {
    const years = Math.floor(months / 12);
    const remainingMonths = Math.round(months % 12);

    const yearsLabel = t('finance_years_short');
    const monthsLabel = t('finance_months_short');

    if (years === 0) return `${remainingMonths} ${monthsLabel}`;
    if (remainingMonths === 0) return `${years} ${yearsLabel}`;
    return `${years} ${yearsLabel} ${remainingMonths} ${monthsLabel}`;
  };

  const formatYears = (years: number): string => {
    if (years === Infinity || isNaN(years)) return 'N/A';
    return years.toLocaleString(numberLocale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + ' ' + t('finance_years_short');
  };

  const formatRatio = (value: number): string => {
    return value.toLocaleString(numberLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return { formatCurrency, formatPercentage, formatMonths, formatYears, formatRatio, locale };
}
