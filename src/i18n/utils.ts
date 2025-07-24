/**
 * Utility functions for i18n
 */

/**
 * Extracts the locale from a URL path
 * @param pathname The URL path (e.g., '/en/about' or '/cs/kalkulacka')
 * @returns The locale (e.g., 'en' or 'cs')
 */
export function getLocaleFromPath(pathname: string | null): string {
  if (!pathname) return 'en';
  
  // Extract the first segment of the path
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  // Check if the first segment is a supported locale
  if (firstSegment && ['en', 'cs'].includes(firstSegment)) {
    return firstSegment;
  }
  
  // Default to English if no valid locale is found
  return 'en';
}

/**
 * Validates if a string is a supported locale
 * @param locale The locale to validate
 * @returns boolean indicating if the locale is supported
 */
export function isSupportedLocale(locale: string): boolean {
  return ['en', 'cs'].includes(locale);
}
