import {getRequestConfig} from 'next-intl/server';
import {isLocale, Locale} from './src/i18n/settings';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  const validLocale: Locale = locale && isLocale(locale) ? locale : 'cs';

  return {
    locale: validLocale,
    messages: (await import(`./src/messages/${validLocale}.json`)).default
  };
});
