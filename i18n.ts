import {getRequestConfig} from 'next-intl/server';
import {locales} from './src/i18n/settings';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  const validLocale = locale && locales.includes(locale as any) ? locale : 'cs';

  return {
    locale: validLocale,
    messages: (await import(`./src/messages/${validLocale}.json`)).default
  };
});
