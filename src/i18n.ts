/**
 * i18n configuration for MathCalc Pro
 * Defines supported locales and locale-related utilities
 */

/**
 * List of supported locales in the application
 * Each locale should have a corresponding folder in public/locales/
 */
export const locales = ['cs', 'en', 'sk', 'pl', 'hu'] as const;

export type Locale = (typeof locales)[number];

/**
 * Default locale used as a fallback when the user's preferred language is not supported
 */
export const defaultLocale: Locale = 'cs';

/**
 * Locale display names in their native language
 */
export const localeNames: Record<Locale, string> = {
  cs: 'Čeština',
  en: 'English',
  sk: 'Slovenčina',
  pl: 'Polski',
  hu: 'Magyar',
};

/**
 * Locale flag emojis
 */
export const localeFlags: Record<Locale, string> = {
  cs: '🇨🇿',
  en: '🇬🇧',
  sk: '🇸🇰',
  pl: '🇵🇱',
  hu: '🇭🇺',
};

/**
 * Check if a string is a valid locale
 * @param locale The locale to check
 * @returns boolean indicating if the locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Get the user's preferred locale from the Accept-Language header or navigator.languages
 * @param acceptLanguage The Accept-Language header string or navigator.languages array
 * @returns The preferred locale or the default locale if none match
 */
export function getPreferredLocale(
  acceptLanguage: string | readonly string[] | undefined
): Locale {
  if (!acceptLanguage) return defaultLocale;

  const languages = Array.isArray(acceptLanguage)
    ? acceptLanguage
    : (acceptLanguage as string).split(',').map((lang) => {
        const [locale] = lang.trim().split(';');
        return locale.split('-')[0];
      });

  for (const lang of languages) {
    const locale = lang.toLowerCase();
    if (isValidLocale(locale)) {
      return locale;
    }
  }

  return defaultLocale;
}

/**
 * Get the display name of a locale
 * @param locale The locale code
 * @returns The display name of the locale or the default locale name if not found
 */
export function getLocaleName(locale: string): string {
  return isValidLocale(locale) ? localeNames[locale] : localeNames[defaultLocale];
}

/**
 * Get the flag emoji for a locale
 * @param locale The locale code
 * @returns The flag emoji for the locale or the default locale flag if not found
 */
export function getLocaleFlag(locale: string): string {
  return isValidLocale(locale) ? localeFlags[locale] : localeFlags[defaultLocale];
}

/**
 * Get the path for a given locale
 * @param pathname The current pathname
 * @param locale The target locale
 * @returns The path with the locale segment updated
 */
export function getLocalizedPath(pathname: string, locale: string): string {
  const segments = pathname.split('/');
  
  // If the first segment is a supported locale, replace it
  if (isValidLocale(segments[1] as Locale)) {
    segments[1] = locale;
  } else {
    // Otherwise, insert the locale after the first slash
    segments.splice(1, 0, locale);
  }
  
  return segments.join('/');
}

/**
 * Get the current locale from a pathname
 * @param pathname The current pathname
 * @returns The current locale or the default locale if not found
 */
export function getCurrentLocale(pathname: string): Locale {
  const segments = pathname.split('/');
  const maybeLocale = segments[1]?.toLowerCase();
  
  return isValidLocale(maybeLocale) ? maybeLocale : defaultLocale;
}

/**
 * Format a number according to locale-specific conventions
 * @param value The number to format
 * @param locale The target locale
 * @param options Intl.NumberFormatOptions
 * @returns Formatted number string
 */
export function formatNumber(
  value: number,
  locale: string,
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format a date according to locale-specific conventions
 * @param date The date to format
 * @param locale The target locale
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  locale: string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
    
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj);
}

/**
 * RTL (Right-to-Left) language support
 */
export const rtlLocales = ['ar', 'he', 'fa', 'ur'] as const;

type RtlLocale = (typeof rtlLocales)[number];

/**
 * Check if a locale is RTL
 * @param locale The locale to check
 * @returns boolean indicating if the locale is RTL
 */
export function isRtl(locale: string): boolean {
  return (rtlLocales as readonly string[]).includes(locale);
}

/**
 * Get the text direction for a locale
 * @param locale The locale
 * @returns 'rtl' or 'ltr'
 */
export function getTextDirection(locale: string): 'rtl' | 'ltr' {
  return isRtl(locale) ? 'rtl' : 'ltr';
}
