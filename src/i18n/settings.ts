import { notFound } from 'next/navigation';

export const locales = ['en', 'cs'] as const;
export type Locale = typeof locales[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocale(locale: string): Locale {
  if (!isLocale(locale)) notFound();
  return locale;
}
