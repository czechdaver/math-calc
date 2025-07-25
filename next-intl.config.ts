import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// List of supported locales
export const locales = ['cs', 'en', 'sk', 'pl', 'hu'] as const;

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    locale,
    messages: (await import(`./src/messages/${locale}.json`)).default,
    // You can add other i18n config options here
    timeZone: 'Europe/Prague',
    now: new Date(),
  };
});
